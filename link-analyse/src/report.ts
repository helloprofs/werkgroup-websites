import fs from "node:fs/promises";
import path from "node:path";

type PageCard = {
  url: string;
  title: string;
  content: string;
};

type Candidate = {
  sourceSite: string;
  sourceUrl: string;
  sourceTitle: string;
  targetSite: string;
  targetUrl: string;
  targetTitle: string;
  targetIsBlog: boolean;
  score100: number;
  confidence: number | null;
  refinement: "selected" | "rejected" | "uncertain";
  shouldLinkProbability: number | null;
  placement: string | null;
  placementProbability: number | null;
};

const resultsDir = path.resolve("results");
const placementLabels: Record<string, string> = {
  existing_sentence: "In een bestaande hoofdcontentzin",
  after_explanation: "Direct na een inhoudelijke uitleg of contextblok",
  next_step: "Bij een inhoudelijke vervolgstap of CTA in de hoofdcontent",
  list_or_bullets: "In een relevante opsomming, stappenplan of vergelijking",
  no_fit: "Geen passende plek",
};
const stopWords = new Set([
  "de", "het", "een", "van", "voor", "naar", "met", "over", "wat", "hoe", "waarom",
  "door", "bij", "als", "uit", "aan", "zijn", "kan", "voor", "werk", "werkgever", "werkgevers",
]);

function cleanTitle(title: string): string {
  return title.split("|")[0].trim().replace(/\s+/g, " ");
}

function anchorSuggestion(title: string): string {
  const clean = cleanTitle(title);
  const words = clean.split(/\s+/);
  return words.length > 9 ? `${words.slice(0, 9).join(" ")}…` : clean;
}

function tokens(value: string): string[] {
  return [...new Set(
    value.toLowerCase().replace(/[^a-z0-9à-ÿ]+/gi, " ").split(/\s+/)
      .filter((word) => word.length >= 4 && !stopWords.has(word)),
  )];
}

function excerpt(source: PageCard | undefined, targetTitle: string): string {
  if (!source?.content) return "Geen bronfragment beschikbaar; controleer de pagina handmatig.";
  const sourceText = source.content.replace(/\s+/g, " ").trim();
  const targetTokens = tokens(targetTitle);
  let best = sourceText.slice(0, 360);
  let bestScore = -1;
  for (let start = 0; start < sourceText.length; start += 100) {
    const windowStart = start === 0 ? 0 : sourceText.indexOf(" ", start - 20) + 1;
    const roughEnd = Math.min(sourceText.length, windowStart + 420);
    const windowEnd = roughEnd === sourceText.length ? roughEnd : sourceText.lastIndexOf(" ", roughEnd);
    const window = sourceText.slice(windowStart, windowEnd > windowStart ? windowEnd : roughEnd);
    const windowTokens = new Set(tokens(window));
    const overlap = targetTokens.filter((token) => windowTokens.has(token)).length;
    if (overlap > bestScore) {
      bestScore = overlap;
      best = window;
    }
  }
  return best.length > 420 ? `${best.slice(0, 417).trim()}…` : best;
}

function csv(value: unknown): string {
  const text = String(value ?? "").replace(/\r?\n/g, " ");
  return `"${text.replace(/"/g, '""')}"`;
}

const [{ candidates }, pageCards] = await Promise.all([
  fs.readFile(path.join(resultsDir, "link-candidates.json"), "utf8").then((value) => JSON.parse(value) as { candidates: Candidate[] }),
  fs.readFile(path.join(resultsDir, "page-cards.json"), "utf8").then((value) => JSON.parse(value) as PageCard[]),
]);
const pagesByUrl = new Map(pageCards.map((page) => [page.url, page]));
const selected = candidates
  .filter((candidate) => candidate.refinement === "selected")
  .sort((a, b) => {
    const crossDifference = Number(b.sourceSite !== b.targetSite) - Number(a.sourceSite !== a.targetSite);
    return crossDifference || (b.shouldLinkProbability ?? 0) - (a.shouldLinkProbability ?? 0);
  });
const crossSite = selected.filter((candidate) => candidate.sourceSite !== candidate.targetSite);
const internal = selected.filter((candidate) => candidate.sourceSite === candidate.targetSite);

