import OpenAI from "openai";
import { z } from "zod";

const requestSchema = z.object({
  decision: z.string().min(8).max(1200),
  context: z.object({
    goal: z.string().max(500).optional(),
    concern: z.string().max(500).optional(),
    horizon: z.string().max(200).optional(),
    riskTolerance: z.string().max(200).optional(),
    values: z.string().max(500).optional(),
    constraints: z.string().max(500).optional()
  }).optional()
});

const shape = `Return ONLY valid JSON. Do not recommend a choice. Be transparent and treat all output as hypotheses for the user to edit.
{
  "title":"short decision title",
  "summary":"one sentence",
  "blueprint":{"goals":["..."],"values":["..."],"constraints":["..."],"unknowns":["..."],"risks":["..."],"assumptions":["..."],"stakeholders":["..."],"resources":["..."],"successCriteria":["..."],"opportunities":["..."]},
  "lenses":[{"name":"... Perspective","why":"why it is relevant","observation":"...","tradeoff":"...","question":"...","blindSpot":"..."}],
  "scenarios":[{"name":"...","condition":"...","outlook":"...","watch":"..."}],
  "evidenceMap":[{"label":"...","status":"well_supported|needs_verification|highly_personal|uncertain","detail":"..."}],
  "research":["..."],
  "reflection":["..."]
}`;

export async function POST(request) {
  try {
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: "Please provide a clear decision to explore." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ demo: true, message: "No API key configured. Showing the interactive demo analysis." });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.PRISM_OPENAI_MODEL || "gpt-5.6",
      input: [
        { role: "system", content: "You are Prism's careful reasoning engine. " + shape },
        { role: "user", content: `Decision: ${parsed.data.decision}\nContext: ${JSON.stringify(parsed.data.context || {})}` }
      ]
    });
    const text = response.output_text.replace(/^```json\s*|\s*```$/g, "");
    return Response.json({ analysis: JSON.parse(text) });
  } catch (error) {
    console.error("Prism analysis failed", error);
    return Response.json({ error: "Prism could not complete that analysis just now. Please try again." }, { status: 500 });
  }
}
