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

type RefinedCandidate = LinkScore & {
  refinement: "selected" | "rejected" | "uncertain";
  shouldLinkProbability: number | null;
  placement: string | null;
  placementProbability: number | null;
};

type RefinementTask = { source: PageCard; candidates: LinkScore[] };
type PartialResult = { completed: string[]; candidates: RefinedCandidate[] };

const resultsDir = path.resolve("results");
const batchSize = 20;
const placementOptions = {
  existing_sentence: "In een bestaande hoofdcontentzin met een natuurlijk ankerwoord",
  after_explanation: "Direct na een inhoudelijke uitleg of contextblok als logisch vervolg",
  next_step: "Bij een inhoudelijke vervolgstap of call-to-action in de hoofdcontent",
  list_or_bullets: "In een relevante opsomming, stappenplan of vergelijking",
  no_fit: "Geen passende plek; geen link plaatsen",
};

function compactPage(page: PageCard) {
  return {
    site: page.siteName,
    url: page.url,
    title: page.title,
    h1: page.h1,
    description: page.description,
    headings: page.headings.slice(0, 6),
    content: page.content.slice(0, 1_200),
    isBlog: page.isBlog,
  };
}

function taskKey(task: RefinementTask): string {
  return `${task.source.url}::${task.candidates.map((candidate) => candidate.targetUrl).join("|")}`;
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function answerRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function errorStatus(message: string): string {
  if (message.includes("429")) return "429";
  if (message.includes("503") || message.toLowerCase().includes("service temporarily unavailable")) return "503";
  return "other";
}

function batches<T>(items: T[], size: number): T[][] {
  const output: T[][] = [];
  for (let index = 0; index < items.length; index += size) output.push(items.slice(index, index + size));
  return output;
}

function refinementFrom(probability: number | null, placement: string | null): RefinedCandidate["refinement"] {
  if (probability === null) return "uncertain";
  if (probability >= 0.7 && placement !== "no_fit") return "selected";
  if (probability <= 0.35 || placement === "no_fit") return "rejected";
  return "uncertain";
}

async function evaluateTask(task: RefinementTask): Promise<RefinedCandidate[]> {
  const entries = task.candidates.map((candidate, index) => ({
    id: `candidate_${index}`,
    candidate,
  }));
  const questions: Record<string, any> = {};

  for (const entry of entries) {
    questions[`should_link_${entry.id}`] = {
      type: "boolean",
      instructions: `Is ${entry.id} a genuinely useful link from the source page to the target page? Consider topic, audience, search intent, user journey, and whether the link adds information. Use false when the relationship is only superficial or the link would feel promotional or forced.`,
      criteria: {
        true: "A careful editor should place this link in the main content.",
        false: "The link should not be placed in the main content.",
      },
    };
    questions[`placement_${entry.id}`] = {
      type: "choice",
      instructions: `If a link from the source to ${entry.id} is useful, choose the most natural placement type in the main content. Choose no_fit when there is no natural editorial location, even if the topics are related.`,
      criteria: placementOptions,
    };
  }

  let lastError: unknown = new Error("Onbekende fout tijdens de Jev-vervolgpass.");
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const result = await evaluate({
        model: "typesafe-ai/jev",
        state: {
          task: "Selecteer redactioneel verantwoorde interne en cross-site links voor vier samenhangende Nederlandse websites.",
          rules: [
            "Beoordeel uitsluitend links in de hoofdcontent; navigatie, footer en contactpagina's vallen buiten scope.",
            "Een cross-site link is toegestaan wanneer de doelpagina aantoonbaar aanvullende informatie biedt voor dezelfde gebruiker.",
            "Gebruik geen link alleen omdat twee pagina's dezelfde zoekwoorden bevatten.",
            "Een link mag niet geforceerd of uitsluitend commercieel aanvoelen.",
          ],
          source: compactPage(task.source),
          candidates: entries.map((entry) => ({
            id: entry.id,
            originalScore: entry.candidate.score100,
            target: {
              site: entry.candidate.targetSite,
              url: entry.candidate.targetUrl,
              title: entry.candidate.targetTitle,
              isBlog: entry.candidate.targetIsBlog,
            },
          })),
        },
        questions,
      });

      const answers = result.answers as Record<string, unknown>;
      return entries.map((entry) => {
        const shouldLink = answerRecord(answers[`should_link_${entry.id}`]);
        const placementAnswer = answerRecord(answers[`placement_${entry.id}`]);
        const probability = numberOrNull(shouldLink.probability);
        const placement = typeof placementAnswer.choice === "string" ? placementAnswer.choice : null;
        const placementProbabilities = answerRecord(placementAnswer.probabilities);
        const placementProbability = placement && typeof placementProbabilities[placement] === "number"
          ? placementProbabilities[placement] as number
          : null;
        return {
          ...entry.candidate,
          refinement: refinementFrom(probability, placement),
          shouldLinkProbability: probability,
          placement,
          placementProbability,
        };
      });
    } catch (error) {
      lastError = error;
      if (attempt === 3) break;
      await new Promise((resolve) => setTimeout(resolve, [5_000, 15_000, 30_000][attempt - 1] ?? 30_000));
    }
  }

  console.log(`  vervolgbatch mislukt (${errorStatus(lastError instanceof Error ? lastError.message : String(lastError))}); blijft beschikbaar voor volgende run`);
  throw lastError;
}