function renderCandidate(candidate: Candidate, index: number): string {
  const source = pagesByUrl.get(candidate.sourceUrl);
  const targetTitle = cleanTitle(candidate.targetTitle);
  const probability = candidate.shouldLinkProbability === null ? "onbekend" : `${Math.round(candidate.shouldLinkProbability * 100)}%`;
  const placement = candidate.placement ? placementLabels[candidate.placement] ?? candidate.placement : "onbekend";
  const placementProbability = candidate.placementProbability === null ? "onbekend" : `${Math.round(candidate.placementProbability * 100)}%`;
  return [
    `### ${index}. ${candidate.sourceTitle} → ${targetTitle}`,
    "",
    `- Bron: [${candidate.sourceUrl}](${candidate.sourceUrl})`,
    `- Doel: [${candidate.targetUrl}](${candidate.targetUrl})`,
    `- Type: ${candidate.sourceSite === candidate.targetSite ? "interne link" : "cross-site link"}`,
    `- Eerste relevantiescore: **${candidate.score100}/100**`,
    `- Jev linkwaarschijnlijkheid: **${probability}**`,
    `- Plaatsingsadvies: **${placement}** (${placementProbability} zekerheid)`,
    `- Voorlopige ankertekst: **${anchorSuggestion(candidate.targetTitle)}**`,
    "",
    `> Broncontext ter controle: ${excerpt(source, candidate.targetTitle)}`,
    "",
    "Redactionele beslissing: [ ] goedkeuren  [ ] ankertekst aanpassen  [ ] afwijzen",
    "",
  ].join("\n");
}

const markdown = [
  "# Werkgroup linkreview",
  "",
  `Gegenereerd: ${new Date().toISOString()}`,
  "",
  `Deze reviewlijst bevat ${selected.length} kandidaten die in de tweede Jev-pass als mogelijke link zijn geselecteerd: ${crossSite.length} cross-site links en ${internal.length} interne links.`,
  "",
  "> De ankerteksten zijn voorlopige voorstellen. Controleer altijd de exacte zin, betekenis en commerciële toon voordat een link wordt geplaatst.",
  "",
  "## Samenvatting",
  "",
  `- Cross-site links: **${crossSite.length}**`,
  `- Interne links: **${internal.length}**`,
  "- Scope: alleen hoofdcontent; navigatie, footer en contactpagina’s zijn buiten scope.",
  "",
  "## Cross-site links — eerst beoordelen",
  "",
  ...crossSite.map((candidate, index) => renderCandidate(candidate, index + 1)),
  "## Interne links",
  "",
  ...internal.map((candidate, index) => renderCandidate(candidate, crossSite.length + index + 1)),
].join("\n");

const headers = [
  "type", "source_site", "source_url", "source_title", "target_site", "target_url", "target_title",
  "initial_score_100", "jev_link_probability", "placement", "placement_probability", "suggested_anchor", "source_excerpt",
];
const csvRows = [headers.map(csv).join(",")];
for (const candidate of selected) {
  csvRows.push([
    candidate.sourceSite === candidate.targetSite ? "internal" : "cross-site",
    candidate.sourceSite,
    candidate.sourceUrl,
    candidate.sourceTitle,
    candidate.targetSite,
    candidate.targetUrl,
    cleanTitle(candidate.targetTitle),
    candidate.score100,
    candidate.shouldLinkProbability === null ? "" : Math.round(candidate.shouldLinkProbability * 100),
    candidate.placement ? placementLabels[candidate.placement] ?? candidate.placement : "",
    candidate.placementProbability === null ? "" : Math.round(candidate.placementProbability * 100),
    anchorSuggestion(candidate.targetTitle),
    excerpt(pagesByUrl.get(candidate.sourceUrl), candidate.targetTitle),
  ].map(csv).join(","));
}

await Promise.all([
  fs.writeFile(path.join(resultsDir, "link-review.md"), `${markdown}\n`),
  fs.writeFile(path.join(resultsDir, "link-review.csv"), `${csvRows.join("\n")}\n`),
]);
console.log(`Reviewlijst gemaakt: ${selected.length} kandidaten (${crossSite.length} cross-site, ${internal.length} intern).`);
console.log("Bestanden: results/link-review.md en results/link-review.csv");
