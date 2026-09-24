import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";

dotenv.config({ path: ".env.local" });

type SiteId = "werkreturn" | "werkgroup" | "werkassist" | "werkverzuim";

type SiteConfig = {
  id: SiteId;
  name: string;
  baseUrl: string;
};

type PageCard = {
  site: SiteId;
  siteName: string;
  url: string;
  canonical: string | null;
  status: number;
  title: string;
  description: string;
  h1: string;
  headings: string[];
  content: string;
  isBlog: boolean;
  existingMainLinks: string[];
};

const rawSites = [
  {
    id: "werkreturn",
    name: "Werkreturn",
    baseUrl:
      process.env.WERKRETURN_BASE_URL || "https://website-werkreturn.vercel.app/",
  },
  {
    id: "werkgroup",
    name: "Werkgroup",
    baseUrl:
      process.env.WERKGROUP_BASE_URL || "https://werkgroup-website.vercel.app/",
  },
  {
    id: "werkassist",
    name: "Werkassist",
    baseUrl:
      process.env.WERKASSIST_BASE_URL || "https://werkassist-website.vercel.app/",
  },
  {
    id: "werkverzuim",
    name: "Werkverzuim",
    baseUrl:
      process.env.WERKVERZUIM_BASE_URL || "https://www.verzuimopwerk.nl/",
  },
] as const;

const sites: SiteConfig[] = rawSites.map((site) => ({
  ...site,
  baseUrl: new URL(site.baseUrl).origin + "/",
}));

const excludedPath =
  /\/(contact|bedankt|login|inloggen|privacy(?:verklaring)?|voorwaarden|algemene-voorwaarden|klachtenprocedure|cookie(?:beleid)?|disclaimer)(\/|$)/i;
const blogPath = /\/(blog|kennis|nieuws)(\/|$)/i;
const maxContentCharacters = 5_000;

function decodeHtml(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    )
    .replace(/&#x([\da-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    );
}

