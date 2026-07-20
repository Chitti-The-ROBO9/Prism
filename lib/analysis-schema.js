import { z } from "zod";

const itemList = z.array(z.string().trim().min(1).max(500)).min(1).max(8);

export const analysisSchema = z.object({
  title: z.string().trim().min(3).max(120),
  summary: z.string().trim().min(10).max(600),
  blueprint: z.object({
    goals: itemList,
    values: itemList,
    constraints: itemList,
    unknowns: itemList,
    risks: itemList,
    assumptions: itemList,
    stakeholders: itemList,
    resources: itemList,
    successCriteria: itemList,
    opportunities: itemList
  }),
  lenses: z.array(z.object({
    name: z.string().trim().min(3).max(80),
    why: z.string().trim().min(10).max(500),
    observation: z.string().trim().min(10).max(700),
    tradeoff: z.string().trim().min(10).max(500),
    question: z.string().trim().min(10).max(500),
    blindSpot: z.string().trim().min(10).max(500)
  })).min(2).max(6),
  scenarios: z.array(z.object({
    name: z.string().trim().min(3).max(80),
    condition: z.string().trim().min(10).max(500),
    outlook: z.string().trim().min(10).max(700),
    watch: z.string().trim().min(10).max(500)
  })).min(2).max(4),
  evidenceMap: z.array(z.object({
    label: z.string().trim().min(3).max(120),
    status: z.enum(["well_supported", "needs_verification", "highly_personal", "uncertain"]),
    detail: z.string().trim().min(10).max(500)
  })).min(3).max(8),
  research: itemList,
  reflection: itemList
});

export const analysisJsonInstruction = `Return ONLY valid JSON with this exact shape. Do not recommend a choice. Treat all output as editable hypotheses, not facts.
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
