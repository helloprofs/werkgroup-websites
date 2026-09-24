import { experimental_evaluate as evaluate } from "ai";
import path from "node:path";
import dotenv from "dotenv";

// Next.js loads .env.local automatically, but this standalone Node script does not.
dotenv.config({ path: ".env.local" });
// Also support the temporary setup where the key was placed in the workspace root.
if (!process.env.AI_GATEWAY_API_KEY) {
  dotenv.config({
    path: path.resolve("..", ".env.local"),
    override: true,
  });
}
dotenv.config();

if (!process.env.AI_GATEWAY_API_KEY) {
  throw new Error(
    "AI_GATEWAY_API_KEY ontbreekt. Maak .env.local aan op basis van .env.example.",
  );
}

const result = await evaluate({
  model: "typesafe-ai/jev",
  state: {
    source: {
      site: "Werkverzuim",
      title: "Arbodienstverlening voor werkgevers",
      content:
        "Deze pagina gaat over arbodienstverlening en begeleiding van werkgevers bij verzuim.",
    },
    target: {
      site: "Werkreturn",
      title: "Tweede spoor begeleiding",
      content:
        "Deze pagina gaat over begeleiding van werknemers naar ander passend werk in het tweede spoor.",
    },
  },
  questions: {
    relevance: {
      type: "score",
      instructions:
        "Hoe relevant is de doelpagina als natuurlijke link vanaf de bronpagina?",
      criteria: [
        "Geen inhoudelijke relatie",
        "Zwakke relatie",
        "Redelijk relevant",
        "Sterk relevant",
        "Direct logische vervolgstap",
      ],
    },
    shouldLink: {
      type: "boolean",
      instructions:
        "Zou een inhoudelijk zorgvuldige redacteur vanaf de bronpagina naar de doelpagina linken?",
    },
  },
});

console.dir(result.answers, { depth: null });