function cleanText(value: string): string {
  return decodeHtml(value.replace(/<!--[\s\S]*?-->/g, " ").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function firstTagContent(html: string, tag: string): string {
  const match = html.match(
    new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"),
  );
  return match ? cleanText(match[1]) : "";
}

function metaContent(html: string, name: string): string {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const nameMatch = tag.match(/\bname=["']([^"']+)["']/i);
    if (nameMatch?.[1].toLowerCase() !== name.toLowerCase()) continue;
    const contentMatch = tag.match(/\bcontent=["']([^"']*)["']/i);
    return contentMatch ? cleanText(contentMatch[1]) : "";
  }
  return "";
}

function canonicalUrl(html: string, pageUrl: string): string | null {
  const match = html.match(
    /<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["']/i,
  );
  if (!match) return null;
  try {
    return new URL(match[1], pageUrl).toString();
  } catch {
    return null;
  }
}

function mainHtml(html: string): string {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
  return ["header", "nav", "footer", "aside", "script", "style", "noscript"]
    .reduce(
      (value, tag) =>
        value.replace(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, "gi"), " "),
      main,
    )
    .replace(/<[^>]+>/g, " ");
}

function mainLinks(html: string, pageUrl: string): string[] {
  const section = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
  const links = new Set<string>();
  for (const match of section.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
    const href = match[1];
    if (/^(#|mailto:|tel:|javascript:)/i.test(href)) continue;
    try {
      const url = new URL(href, pageUrl);
      url.hash = "";
      links.add(url.toString());
    } catch {
      // Ignore malformed links in the source HTML.
    }
  }
  return [...links];
}

function sitemapLocs(xml: string): string[] {
  return [...xml.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)].map((match) =>
    decodeHtml(match[1].trim()),
  );
}

async function fetchText(url: string): Promise<{ status: number; text: string }> {
  const response = await fetch(url, {
    headers: { "user-agent": "Werkgroup-link-analyse/0.1" },
    signal: AbortSignal.timeout(30_000),
  });
  return { status: response.status, text: await response.text() };
}

function normalizePageUrl(value: string, site: SiteConfig): string | null {
  try {
    const sourceUrl = new URL(value, site.baseUrl);
    if (!/^https?:$/.test(sourceUrl.protocol)) {
      return null;
    }
    // Sitemaps often contain canonical production hosts. Keep the path, but
    // fetch the page from the selected preview host.
    const url = new URL(sourceUrl.pathname, site.baseUrl);
    url.hash = "";
    url.search = "";
    if (excludedPath.test(url.pathname)) return null;
    if (/\.(xml|json|jpg|jpeg|png|gif|webp|svg|pdf)$/i.test(url.pathname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

async function discoverSitemaps(site: SiteConfig): Promise<{
  sitemapUrls: string[];
  pageUrls: string[];
}> {
  async function collect(initialSitemaps: string[]) {
    const pageUrls = new Set<string>();
    const pending = [...initialSitemaps];
    const visited = new Set<string>();

    while (pending.length > 0 && visited.size < 50) {
      const sitemapUrl = pending.shift()!;
      if (visited.has(sitemapUrl)) continue;
      visited.add(sitemapUrl);
      try {
        const response = await fetchText(sitemapUrl);
        if (response.status >= 400 || !response.text.includes("<loc")) continue;
        const locs = sitemapLocs(response.text);
        if (/<sitemapindex\b/i.test(response.text)) {
          pending.push(...locs);
        } else {
          for (const loc of locs) {
            const normalized = normalizePageUrl(loc, site);
            if (normalized) pageUrls.add(normalized);
          }
        }
      } catch {
        // A missing candidate sitemap should not prevent other sitemap sources.
      }
    }

    return { pageUrls, visited };
  }

  // Prefer the sitemap served by the selected preview. Its URLs may have
  // production canonicals, but its route set is the current preview route set.
  const primary = new URL("sitemap.xml", site.baseUrl).toString();
  let result = await collect([primary]);

  // Only consult robots/fallback sitemap locations when the primary sitemap is
  // absent or empty. This prevents a preview from accidentally importing an
  // old production WordPress sitemap with legacy URLs.
  if (result.pageUrls.size === 0) {
    const fallback = new Set<string>(
      ["sitemap_index.xml", "wp-sitemap.xml"].map((name) =>
        new URL(name, site.baseUrl).toString(),
      ),
    );
    try {
      const robots = await fetchText(new URL("robots.txt", site.baseUrl).toString());
      for (const match of robots.text.matchAll(/^sitemap:\s*(\S+)/gim)) {
        fallback.add(match[1]);
      }
    } catch {
      // Keep the conventional fallback candidates.
    }
    result = await collect([...fallback]);
  }

  return {
    sitemapUrls: [...result.visited],
    pageUrls: [...result.pageUrls].sort(),
  };
}

async function mapConcurrent<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  let nextIndex = 0;
  async function runWorker() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await worker(items[index]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => runWorker()),
  );
  return results;
}

async function pageCard(site: SiteConfig, url: string): Promise<PageCard> {
  const response = await fetchText(url);
  const content = cleanText(mainHtml(response.text));
  const headings = [
    ...response.text.matchAll(/<h[123]\b[^>]*>([\s\S]*?)<\/h[123]>/gi),
  ].map((match) => cleanText(match[1])).filter(Boolean);

  return {
    site: site.id,
    siteName: site.name,
    url,
    canonical: canonicalUrl(response.text, url),
    status: response.status,
    title: firstTagContent(response.text, "title"),
    description: metaContent(response.text, "description"),
    h1: firstTagContent(response.text, "h1"),
    headings: [...new Set(headings)].slice(0, 30),
    content: content.slice(0, maxContentCharacters),
    isBlog: blogPath.test(new URL(url).pathname),
    existingMainLinks: mainLinks(response.text, url),
  };
}

async function main() {
  const resultsDir = path.resolve("results");
  await fs.mkdir(resultsDir, { recursive: true });

  const inventories: Record<SiteId, { sitemapUrls: string[]; pageCount: number }> =
    {} as Record<SiteId, { sitemapUrls: string[]; pageCount: number }>;
  const allPages: PageCard[] = [];

  for (const site of sites) {
    console.log(`\n${site.name}: sitemaps ontdekken…`);
    const discovery = await discoverSitemaps(site);
    const urls = discovery.pageUrls;
    inventories[site.id] = {
      sitemapUrls: discovery.sitemapUrls,
      pageCount: urls.length,
    };
    console.log(`  ${urls.length} pagina-URL's gevonden`);

    const pages = await mapConcurrent(urls, 5, async (url) => {
      try {
        return await pageCard(site, url);
      } catch (error) {
        console.warn(`  kon niet ophalen: ${url} (${String(error)})`);
        return null;
      }
    });
    allPages.push(...pages.filter((page): page is PageCard => page !== null));
  }

  await fs.writeFile(
    path.join(resultsDir, "sitemap-inventory.json"),
    JSON.stringify(inventories, null, 2) + "\n",
  );
  await fs.writeFile(
    path.join(resultsDir, "page-cards.json"),
    JSON.stringify(allPages, null, 2) + "\n",
  );

  console.log(`\nKlaar: ${allPages.length} pagina-analysekaarten opgeslagen.`);
  console.log("Bestanden: results/sitemap-inventory.json en results/page-cards.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
