import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { experimental_evaluate as evaluate } from "ai";

dotenv.config({ path: ".env.local" });
if (!process.env.AI_GATEWAY_API_KEY) {
  dotenv.config({ path: path.resolve("..", ".env.local"), override: true });
}

type SiteId = "werkreturn" | "werkgroup" | "werkassist" | "werkverzuim";

type PageCard = {
  site: SiteId;
  siteName: string;
  url: string;
  title: string;
  description: string;
  h1: string;
  headings: string[];
  content: string;
  isBlog: boolean;
  existingMainLinks: string[];
  status: number;
};

type LinkScore = {
  sourceSite: SiteId;
  sourceUrl: string;
  sourceTitle: string;
  targetSite: SiteId;
  targetUrl: string;
  targetTitle: string;
  targetIsBlog: boolean;
  score: number;
  score100: number;
  confidence: number | null;
  shouldLinkProbability: number | null;
  placement: string | null;
};

const resultsDir = path.resolve("results");
const batchSize = 50;
const scoreCriteria = [
  "Geen inhoudelijke relatie",
  "Alleen oppervlakkig verwant",
  "Relevant in bredere context, maar geen logische verwijzing",
  "Inhoudelijk relevant en nuttig voor een deel van de bezoekers",
  "Sterke aanvulling of logisch inhoudelijk vervolg",
  "Directe en zeer waardevolle vervolgstap voor de bezoeker",
];
const siteHosts: Record<SiteId, Set<string>> = {
  werkreturn: new Set(["website-werkreturn.vercel.app", "werkreturn.nl", "www.werkreturn.nl"]),
  werkgroup: new Set(["werkgroup-website.vercel.app", "werkgroup.nl", "www.werkgroup.nl"]),
  werkassist: new Set(["werkassist-website.vercel.app", "werkassist.nl", "www.werkassist.nl"]),
  werkverzuim: new Set(["www.verzuimopwerk.nl", "verzuimopwerk.nl"]),
};

function normalizedPath(value: string): string {
  try {
    const pathname = new URL(value).pathname;
    return pathname.length > 1 ? pathname.replace(/\/+$/, "") : "/";
  } catch {
    return value.replace(/\/+$/, "") || "/";
  }
}

function isExistingMainLink(source: PageCard, target: PageCard): boolean {
  const targetPath = normalizedPath(target.url);
  for (const href of source.existingMainLinks) {
    try {
      const url = new URL(href, source.url);
      if (
        siteHosts[target.site].has(url.hostname) &&
        normalizedPath(url.toString()) === targetPath
      ) {
        return true;
      }
    } catch {
      // Ignore malformed links already present in the page.
    }
  }
  return false;
}

function compactPage(page: PageCard) {
  return {
    site: page.siteName,
    url: page.url,
    title: page.title,
    h1: page.h1,
    description: page.description,
    headings: page.headings.slice(0, 6),
    content: page.content.slice(0, 900),
    isBlog: page.isBlog,
  };
}

function batches<T>(items: T[], size: number): T[][] {
  const output: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    output.push(items.slice(index, index + size));
  }
  return output;
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

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function stringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function taskKey(task: { source: PageCard; targets: PageCard[] }): string {
  return `${task.source.url}::${task.targets.map((target) => target.url).join("|")}`;
}

async function evaluateBatch(source: PageCard, targets: PageCard[]): Promise<LinkScore[]> {
  const targetEntries = targets.map((target, index) => ({
    id: `target_${index}`,
    page: compactPage(target),
  }));

  const questions: Record<string, any> = {};
  for (const entry of targetEntries) {
    questions[`relevance_${entry.id}`] = {
      type: "score",
      instructions: `Beoordeel uitsluitend de inhoudelijke linkkans naar doelpagina ${entry.id}. Neem de bronpagina als uitgangspunt en let op onderwerp, doelgroep, zoekintentie, gebruikersroute en inhoudelijke aanvulling. Geef geen extra uitleg.`,
      criteria: scoreCriteria,
    };
  }

  let lastError: unknown = new Error("Onbekende fout tijdens Jev-evaluatie.");
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const result = await evaluate({
        model: "typesafe-ai/jev",
        state: {
          task: "Beoordeel mogelijke interne en cross-site links voor een netwerk van Nederlandse websites.",
          rules: [
            "Beoordeel alleen hoofdcontent; navigatie, footer en contactpagina's zijn buiten scope.",
            "Een score is een rangorde voor redactionele prioriteit, geen percentage of zekerheid.",
            "Geef geen voorkeur alleen omdat twee pagina's hetzelfde woord gebruiken.",
            "Een link moet de bezoeker inhoudelijk verder helpen.",
          ],
          source: compactPage(source),
          targets: targetEntries,
        },
        questions,
      });

      const answers = result.answers as Record<string, Record<string, unknown>>;
      return targetEntries.flatMap((entry, index) => {
        const relevance = answers[`relevance_${entry.id}`] ?? {};
        const target = targets[index];
        const score = numberOrNull(relevance.score);
        if (score === null) return [];
        return [
          {
            sourceSite: source.site,
            sourceUrl: source.url,
            sourceTitle: source.title,
            targetSite: target.site,
            targetUrl: target.url,
            targetTitle: target.title,
            targetIsBlog: target.isBlog,
            score,
            score100: Math.round((score / (scoreCriteria.length - 1)) * 100),
            confidence: numberOrNull(relevance.confidence),
            shouldLinkProbability: null,
            placement: null,
          },
        ];
      });
    } catch (error) {
      lastError = error;
      if (attempt === 3) break;
      await new Promise((resolve) => setTimeout(resolve, [5_000, 15_000, 30_000][attempt - 1] ?? 30_000));
    }
  }

  // Large requests can occasionally receive a transient provider error even
  // when smaller Jev requests succeed. Split only the failed batch so the
  // normal checkpoint layout and all completed work remain intact.
  if (targets.length > 30) {
    const midpoint = Math.ceil(targets.length / 2);
    console.log(`  batch blijft falen; splits ${targets.length} kandidaten op in ${midpoint} + ${targets.length - midpoint}`);
    const firstHalf = await evaluateBatch(source, targets.slice(0, midpoint));
    const secondHalf = await evaluateBatch(source, targets.slice(midpoint));
    return [...firstHalf, ...secondHalf];
  }

  throw lastError;
}

