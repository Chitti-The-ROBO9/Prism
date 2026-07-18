"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight, ArrowUpRight, BadgeCheck, BrainCircuit, Check, ChevronRight,
  CircleHelp, Compass, FlaskConical, Layers3, Lightbulb, LoaderCircle,
  Plus, RefreshCw, ScanSearch, ShieldAlert, Sparkles, Target, TriangleAlert,
  WandSparkles
} from "lucide-react";

const prompts = [
  "Should I prepare for GATE or focus on placements?",
  "Should I launch this startup idea now?",
  "Should I move abroad for my next role?"
];

const demoAnalysis = {
  title: "GATE preparation vs. placement focus",
  summary: "This decision balances long-term academic optionality against near-term career momentum and financial independence.",
  blueprint: {
    goals: ["Build a fulfilling technical career", "Keep strong options open after graduation"],
    values: ["Deep learning", "Financial independence", "Career flexibility"],
    constraints: ["College workload", "Limited focused study hours", "Placement calendar"],
    unknowns: ["Actual GATE rank", "Recruitment market next year"],
    risks: ["Burnout from trying both paths", "Missing placement preparation windows"],
    assumptions: ["I can sustain 3 focused hours daily", "A postgraduate degree matches my long-term work"],
    stakeholders: ["You", "Family", "Potential employers"],
    resources: ["Campus mentoring", "Preparation materials", "Existing technical base"],
    successCriteria: ["Meaningful work", "Financial stability", "Growth after two years"],
    opportunities: ["Use placements as a market signal", "Build a portfolio that serves either path"]
  },
  lenses: [
    { name: "Career Perspective", why: "Your choice changes both your entry route and future optionality.", observation: "Placements create early industry feedback; GATE can create a deeper academic and technical runway.", tradeoff: "Immediate momentum versus a concentrated preparation period.", question: "Which route better fits the kind of work you want to do day-to-day?", blindSpot: "Treating salary as a proxy for learning quality." },
    { name: "Financial Perspective", why: "The paths differ in timing of income and cost of preparation.", observation: "The opportunity cost is not only tuition or salary; it includes the value of experience gained now.", tradeoff: "Earlier earning versus possible longer-term specialization.", question: "What amount of financial runway makes either path genuinely comfortable?", blindSpot: "Assuming every placement or M.Tech outcome has the same return." },
    { name: "Energy & Well-being", why: "This decision relies on sustained effort under a fixed academic schedule.", observation: "A plan that fits your energy is more robust than one that looks ideal on paper.", tradeoff: "Ambition versus a schedule you can maintain.", question: "What would a realistic low-energy week look like?", blindSpot: "Planning around your best week rather than your normal one." },
    { name: "Long-term Perspective", why: "The answer may change as your interests and the market evolve.", observation: "A reversible first step can preserve options while you gather better evidence.", tradeoff: "Commitment now versus learning before committing.", question: "What small experiment could reduce uncertainty in the next 30 days?", blindSpot: "Assuming today’s preference is permanent." }
  ],
  scenarios: [
    { name: "The focused runway", condition: "Your study routine holds and the academic path remains energising.", outlook: "You gain a clearer specialization signal and keep postgraduate options strong.", watch: "Protect a sustainable schedule rather than maximising daily hours." },
    { name: "The constrained schedule", condition: "Your available study time drops because of coursework or placement activity.", outlook: "The combined plan becomes fragile; prioritisation becomes more valuable than intensity.", watch: "Track actual study hours for two weeks before committing to targets." },
    { name: "The market shift", condition: "A compelling placement or internship opportunity appears earlier than expected.", outlook: "New evidence may change the value of delaying industry experience.", watch: "Define in advance what opportunity would justify revisiting the decision." }
  ],
  evidenceMap: [
    { label: "Long-term career direction", status: "highly_personal", detail: "Only you can weigh research depth against early industry experience." },
    { label: "Time available each week", status: "needs_verification", detail: "Estimate from an actual two-week calendar rather than intention." },
    { label: "Placement market", status: "uncertain", detail: "Depends on the companies, timing, and your evolving profile." },
    { label: "Preparation resources", status: "well_supported", detail: "Mentors, structured material, and a technical foundation are available." }
  ],
  research: ["Speak with two recent GATE qualifiers about weekly workload and trade-offs.", "Compare placement outcomes for roles you would genuinely accept.", "Run a two-week study-and-placement preparation experiment and review your energy."],
  reflection: ["Which outcome would still feel worthwhile if the headline outcome were delayed?", "What evidence would make you change your mind—not just feel more confident?", "Which option leaves you with the most reversible next step?"]
};