if (!process.env.AI_GATEWAY_API_KEY) {
  throw new Error("AI_GATEWAY_API_KEY ontbreekt in .env.local of de workspace-root.");
}

const pageCards = JSON.parse(await fs.readFile(path.join(resultsDir, "page-cards.json"), "utf8")) as PageCard[];
const pagesByUrl = new Map(pageCards.map((page) => [page.url, page]));
const linkScores = (JSON.parse(await fs.readFile(path.join(resultsDir, "link-scores.json"), "utf8")) as { scores: LinkScore[] }).scores;
const selected = linkScores.filter((candidate) =>
  candidate.sourceSite === candidate.targetSite
    ? candidate.score100 >= 80
    : candidate.score100 >= 70,
);

const grouped = new Map<string, RefinementTask>();
for (const candidate of selected) {
  const source = pagesByUrl.get(candidate.sourceUrl);
  if (!source) continue;
  const existing = grouped.get(source.url);
  if (existing) existing.candidates.push(candidate);
  else grouped.set(source.url, { source, candidates: [candidate] });
}

const tasks: RefinementTask[] = [];
for (const task of [...grouped.values()].sort((a, b) => a.source.url.localeCompare(b.source.url))) {
  task.candidates.sort((a, b) => b.score100 - a.score100 || a.targetUrl.localeCompare(b.targetUrl));
  for (const candidates of batches(task.candidates, batchSize)) tasks.push({ source: task.source, candidates });
}

const partialPath = path.join(resultsDir, "link-candidates.partial.json");
let partial: PartialResult = { completed: [], candidates: [] };
try {
  partial = JSON.parse(await fs.readFile(partialPath, "utf8")) as PartialResult;
} catch {
  // Start a new refinement run when no checkpoint exists yet.
}

const completed = new Set(partial.completed);
const candidates = [...partial.candidates];
const remaining = tasks.filter((task) => !completed.has(taskKey(task)));
console.log(`${selected.length} geselecteerde kandidaten in ${tasks.length} vervolgbatches; ${remaining.length} resterend; maximaal 1 Jev-request tegelijk`);

for (const task of remaining) {
  console.log(`  ${task.source.siteName}: ${task.source.title} (${task.candidates.length} kandidaten)`);
  try {
    const refined = await evaluateTask(task);
    candidates.push(...refined);
    completed.add(taskKey(task));
    await fs.writeFile(partialPath, JSON.stringify({ completed: [...completed], candidates }, null, 2) + "\n");
  } catch {
    console.log("  batch overgeslagen; voer npm run refine opnieuw uit om te hervatten");
  }
}

const unresolved = tasks.filter((task) => !completed.has(taskKey(task)));
if (unresolved.length > 0) {
  throw new Error(`${unresolved.length} vervolgbatches zijn nog niet verwerkt.`);
}

const output = {
  generatedAt: new Date().toISOString(),
  thresholds: { crossSiteScore100: 70, internalScore100: 80 },
  sourcePages: new Set(candidates.map((candidate) => candidate.sourceUrl)).size,
  candidateCount: candidates.length,
  selectedCount: candidates.filter((candidate) => candidate.refinement === "selected").length,
  uncertainCount: candidates.filter((candidate) => candidate.refinement === "uncertain").length,
  rejectedCount: candidates.filter((candidate) => candidate.refinement === "rejected").length,
  candidates: candidates.sort((a, b) => (b.shouldLinkProbability ?? 0) - (a.shouldLinkProbability ?? 0)),
};
await fs.writeFile(path.join(resultsDir, "link-candidates.json"), JSON.stringify(output, null, 2) + "\n");
console.log(`\nKlaar: ${output.candidateCount} kandidaten verfijnd.`);
console.log(`  geselecteerd=${output.selectedCount}, onzeker=${output.uncertainCount}, afgewezen=${output.rejectedCount}`);
console.log("Bestand: results/link-candidates.json");
