import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
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

type BenchmarkConfig = {
  targets: number;
  batchSize: number;
  concurrency: number;
  repeats: number;
};

type RequestMeasurement = {
  batchIndex: number;
  targetCount: number;
  durationMs: number;
  ok: boolean;
  error?: string;
  status?: "429" | "503" | "other";
  usage?: unknown;
};

const resultsDir = path.resolve("results");
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

function arg(name: string, fallback: number): number {
  const value = process.argv.find((item) => item.startsWith(`--${name}=`))?.split("=")[1];
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

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
  return source.existingMainLinks.some((href) => {
    try {
      const url = new URL(href, source.url);
      return siteHosts[target.site].has(url.hostname) && normalizedPath(url.toString()) === targetPath;
    } catch {
      return false;
    }
  });
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
  for (let index = 0; index < items.length; index += size) output.push(items.slice(index, index + size));
  return output;
}

function errorStatus(message: string): RequestMeasurement["status"] {
  if (message.includes("429")) return "429";
  if (message.includes("503") || message.toLowerCase().includes("service temporarily unavailable")) return "503";
  return "other";
}

async function evaluateBatch(source: PageCard, targets: PageCard[], batchIndex: number): Promise<RequestMeasurement> {
  const questions: Record<string, any> = {};
  targets.forEach((target, index) => {
    questions[`relevance_${index}`] = {
      type: "score",
      instructions: `Beoordeel uitsluitend de inhoudelijke linkkans naar doelpagina target_${index}. Geef geen extra uitleg.`,
      criteria: scoreCriteria,
    };
  });

  const started = performance.now();
  try {
    const result = await evaluate({
      model: "typesafe-ai/jev",
      state: {
        task: "Benchmark van inhoudelijke interne en cross-site linkrelevantie.",
        source: compactPage(source),
        targets: targets.map((target, index) => ({ id: `target_${index}`, page: compactPage(target) })),
      },
      questions,
    });
    return {
      batchIndex,
      targetCount: targets.length,
      durationMs: Math.round(performance.now() - started),
      ok: true,
      usage: (result as { usage?: unknown }).usage,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      batchIndex,
      targetCount: targets.length,
      durationMs: Math.round(performance.now() - started),
      ok: false,
      error: message.slice(0, 500),
      status: errorStatus(message),
    };
  }
}

async function runConfig(source: PageCard, targets: PageCard[], config: BenchmarkConfig, repeat: number) {
  const selectedTargets = targets.slice(0, config.targets);
  const targetBatches = batches(selectedTargets, config.batchSize);
  const measurements: RequestMeasurement[] = [];
  let nextIndex = 0;
  const started = performance.now();

  async function worker() {
    while (nextIndex < targetBatches.length) {
      const batchIndex = nextIndex++;
      measurements.push(await evaluateBatch(source, targetBatches[batchIndex], batchIndex));
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(config.concurrency, targetBatches.length) }, () => worker()),
  );

  const durationMs = Math.round(performance.now() - started);
  const successful = measurements.filter((item) => item.ok);
  const failed = measurements.filter((item) => !item.ok);
  return {
    repeat,
    config,
    batches: targetBatches.length,
    targetsScored: selectedTargets.length,
    durationMs,
    durationSeconds: Number((durationMs / 1000).toFixed(2)),
    pairsPerSecond: Number((selectedTargets.length / (durationMs / 1000)).toFixed(2)),
    successfulRequests: successful.length,
    failedRequests: failed.length,
    statusCounts: {
      rateLimited429: failed.filter((item) => item.status === "429").length,
      unavailable503: failed.filter((item) => item.status === "503").length,
      other: failed.filter((item) => item.status === "other").length,
    },
    requests: measurements.sort((a, b) => a.batchIndex - b.batchIndex),
  };
}

if (!process.env.AI_GATEWAY_API_KEY) {
  throw new Error("AI_GATEWAY_API_KEY ontbreekt in .env.local of de workspace-root.");
}

const pages = JSON.parse(await fs.readFile(path.join(resultsDir, "page-cards.json"), "utf8")) as PageCard[];
const eligiblePages = pages
  .filter((page) => page.status >= 200 && page.status < 400 && page.content.length > 80)
  .sort((a, b) => `${a.site}:${a.url}`.localeCompare(`${b.site}:${b.url}`));
const source = [...eligiblePages].sort((a, b) => {
  const aCount = eligiblePages.filter((target) => target.url !== a.url && !isExistingMainLink(a, target)).length;
  const bCount = eligiblePages.filter((target) => target.url !== b.url && !isExistingMainLink(b, target)).length;
  return bCount - aCount;
})[0];
const targets = eligiblePages.filter((target) => target.url !== source.url && !isExistingMainLink(source, target));
const config: BenchmarkConfig = {
  targets: Math.min(arg("targets", 50), targets.length),
  batchSize: Math.min(arg("batch", 50), targets.length),
  concurrency: arg("concurrency", 1),
  repeats: arg("repeats", 1),
};

console.log(`Bron: ${source.siteName} — ${source.title}`);
console.log(`Corpus: ${eligiblePages.length} pagina's; vaste benchmarkset: ${config.targets} doelpagina's`);
console.log(`Instellingen: batch=${config.batchSize}, concurrency=${config.concurrency}, herhalingen=${config.repeats}`);

const startedAt = new Date().toISOString();
const runs = [];
for (let repeat = 1; repeat <= config.repeats; repeat += 1) {
  console.log(`\nRun ${repeat}/${config.repeats}...`);
  const run = await runConfig(source, targets, config, repeat);
  runs.push(run);
  console.log(
    `  ${run.durationSeconds}s | ${run.pairsPerSecond} doelpagina's/s | ${run.successfulRequests}/${run.batches} requests geslaagd | 429=${run.statusCounts.rateLimited429} 503=${run.statusCounts.unavailable503}`,
  );
}

const output = {
  startedAt,
  endedAt: new Date().toISOString(),
  source: compactPage(source),
  corpusPages: eligiblePages.length,
  availableTargets: targets.length,
  runs,
};
const filename = `benchmark-${startedAt.replace(/[:.]/g, "-")}.json`;
await fs.writeFile(path.join(resultsDir, filename), JSON.stringify(output, null, 2) + "\n");
console.log(`\nRuwe meetgegevens opgeslagen in results/${filename}`);
