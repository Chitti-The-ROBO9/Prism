"use client";

import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, CircleHelp, Compass, Layers3, Lightbulb, Sparkles } from "lucide-react";
import { prompts, questionSet } from "@/lib/decision-data";
import { PrismMark, InlineError } from "@/components/prism-ui";

export function DecisionIntake({ decision, setDecision, onContinue, notice }) {
  return <motion.section className="hero" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
    <div className="hero-glow" />
    <p className="eyebrow center">A new way to reason</p>
    <h1>Understand your decision<br /><span>before you make it.</span></h1>
    <p className="hero-copy">Prism turns a difficult choice into a living decision model—so you can explore the perspectives, trade-offs, and unknowns that actually matter.</p>
    <div className="decision-box">
      <label className="sr-only" htmlFor="decision-input">What decision are you trying to make?</label>
      <textarea id="decision-input" value={decision} onChange={(event) => setDecision(event.target.value)} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") onContinue(); }} placeholder="What decision are you trying to make?" aria-describedby="decision-shortcut" />
      <div className="decision-box-footer"><span id="decision-shortcut">Ctrl or Command + Enter to continue</span><button className="primary-button" onClick={onContinue}>Explore decision <ArrowRight size={17} /></button></div>
    </div>
    <InlineError message={notice} />
    <div className="prompt-row" aria-label="Example decisions">{prompts.map((prompt) => <button key={prompt} onClick={() => setDecision(prompt)}>{prompt}<ArrowUpRight size={14} /></button>)}</div>
    <div className="principles"><span><Layers3 />Structure, not verdicts</span><span><Compass />Multiple lenses</span><span><Lightbulb />Actionable next steps</span></div>
  </motion.section>;
}

export function ContextQuestions({ decision, context, setContext, onBack, onAnalyze, error, onDemo, isSubmitting }) {
  return <motion.section className="questions-shell" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
    <button className="back-button" onClick={onBack}>← Back</button>
    <div className="question-intro"><p className="eyebrow">Decision context</p><h1>Give the decision<br />a little <span>shape.</span></h1><p>Prism will treat these as editable inputs—not facts. They help it select useful reasoning lenses.</p></div>
    <div className="decision-quote">“{decision}”</div>
    <div className="questions-grid">{questionSet.map(({ key, title, helper }, index) => <label key={key} className="question-card"><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><small>{helper}</small><input value={context[key]} onChange={(event) => setContext((current) => ({ ...current, [key]: event.target.value }))} /></label>)}</div>
    <InlineError message={error?.message} onRetry={error?.retryable ? onAnalyze : undefined} />
    <div className="context-actions"><button className="primary-button analyze-button" onClick={onAnalyze} disabled={isSubmitting}>Build my decision model <Sparkles size={17} /></button>{error && <button className="text-button demo-button" onClick={onDemo}>Open the interactive demo instead</button>}</div>
  </motion.section>;
}

export function BuildingModel() {
  const steps = ["Finding constraints and unknowns", "Selecting reasoning lenses", "Mapping plausible scenarios", "Preparing reflection prompts"];
  return <motion.section className="building" initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-live="polite" aria-busy="true">
    <PrismMark /><p className="eyebrow">Prism is building your model</p><h1>Understanding the <span>decision anatomy.</span></h1>
    <div className="build-steps">{steps.map((step, index) => <motion.div key={step} initial={{ opacity: 0.25, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.22 }}><span><Check size={14} /></span>{step}</motion.div>)}</div>
    <p className="fine-print">Prism explores possibilities. It does not predict or decide for you.</p>
  </motion.section>;
}
