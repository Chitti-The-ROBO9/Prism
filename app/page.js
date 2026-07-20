"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import { defaultContext, demoAnalysis } from "@/lib/decision-data";
import { useWorkspaceSession } from "@/hooks/use-workspace-session";
import { PrismMark } from "@/components/prism-ui";
import { BuildingModel, ContextQuestions, DecisionIntake } from "@/components/decision-intake";
import { DecisionWorkspace } from "@/components/decision-workspace";

const REQUEST_TIMEOUT_MS = 45_000;
const MIN_LOADING_MS = 850;

function formatApiError(response, payload) {
  const fallback = "Prism could not complete that analysis just now. Please try again.";
  if (response.status === 429 || payload?.code === "quota_exhausted") return { message: "Your OpenAI credits or request quota are currently unavailable. Please check your account, wait a moment, or use the interactive demo.", retryable: true };
  if (response.status === 408 || payload?.code === "upstream_timeout") return { message: "Prism took too long to build this model. Your decision is still here—please try again.", retryable: true };
  if (response.status >= 500) return { message: payload?.error || fallback, retryable: true };
  return { message: payload?.error || fallback, retryable: false };
}

export default function Prism() {
  const [stage, setStage] = useState("intake");
  const [decision, setDecision] = useState("");
  const [context, setContext] = useState(defaultContext);
  const [analysis, setAnalysis] = useState(demoAnalysis);
  const [source, setSource] = useState("demo");
  const [notice, setNotice] = useState("");
  const [requestError, setRequestError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestController = useRef(null);
  const restoredOnce = useRef(false);
  const { hydrated, restoredSession, save, clear } = useWorkspaceSession();

  useEffect(() => {
    if (!hydrated || restoredOnce.current || !restoredSession?.decision || !restoredSession?.analysis) return;
    restoredOnce.current = true;
    setDecision(restoredSession.decision);
    setContext({ ...defaultContext, ...restoredSession.context });
    setAnalysis(restoredSession.analysis);
    setSource(restoredSession.source || "demo");
    setStage("workspace");
  }, [hydrated, restoredSession]);

  useEffect(() => () => requestController.current?.abort(), []);

  const continueToContext = () => {
    if (decision.trim().length < 8) { setNotice("Write a specific decision so Prism has something meaningful to explore."); return; }
    setNotice(""); setRequestError(null); setStage("context");
  };

  const openWorkspace = (nextAnalysis, nextSource) => {
    setAnalysis(nextAnalysis); setSource(nextSource);
    save({ decision, context, analysis: nextAnalysis, source: nextSource });
    setStage("workspace");
  };

  const useDemo = () => openWorkspace(demoAnalysis, "demo");

  const analyze = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true); setRequestError(null); setStage("loading");
    const startedAt = Date.now();
    requestController.current?.abort();
    requestController.current = new AbortController();
    const timeout = window.setTimeout(() => requestController.current?.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decision: decision.trim(), context }), signal: requestController.current.signal });
      const payload = await response.json().catch(() => ({}));
      const remainingDelay = Math.max(0, MIN_LOADING_MS - (Date.now() - startedAt));
      if (remainingDelay) await new Promise((resolve) => window.setTimeout(resolve, remainingDelay));
      if (!response.ok) throw { response, payload };
      openWorkspace(payload.analysis || demoAnalysis, payload.demo ? "demo" : "live");
    } catch (failure) {
      const error = failure?.name === "AbortError"
        ? { message: "Prism took too long to build this model. Your decision is still here—please try again.", retryable: true }
        : failure?.response ? formatApiError(failure.response, failure.payload) : { message: "Your connection was interrupted. Please check it and try again.", retryable: true };
      setRequestError(error); setStage("context");
    } finally {
      window.clearTimeout(timeout); requestController.current = null; setIsSubmitting(false);
    }
  };

  const reset = () => {
    requestController.current?.abort(); clear(); setDecision(""); setContext(defaultContext); setSource("demo"); setNotice(""); setRequestError(null); setStage("intake");
  };

  return <MotionConfig reducedMotion="user"><main>
    <nav className="topbar" aria-label="Prism"><button className="brand" onClick={reset} aria-label="Start a new Prism decision"><PrismMark /><span>Prism</span></button><div className="nav-note"><span className="status-dot" /> Decision workspace</div></nav>
    <AnimatePresence mode="wait">
      {stage === "intake" && <DecisionIntake key="intake" decision={decision} setDecision={setDecision} onContinue={continueToContext} notice={notice} />}
      {stage === "context" && <ContextQuestions key="context" decision={decision} context={context} setContext={setContext} onBack={() => setStage("intake")} onAnalyze={analyze} error={requestError} onDemo={useDemo} isSubmitting={isSubmitting} />}
      {stage === "loading" && <BuildingModel key="loading" />}
      {stage === "workspace" && <DecisionWorkspace key="workspace" analysis={analysis} source={source} onNewDecision={reset} />}
    </AnimatePresence>
  </main></MotionConfig>;
}
