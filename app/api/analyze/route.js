import OpenAI from "openai";
import { z } from "zod";
import { analysisJsonInstruction, analysisSchema } from "../../../lib/analysis-schema.js";
import { createDemoAnalysis } from "../../../lib/demo-analysis.js";

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

function sanitizeErrorMessage(msg) {
  if (!msg) return "";
  return String(msg)
    .replace(/gsk_[a-zA-Z0-9_-]+/g, "[REDACTED_GROQ_KEY]")
    .replace(/sk-[a-zA-Z0-9_-]+/g, "[REDACTED_OPENAI_KEY]")
    .replace(/Bearer\s+[a-zA-Z0-9_\-\.]+/gi, "Bearer [REDACTED]");
}

function errorResponse(status, { message, code, provider, model, details, retryAfter } = {}) {
  const headers = { "Cache-Control": "no-store" };
  if (retryAfter) headers["Retry-After"] = String(retryAfter);
  return Response.json({
    error: true,
    message: message || "Prism could not complete that analysis just now.",
    code: code || "analysis_failed",
    ...(provider ? { provider } : {}),
    ...(model ? { model } : {}),
    ...(details ? { details } : {})
  }, { status, headers });
}

function mapProviderError(error, provider, model) {
  const status = error?.status || error?.statusCode || 502;
  const rawMessage = error?.error?.message || error?.message || "";
  const safeMessage = sanitizeErrorMessage(rawMessage);
  const lowerMsg = safeMessage.toLowerCase();

  let message = `Prism could not complete that analysis using ${provider}.`;
  let code = "analysis_failed";
  let retryAfter = undefined;
  let httpStatus = status >= 400 && status < 600 ? status : 502;

  if (status === 429 || lowerMsg.includes("quota") || lowerMsg.includes("rate limit")) {
    httpStatus = 429;
    code = "quota_exhausted";
    message = `Prism has reached the current ${provider} request or credit limit. Please wait a moment or check the ${provider} account.`;
    retryAfter = 30;
  } else if (status === 401 || status === 403 || lowerMsg.includes("invalid api key") || lowerMsg.includes("unauthorized")) {
    httpStatus = 503;
    code = "provider_configuration";
    message = `Prism's ${provider} authentication failed. Please check your ${provider.toUpperCase()}_API_KEY.`;
  } else if (status === 408 || error?.name === "AbortError") {
    httpStatus = 504;
    code = "upstream_timeout";
    message = `Prism's ${provider} analysis service took too long to respond. Please try again.`;
  } else if (status === 404 || lowerMsg.includes("model_not_found")) {
    httpStatus = 502;
    code = "model_not_found";
    message = `The requested model "${model}" was not found or is not supported by ${provider}.`;
  } else if (status === 400) {
    httpStatus = 400;
    code = "invalid_provider_request";
    message = `${provider.toUpperCase()} rejected the request format or parameters.`;
  }

  return errorResponse(httpStatus, {
    message,
    code,
    provider,
    model,
    details: safeMessage || undefined,
    retryAfter
  });
}

function extractJson(outputText) {
  if (!outputText || typeof outputText !== "string") {
    throw new Error("Empty model response");
  }
  let text = outputText.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  } else {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      text = text.slice(firstBrace, lastBrace + 1);
    }
  }
  return JSON.parse(text);
}

