import OpenAI from "openai";
import { z } from "zod";
import { analysisJsonInstruction, analysisSchema } from "@/lib/analysis-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 55;

const requestSchema = z.object({
  decision: z.string().trim().min(8).max(1200),
  context: z.object({
    goal: z.string().trim().max(500).optional(),
    concern: z.string().trim().max(500).optional(),
    horizon: z.string().trim().max(200).optional(),
    riskTolerance: z.string().trim().max(200).optional(),
    values: z.string().trim().max(500).optional(),
    constraints: z.string().trim().max(500).optional()
  }).optional().default({})
});

function errorResponse(status, error, code, retryAfter) {
  const headers = { "Cache-Control": "no-store" };
  if (retryAfter) headers["Retry-After"] = String(retryAfter);
  return Response.json({ error, code }, { status, headers });
}

function mapOpenAiError(error) {
  const status = error?.status || error?.statusCode;
  const message = String(error?.message || "").toLowerCase();

  if (status === 429 || message.includes("quota") || message.includes("rate limit")) {
    return errorResponse(429, "Prism has reached the current OpenAI request or credit limit. Please wait a moment, check available credits, or use the interactive demo.", "quota_exhausted", 30);
  }
  if (status === 401 || status === 403) return errorResponse(503, "Prism's analysis service is not configured correctly. Please try again later or use the interactive demo.", "provider_configuration");
  if (status === 408 || error?.name === "AbortError") return errorResponse(504, "Prism's analysis service took too long to respond. Please try again.", "upstream_timeout");
  if (error instanceof SyntaxError) return errorResponse(502, "Prism received an incomplete decision model. Please try again.", "invalid_model_output");
  return errorResponse(502, "Prism could not complete that analysis just now. Your decision has not been lost - please try again.", "analysis_unavailable");
}

function extractJson(outputText) {
  const text = outputText?.trim().replace(/^```json\s*|\s*```$/g, "");
  if (!text) throw new Error("Empty model response");
  return JSON.parse(text);
}

export async function POST(request) {
  let payload;
  try { payload = await request.json(); } catch { return errorResponse(400, "Prism received an invalid request. Please try again.", "invalid_request"); }

  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) return errorResponse(400, "Please provide a clear decision to explore.", "invalid_decision");
  if (!process.env.OPENAI_API_KEY) return Response.json({ demo: true }, { headers: { "Cache-Control": "no-store" } });

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 45_000, maxRetries: 1 });
    const response = await client.responses.create({
      model: process.env.PRISM_OPENAI_MODEL || "gpt-5.6",
      store: false,
      temperature: 0.2,
      input: [
        { role: "system", content: `You are Prism's careful reasoning engine. ${analysisJsonInstruction}` },
        { role: "user", content: `Decision data:\n${JSON.stringify({ decision: parsed.data.decision, context: parsed.data.context })}` }
      ]
    });
    const analysis = analysisSchema.safeParse(extractJson(response.output_text));
    if (!analysis.success) {
      console.warn("Prism received an incomplete analysis shape", analysis.error.issues.map((issue) => issue.path.join(".")).join(", "));
      return errorResponse(502, "Prism received an incomplete decision model. Please try again.", "invalid_model_output");
    }
    return Response.json({ analysis: analysis.data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Prism analysis failed", { name: error?.name, status: error?.status, message: error?.message });
    return mapOpenAiError(error);
  }
}