const labels = {
  goals: "Goals", values: "Values", constraints: "Constraints", unknowns: "Unknowns", risks: "Risks",
  assumptions: "Assumptions", stakeholders: "Stakeholders", resources: "Resources", successCriteria: "Success criteria", opportunities: "Opportunities"
};

const questionSet = [
  ["What outcome matters most?", "A clear goal helps Prism choose the right reasoning lenses.", "Build long-term career options"],
  ["What is your biggest concern?", "Name the tension you do not want a generic answer to ignore.", "Avoid closing doors too early"],
  ["What is your time horizon?", "When will this decision start to matter in practice?", "6–12 months"],
  ["How much uncertainty feels acceptable?", "There is no right level—this calibrates the exploration.", "Balanced"],
  ["What values should carry the most weight?", "For example: learning, security, family, impact, autonomy.", "Learning and financial independence"],
  ["What constraints should Prism respect?", "Time, budget, commitments, location, health, or obligations.", "College workload and limited daily study time"]
];

function PrismMark() {
  return <div className="prism-mark" aria-hidden="true"><i /><i /><i /></div>;
}

function SectionHeading({ eyebrow, title, copy, action }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{copy && <p>{copy}</p>}</div>{action}</div>;
}

export default function Prism() {
  const [stage, setStage] = useState("start");
  const [decision, setDecision] = useState("");
  const [answers, setAnswers] = useState(questionSet.map((q) => q[2]));
  const [analysis, setAnalysis] = useState(demoAnalysis);
  const [activeBlueprint, setActiveBlueprint] = useState("assumptions");
  const [activeLens, setActiveLens] = useState(0);
  const [activeScenario, setActiveScenario] = useState(0);
  const [activeAssumption, setActiveAssumption] = useState(0);
  const [stress, setStress] = useState(false);
  const [sandbox, setSandbox] = useState({ time: 62, budget: 54, risk: 48, learning: 71 });
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const selectedAssumption = analysis.blueprint.assumptions[activeAssumption] || "This assumption";
  const context = useMemo(() => ({
    goal: answers[0], concern: answers[1], horizon: answers[2], riskTolerance: answers[3], values: answers[4], constraints: answers[5]
  }), [answers]);

  // Keep the active workspace available after an accidental refresh without requiring accounts for the MVP.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("prism-active-workspace");
      if (!saved) return;
      const workspace = JSON.parse(saved);
      if (workspace.decision && workspace.analysis) {
        setDecision(workspace.decision);
        setAnswers(workspace.answers || answers);
        setAnalysis(workspace.analysis);
        setStage("workspace");
      }
    } catch { /* A missing or malformed local session should never block Prism. */ }
  // Load a saved workspace only once when the client starts.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage !== "workspace") return;
    try { window.localStorage.setItem("prism-active-workspace", JSON.stringify({ decision, answers, analysis })); } catch { /* Storage is optional. */ }
  }, [stage, decision, answers, analysis]);

  const begin = () => {
    if (decision.trim().length < 8) return setNotice("Write a specific decision so Prism has something meaningful to explore.");
    setNotice(""); setStage("questions");
  };

  const analyze = async () => {
    setIsLoading(true); setStage("building");
    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decision, context }) });
      const payload = await res.json();
      if (payload.analysis) setAnalysis(payload.analysis);
      if (payload.error) setNotice(payload.error);
    } catch { setNotice("Using Prism’s demo reasoning model while the connection is unavailable."); }
    setTimeout(() => { setIsLoading(false); setStage("workspace"); }, 1800);
  };

  const reset = () => { window.localStorage.removeItem("prism-active-workspace"); setStage("start"); setDecision(""); setStress(false); setNotice(""); };

  return <main>
    <nav className="topbar"><button className="brand" onClick={reset}><PrismMark /><span>Prism</span></button><div className="nav-note"><span className="status-dot" /> Decision workspace</div></nav>

    <AnimatePresence mode="wait">
      {stage === "start" && <motion.section className="hero" key="start" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
        <div className="hero-glow" /><p className="eyebrow center">A new way to reason</p><h1>Understand your decision<br /><span>before you make it.</span></h1><p className="hero-copy">Prism turns a difficult choice into a living decision model—so you can explore the perspectives, trade-offs, and unknowns that actually matter.</p>
        <div className="decision-box"><textarea value={decision} onChange={e => setDecision(e.target.value)} onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") begin(); }} placeholder="What decision are you trying to make?" aria-label="Decision to explore" /><div className="decision-box-footer"><span>⌘ Enter to continue</span><button className="primary-button" onClick={begin}>Explore decision <ArrowRight size={17} /></button></div></div>
        {notice && <p className="notice"><CircleHelp size={15} />{notice}</p>}
        <div className="prompt-row">{prompts.map(p => <button key={p} onClick={() => setDecision(p)}>{p}<ArrowUpRight size={14} /></button>)}</div>
        <div className="principles"><span><Layers3 />Structure, not verdicts</span><span><Compass />Multiple lenses</span><span><Lightbulb />Actionable next steps</span></div>
      </motion.section>}

      {stage === "questions" && <motion.section className="questions-shell" key="questions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <button className="back-button" onClick={() => setStage("start")}>← Back</button><div className="question-intro"><p className="eyebrow">Decision context</p><h1>Give the decision<br />a little <span>shape.</span></h1><p>Prism will treat these as editable inputs—not facts. They help it select useful reasoning lenses.</p></div>
        <div className="decision-quote">“{decision}”</div>
        <div className="questions-grid">{questionSet.map(([title, helper], i) => <label key={title} className="question-card"><span>{String(i + 1).padStart(2, "0")}</span><strong>{title}</strong><small>{helper}</small><input value={answers[i]} onChange={e => setAnswers(a => a.map((v, index) => index === i ? e.target.value : v))} /></label>)}</div>
        <button className="primary-button analyze-button" onClick={analyze}>Build my decision model <Sparkles size={17} /></button>
      </motion.section>}

      {stage === "building" && <motion.section className="building" key="building" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><PrismMark /><p className="eyebrow">Prism is building your model</p><h1>Understanding the <span>decision anatomy.</span></h1><div className="build-steps">{["Finding constraints and unknowns", "Selecting reasoning lenses", "Mapping plausible scenarios", "Preparing reflection prompts"].map((s, i) => <motion.div key={s} initial={{ opacity: .25, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .32 }}><span><Check size={14} /></span>{s}</motion.div>)}</div><p className="fine-print">Prism explores possibilities. It does not predict or decide for you.</p></motion.section>}

      {stage === "workspace" && <motion.section className="workspace" key="workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <header className="workspace-head"><div><p className="eyebrow">Decision workspace <span className="demo-pill">{isLoading ? "Analyzing" : "Interactive model"}</span></p><h1>{analysis.title}</h1><p>{analysis.summary}</p></div><button className="secondary-button" onClick={reset}><Plus size={16} /> New decision</button></header>
        <div className="workspace-nav"><a href="#blueprint"><Layers3 size={16} /> Blueprint</a><a href="#lenses"><ScanSearch size={16} /> Lenses</a><a href="#scenarios"><Compass size={16} /> Scenarios</a><a href="#reflection"><Lightbulb size={16} /> Reflection</a></div>

        <section id="blueprint" className="panel blueprint-panel"><SectionHeading eyebrow="01 — Decision blueprint" title="The anatomy of this decision." copy="Select any dimension to inspect it. These are working hypotheses you can challenge or edit." action={<button className="text-button"><RefreshCw size={15} /> Refine model</button>} /><div className="blueprint-layout"><div className="blueprint-core"><div className="core-orbit"><PrismMark /></div><strong>Your decision</strong><small>10 connected dimensions</small></div><div className="blueprint-grid">{Object.entries(analysis.blueprint).map(([key, values], i) => <button key={key} className={`blue-node ${activeBlueprint === key ? "selected" : ""}`} style={{ "--delay": `${i * .03}s` }} onClick={() => setActiveBlueprint(key)}><span className={`node-icon ${key}`}><Layers3 size={15} /></span><span>{labels[key]}</span><b>{values.length}</b></button>)}</div><motion.div className="blueprint-detail" key={activeBlueprint} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}><div><p className="eyebrow">{labels[activeBlueprint]}</p><h3>{activeBlueprint === "assumptions" ? "What this decision appears to rely on" : "Current working model"}</h3></div>{analysis.blueprint[activeBlueprint].map((item, i) => <div className="detail-item" key={item}><span>{String(i + 1).padStart(2, "0")}</span>{item}<button aria-label="Edit item">×</button></div>)}<button className="add-item"><Plus size={15} /> Add your own</button></motion.div></div></section>

        <section id="lenses" className="panel"><SectionHeading eyebrow="02 — Reasoning lenses" title="Perspectives selected for this decision." copy="Prism chose these lenses because each adds a distinct way of examining your decision." /><div className="lens-layout"><div className="lens-list">{analysis.lenses.map((lens, i) => <button className={activeLens === i ? "active" : ""} onClick={() => setActiveLens(i)} key={lens.name}><span>{String(i + 1).padStart(2, "0")}</span><strong>{lens.name}</strong><ChevronRight size={16} /></button>)}</div><motion.article className="lens-detail" key={activeLens} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}><div className="lens-title"><div className="lens-icon"><BrainCircuit size={22} /></div><div><p className="eyebrow">Selected because</p><h3>{analysis.lenses[activeLens].name}</h3></div></div><p className="why">{analysis.lenses[activeLens].why}</p><div className="lens-insights"><Insight label="Observation" text={analysis.lenses[activeLens].observation} icon={<ScanSearch />} /><Insight label="Trade-off" text={analysis.lenses[activeLens].tradeoff} icon={<ArrowRight />} /><Insight label="Question to sit with" text={analysis.lenses[activeLens].question} icon={<CircleHelp />} /><Insight label="Possible blind spot" text={analysis.lenses[activeLens].blindSpot} icon={<TriangleAlert />} /></div></motion.article></div></section>

        <section id="scenarios" className="panel"><SectionHeading eyebrow="03 — Scenario explorer" title="Explore what changes when conditions do." copy="These are plausible branches—not predictions. Start with the condition, then inspect what it would change." /><div className="scenario-tabs">{analysis.scenarios.map((s, i) => <button key={s.name} className={activeScenario === i ? "active" : ""} onClick={() => setActiveScenario(i)}><span>{String.fromCharCode(65 + i)}</span>{s.name}</button>)}</div><motion.div className="scenario-card" key={activeScenario} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><div className="scenario-line"><i /><i /><i /></div><div><p className="eyebrow">Condition</p><h3>{analysis.scenarios[activeScenario].condition}</h3></div><div className="scenario-copy"><div><p className="eyebrow">What this might change</p><p>{analysis.scenarios[activeScenario].outlook}</p></div><div><p className="eyebrow">Worth watching</p><p>{analysis.scenarios[activeScenario].watch}</p></div></div></motion.div></section>

        <section className="tools-grid"><article className="panel stress-panel"><p className="eyebrow">04 — Decision stress test</p><h2>Break one assumption<br />before reality does.</h2><p>Explore how robust your plan is when a key condition changes.</p><div className="assumption-picker">{analysis.blueprint.assumptions.map((a, i) => <button className={activeAssumption === i ? "active" : ""} onClick={() => { setActiveAssumption(i); setStress(false); }} key={a}>{a}</button>)}</div><button className="dark-button" onClick={() => setStress(true)}><FlaskConical size={17} /> Stress test this assumption</button><AnimatePresence>{stress && <motion.div className="stress-result" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}><ShieldAlert size={19} /><div><strong>Model under pressure</strong><p>If “{selectedAssumption}” weakens, Scenario B becomes more relevant. Create a two-week test before treating this path as robust.</p></div></motion.div>}</AnimatePresence></article>
          <article className="panel sandbox-panel"><p className="eyebrow">05 — Decision sandbox</p><h2>Adjust the conditions.<br />See what deserves attention.</h2><p>These controls do not change the answer. They reveal where your plan is sensitive.</p><div className="sliders">{[["time", "Time available", "Low", "High"], ["budget", "Financial runway", "Tight", "Flexible"], ["risk", "Risk tolerance", "Careful", "Adventurous"], ["learning", "Learning priority", "Income", "Growth"]].map(([key, label, min, max]) => <label key={key}><span><strong>{label}</strong><b>{sandbox[key]}%</b></span><input type="range" min="0" max="100" value={sandbox[key]} onChange={e => setSandbox(s => ({ ...s, [key]: +e.target.value }))} style={{ "--value": `${sandbox[key]}%` }} /><small>{min}<i />{max}</small></label>)}</div><div className="sensitivity"><WandSparkles size={18} /><span><strong>Most sensitive right now:</strong> {sandbox.time < 45 ? "available time" : sandbox.budget < 40 ? "financial runway" : sandbox.risk < 35 ? "risk tolerance" : "the balance between learning and income"}.</span></div></article></section>

        <section id="reflection" className="reflection"><div className="reflection-intro"><p className="eyebrow">06 — Reflection, not recommendation</p><h2>Leave with better<br /><span>questions.</span></h2><p>Prism has not chosen for you. It has made the decision more visible so you can move forward deliberately.</p></div><div className="reflection-content"><article className="map-card"><div className="map-head"><div><p className="eyebrow">Decision confidence map</p><h3>What needs your attention?</h3></div><BadgeCheck size={20} /></div>{analysis.evidenceMap.map(item => <div className="evidence-row" key={item.label}><span className={`evidence-dot ${item.status}`} /><div><strong>{item.label}</strong><p>{item.detail}</p></div><em>{item.status.replaceAll("_", " ")}</em></div>)}</article><article className="next-card"><p className="eyebrow">Research mode</p><h3>Reduce uncertainty with evidence.</h3>{analysis.research.map((r, i) => <div key={r}><span>{String(i + 1).padStart(2, "0")}</span><p>{r}</p><ArrowUpRight size={16} /></div>)}</article></div><div className="reflection-prompts">{analysis.reflection.map((r, i) => <article key={r}><span>{String(i + 1).padStart(2, "0")}</span><p>{r}</p></article>)}</div></section>
        <footer className="workspace-footer"><PrismMark /><div><strong>Prism does not replace your judgment.</strong><span>It helps you see what your decision depends on.</span></div><button className="secondary-button" onClick={reset}>Explore another decision <ArrowRight size={16} /></button></footer>
      </motion.section>}
    </AnimatePresence>
  </main>;
}

function Insight({ label, text, icon }) { return <div className="insight"><span>{icon}</span><div><p>{label}</p><strong>{text}</strong></div></div>; }