export async function POST(request) {
  const requestId = `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

  let payload;
  try {
    payload = await request.json();
  } catch {
    return errorResponse(400, {
      message: "Prism received an invalid request. Please try again.",
      code: "invalid_request"
    });
  }

  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    return errorResponse(400, {
      message: "Please provide a clear decision to explore.",
      code: "invalid_decision"
    });
  }

  const rawProvider = process.env.PRISM_AI_PROVIDER?.trim().toLowerCase();
  let provider;

  if (rawProvider) {
    if (rawProvider === "openai" || rawProvider === "groq" || rawProvider === "demo") {
      provider = rawProvider;
    } else {
      return errorResponse(400, {
        message: `Prism does not support the configured AI provider "${rawProvider}". Supported providers: openai, groq, demo.`,
        code: "unsupported_provider",
        provider: rawProvider
      });
    }
  } else {
    if (process.env.OPENAI_API_KEY) {
      provider = "openai";
    } else if (process.env.GROQ_API_KEY) {
      provider = "groq";
    } else {
      provider = "demo";
    }
  }

  if (provider === "demo") {
    console.info(`[${requestId}] Prism analysis request using Demo Mode`, { provider: "demo" });
    const demoData = createDemoAnalysis(parsed.data.decision, parsed.data.context);
    return Response.json({
      analysis: demoData,
      demo: true,
      provider: "demo"
    }, { headers: { "Cache-Control": "no-store" } });
  }

  let apiKey;
  let model;

  if (provider === "openai") {
    apiKey = process.env.OPENAI_API_KEY?.trim();
    model = process.env.PRISM_OPENAI_MODEL?.trim() || "gpt-5.6";
    if (!apiKey) {
      console.warn(`[${requestId}] Prism OpenAI request failed: missing API key`);
      return errorResponse(503, {
        message: "OpenAI API key is missing. Please set OPENAI_API_KEY in your environment or set PRISM_AI_PROVIDER=demo.",
        code: "missing_api_key",
        provider: "openai",
        model
      });
    }
  } else if (provider === "groq") {
    apiKey = process.env.GROQ_API_KEY?.trim();
    model = process.env.PRISM_GROQ_MODEL?.trim() || "openai/gpt-oss-120b";
    if (!apiKey) {
      console.warn(`[${requestId}] Prism Groq request failed: missing API key`);
      return errorResponse(503, {
        message: "Groq API key is missing. Please set GROQ_API_KEY in your environment or set PRISM_AI_PROVIDER=demo.",
        code: "missing_api_key",
        provider: "groq",
        model
      });
    }
  }

  try {
    console.info(`[${requestId}] Prism analysis request started`, { provider, model });
    let outputText;

    if (provider === "openai") {
      const client = new OpenAI({
        apiKey,
        timeout: 45_000,
        maxRetries: 1
      });
      const response = await client.responses.create({
        model,
        store: false,
        temperature: 0.2,
        input: [
          { role: "system", content: `You are Prism's careful reasoning engine. ${analysisJsonInstruction}` },
          { role: "user", content: `Decision data:\n${JSON.stringify({ decision: parsed.data.decision, context: parsed.data.context })}` }
        ]
      });
      outputText = response.output_text;
    } else if (provider === "groq") {
      const client = new OpenAI({
        apiKey,
        baseURL: "https://api.groq.com/openai/v1",
        timeout: 45_000,
        maxRetries: 1
      });
      const makeGroqCall = (systemExtra = "") => client.chat.completions.create({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `You are Prism's careful reasoning engine.${systemExtra} ${analysisJsonInstruction}` },
          { role: "user", content: `Decision data:\n${JSON.stringify({ decision: parsed.data.decision, context: parsed.data.context })}` }
        ]
      });

      let completion;
      try {
        completion = await makeGroqCall();
      } catch (groqErr) {
        if (groqErr?.status === 400 && String(groqErr?.message || "").includes("Failed to generate JSON")) {
          console.warn(`[${requestId}] Groq returned 400 failed_generation; retrying with explicit formatting instruction...`);
          completion = await makeGroqCall(" You must output ONLY a valid JSON object starting with { and ending with }. Do not output commentary or fences.");
        } else {
          throw groqErr;
        }
      }
      outputText = completion.choices?.[0]?.message?.content;
    }

    console.info(`[${requestId}] Prism analysis response received from ${provider}`, { provider, model, outputLength: outputText?.length });

    let rawJson;
    try {
      rawJson = extractJson(outputText);
    } catch (parseError) {
      console.error(`[${requestId}] Prism analysis JSON parse failed`, { provider, model, error: parseError.message });
      return errorResponse(502, {
        message: `Prism received invalid JSON from ${provider}. Please try again.`,
        code: "invalid_model_output",
        provider,
        model,
        details: sanitizeErrorMessage(parseError.message)
      });
    }

    const analysis = analysisSchema.safeParse(rawJson);
    if (!analysis.success) {
      const issueSummary = analysis.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ");
      console.warn(`[${requestId}] Prism received an incomplete analysis shape from ${provider}`, { provider, model, issues: issueSummary });
      return errorResponse(502, {
        message: `Prism received an incomplete decision model from ${provider}. Please try again.`,
        code: "invalid_model_output",
        provider,
        model,
        details: issueSummary
      });
    }

    console.info(`[${requestId}] Prism analysis completed successfully`, { provider, model });
    return Response.json({
      analysis: analysis.data,
      provider,
      model
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error(`[${requestId}] Prism analysis request failed`, {
      provider,
      model,
      name: error?.name,
      status: error?.status,
      message: sanitizeErrorMessage(error?.message)
    });
    return mapProviderError(error, provider, model);
  }
}