async function main() {
  if (!process.env.AI_GATEWAY_API_KEY) {
    throw new Error("AI_GATEWAY_API_KEY ontbreekt in .env.local of de workspace-root.");
  }

  const pages = JSON.parse(
    await fs.readFile(path.join(resultsDir, "page-cards.json"), "utf8"),
  ) as PageCard[];
  const eligiblePages = pages.filter(
    (page) => page.status >= 200 && page.status < 400 && page.content.length > 80,
  );
  const tasks: Array<{ source: PageCard; targets: PageCard[] }> = [];
  for (const source of eligiblePages) {
    const candidates = eligiblePages.filter(
      (target) => target.url !== source.url && !isExistingMainLink(source, target),
    );
    for (const targets of batches(candidates, batchSize)) {
      tasks.push({ source, targets });
    }
  }

  const partialPath = path.join(resultsDir, "link-scores.partial.json");
  type PartialResult = { batchSize?: number; completed: string[]; scores: LinkScore[] };
  let partial: PartialResult = { completed: [], scores: [] };
  try {
    const previous = JSON.parse(await fs.readFile(partialPath, "utf8")) as PartialResult;
    if (previous.batchSize === batchSize) {
      partial = previous;
    } else {
      console.log("  bestaand checkpoint heeft een andere batchgrootte en wordt overgeslagen");
    }
  } catch {
    // Start a new run when no checkpoint exists yet.
  }

  const completed = new Set(partial.completed);
  const scores = [...partial.scores];
  const remaining = tasks.filter((task) => !completed.has(taskKey(task)));
  const failed: string[] = [];
  const concurrency = remaining.length < tasks.length ? 1 : 3;
  let checkpointQueue = Promise.resolve();

  const saveCheckpoint = () => {
    checkpointQueue = checkpointQueue.then(() =>
      fs.writeFile(
        partialPath,
        JSON.stringify(
          { batchSize, completed: [...completed], scores },
          null,
          2,
        ) + "\n",
      ),
    );
    return checkpointQueue;
  };

  console.log(
    `${eligiblePages.length} bronpagina's, ${tasks.length} batches, ${remaining.length} resterend, maximaal ${concurrency} Jev-request(s) tegelijk`,
  );
  await mapConcurrent(remaining, concurrency, async (task) => {
    const key = taskKey(task);
    console.log(`  ${task.source.siteName}: ${task.source.url} (${task.targets.length} kandidaten)`);
    try {
      const result = await evaluateBatch(task.source, task.targets);
      scores.push(...result);
      completed.add(key);
      await saveCheckpoint();
    } catch (error) {
      failed.push(key);
      console.error(`  batch mislukt; blijft beschikbaar voor volgende run: ${String(error)}`);
    }
    return null;
  });
  await checkpointQueue;
  const requestCount = tasks.length;

  if (failed.length > 0) {
    throw new Error(
      `${failed.length} batches mislukt. De ${completed.size} geslaagde batches staan in results/link-scores.partial.json; voer npm run score opnieuw uit.`,
    );
  }

  scores.sort((a, b) => b.score100 - a.score100 || (b.confidence ?? 0) - (a.confidence ?? 0));
  await fs.writeFile(
    path.join(resultsDir, "link-scores.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourcePages: eligiblePages.length,
        requestCount,
        scoreScale: scoreCriteria,
        scores,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`\nKlaar: ${scores.length} linkcombinaties beoordeeld in ${requestCount} Jev-requests.`);
  console.log("Bestand: results/link-scores.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
