"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, BadgeCheck, BrainCircuit, ChevronRight, CircleHelp, Compass, FlaskConical, Lightbulb, Plus, ScanSearch, ShieldAlert, Sparkles, Target, TriangleAlert, WandSparkles } from "lucide-react";
import { blueprintLabels } from "@/lib/decision-data";
import { BlueprintIcon, Insight, PrismMark, SectionHeading } from "@/components/prism-ui";

const transition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] };

function tabKeyDown(event, activeIndex, count, selectIndex) {
  const direction = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
  if (direction) {
    event.preventDefault();
    selectIndex((activeIndex + direction + count) % count);
  }
  if (event.key === "Home") { event.preventDefault(); selectIndex(0); }
  if (event.key === "End") { event.preventDefault(); selectIndex(count - 1); }
}

export function DecisionWorkspace({ analysis, source, onNewDecision }) {
  const [activeBlueprint, setActiveBlueprint] = useState("assumptions");
  const [activeLens, setActiveLens] = useState(0);
  const [activeScenario, setActiveScenario] = useState(0);
  const [activeAssumption, setActiveAssumption] = useState(0);
  const [stress, setStress] = useState(false);
  const [sandbox, setSandbox] = useState({ time: 62, budget: 54, risk: 48, learning: 71 });
  const selectedAssumption = analysis.blueprint.assumptions[activeAssumption] || "this assumption";
  const sensitivity = sandbox.time < 45 ? "available time" : sandbox.budget < 40 ? "financial runway" : sandbox.risk < 35 ? "risk tolerance" : "the balance between learning and income";

  return <motion.section className="workspace" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}>
    <header className="workspace-head"><div><p className="eyebrow">Decision workspace <span className="demo-pill">{source === "demo" ? "Interactive preview" : "Live analysis"}</span></p><h1>{analysis.title}</h1><p>{analysis.summary}</p></div><button className="secondary-button" type="button" onClick={onNewDecision}><Plus size={16} /> New decision</button></header>
    <nav className="workspace-nav" aria-label="Decision workspace sections"><a href="#blueprint"><Target size={16} /> Blueprint</a><a href="#lenses"><ScanSearch size={16} /> Lenses</a><a href="#scenarios"><Compass size={16} /> Scenarios</a><a href="#reflection"><Lightbulb size={16} /> Reflection</a></nav>
    {source === "demo" && <div className="demo-mode-notice" role="status"><Sparkles size={16} /><span><strong>Interactive demo mode</strong> Sample reasoning is shown here, so Prism remains fully explorable without API credits.</span></div>}
    <BlueprintPanel analysis={analysis} activeBlueprint={activeBlueprint} setActiveBlueprint={setActiveBlueprint} />
    <LensPanel analysis={analysis} activeLens={activeLens} setActiveLens={setActiveLens} />
    <ScenarioPanel analysis={analysis} activeScenario={activeScenario} setActiveScenario={setActiveScenario} />
    <section className="tools-grid" aria-label="Decision tools"><StressTest analysis={analysis} activeAssumption={activeAssumption} setActiveAssumption={setActiveAssumption} stress={stress} setStress={setStress} selectedAssumption={selectedAssumption} /><DecisionSandbox sandbox={sandbox} setSandbox={setSandbox} sensitivity={sensitivity} /></section>
    <ReflectionPanel analysis={analysis} />
    <footer className="workspace-footer"><PrismMark /><div><strong>Prism does not replace your judgment.</strong><span>It helps you see what your decision depends on.</span></div><button className="secondary-button" type="button" onClick={onNewDecision}>Explore another decision <ArrowRight size={16} /></button></footer>
  </motion.section>;
}

function BlueprintPanel({ analysis, activeBlueprint, setActiveBlueprint }) {
  const entries = Object.entries(analysis.blueprint);
  const activeIndex = entries.findIndex(([key]) => key === activeBlueprint);
  return <section id="blueprint" className="panel blueprint-panel" aria-labelledby="blueprint-title"><SectionHeading eyebrow="01 - Decision blueprint" title={<span id="blueprint-title">The anatomy of this decision.</span>} copy="Select any dimension to inspect it. These are working hypotheses, not facts." />
    <div className="blueprint-layout"><div className="blueprint-core"><div className="core-orbit"><PrismMark /></div><strong>Your decision</strong><small>10 connected dimensions</small></div>
      <div className="blueprint-grid" role="tablist" aria-label="Decision dimensions" aria-orientation="vertical">{entries.map(([key, values], index) => <button key={key} id={`blueprint-tab-${key}`} role="tab" aria-selected={activeBlueprint === key} aria-controls="blueprint-panel" tabIndex={activeBlueprint === key ? 0 : -1} className={`blue-node ${activeBlueprint === key ? "selected" : ""}`} style={{ "--delay": `${index * 0.03}s` }} onClick={() => setActiveBlueprint(key)} onKeyDown={(event) => tabKeyDown(event, activeIndex, entries.length, (nextIndex) => setActiveBlueprint(entries[nextIndex][0]))}><BlueprintIcon className={key} /><span>{blueprintLabels[key]}</span><b>{values.length}</b></button>)}</div>
      <motion.div className="blueprint-detail" id="blueprint-panel" role="tabpanel" aria-labelledby={`blueprint-tab-${activeBlueprint}`} key={activeBlueprint} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={transition}><div><p className="eyebrow">{blueprintLabels[activeBlueprint]}</p><h3>{activeBlueprint === "assumptions" ? "What this decision appears to rely on" : "Current working model"}</h3></div>{analysis.blueprint[activeBlueprint].map((item, index) => <div className="detail-item" key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</div>)}</motion.div>
    </div></section>;
}

function LensPanel({ analysis, activeLens, setActiveLens }) {
  const lens = analysis.lenses[activeLens];
  return <section id="lenses" className="panel" aria-labelledby="lenses-title"><SectionHeading eyebrow="02 - Reasoning lenses" title={<span id="lenses-title">Perspectives selected for this decision.</span>} copy="Prism chose these lenses because each adds a distinct way of examining your decision." />
    <div className="lens-layout"><div className="lens-list" role="tablist" aria-label="Reasoning lenses" aria-orientation="vertical">{analysis.lenses.map((item, index) => <button className={activeLens === index ? "active" : ""} id={`lens-tab-${index}`} aria-selected={activeLens === index} aria-controls="lens-panel" role="tab" tabIndex={activeLens === index ? 0 : -1} onClick={() => setActiveLens(index)} onKeyDown={(event) => tabKeyDown(event, activeLens, analysis.lenses.length, setActiveLens)} key={item.name}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.name}</strong><ChevronRight size={16} /></button>)}</div>
      <motion.article className="lens-detail" id="lens-panel" role="tabpanel" aria-labelledby={`lens-tab-${activeLens}`} key={activeLens} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={transition}><div className="lens-title"><div className="lens-icon"><BrainCircuit size={22} /></div><div><p className="eyebrow">Selected because</p><h3>{lens.name}</h3></div></div><p className="why">{lens.why}</p><div className="lens-insights"><Insight label="Observation" text={lens.observation} icon={<ScanSearch />} /><Insight label="Trade-off" text={lens.tradeoff} icon={<ArrowRight />} /><Insight label="Question to sit with" text={lens.question} icon={<CircleHelp />} /><Insight label="Possible blind spot" text={lens.blindSpot} icon={<TriangleAlert />} /></div></motion.article>
    </div></section>;
}

function ScenarioPanel({ analysis, activeScenario, setActiveScenario }) {
  const scenario = analysis.scenarios[activeScenario];
  return <section id="scenarios" className="panel" aria-labelledby="scenarios-title"><SectionHeading eyebrow="03 - Scenario explorer" title={<span id="scenarios-title">Explore what changes when conditions do.</span>} copy="These are plausible branches, not predictions. Start with the condition, then inspect what it would change." />
    <div className="scenario-tabs" role="tablist" aria-label="Possible scenarios">{analysis.scenarios.map((item, index) => <button key={item.name} id={`scenario-tab-${index}`} role="tab" aria-controls="scenario-panel" aria-selected={activeScenario === index} tabIndex={activeScenario === index ? 0 : -1} className={activeScenario === index ? "active" : ""} onClick={() => setActiveScenario(index)} onKeyDown={(event) => tabKeyDown(event, activeScenario, analysis.scenarios.length, setActiveScenario)}><span>{String.fromCharCode(65 + index)}</span>{item.name}</button>)}</div>
    <motion.div className="scenario-card" id="scenario-panel" role="tabpanel" aria-labelledby={`scenario-tab-${activeScenario}`} key={activeScenario} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={transition}><div className="scenario-line" aria-hidden="true"><i /><i /><i /></div><div><p className="eyebrow">Condition</p><h3>{scenario.condition}</h3></div><div className="scenario-copy"><div><p className="eyebrow">What this might change</p><p>{scenario.outlook}</p></div><div><p className="eyebrow">Worth watching</p><p>{scenario.watch}</p></div></div></motion.div>
  </section>;
}

function StressTest({ analysis, activeAssumption, setActiveAssumption, stress, setStress, selectedAssumption }) {
  return <article className="panel stress-panel"><p className="eyebrow">04 - Decision stress test</p><h2>Break one assumption<br />before reality does.</h2><p>Explore how robust your plan is when a key condition changes.</p>
    <div className="assumption-picker" role="group" aria-label="Assumptions to stress test">{analysis.blueprint.assumptions.map((assumption, index) => <button className={activeAssumption === index ? "active" : ""} aria-pressed={activeAssumption === index} type="button" onClick={() => { setActiveAssumption(index); setStress(false); }} key={assumption}>{assumption}</button>)}</div>
    <button className="dark-button" type="button" onClick={() => setStress(true)}><FlaskConical size={17} /> Stress test this assumption</button>
    <AnimatePresence initial={false}>{stress && <motion.div className="stress-result" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={transition} role="status"><ShieldAlert size={19} /><div><strong>Model under pressure</strong><p>If &quot;{selectedAssumption}&quot; weakens, Scenario B becomes more relevant. Create a two-week test before treating this path as robust.</p></div></motion.div>}</AnimatePresence>
  </article>;
}

function DecisionSandbox({ sandbox, setSandbox, sensitivity }) {
  const sliders = [["time", "Time available", "Low", "High"], ["budget", "Financial runway", "Tight", "Flexible"], ["risk", "Risk tolerance", "Careful", "Adventurous"], ["learning", "Learning priority", "Income", "Growth"]];
  return <article className="panel sandbox-panel"><p className="eyebrow">05 - Decision sandbox</p><h2>Adjust the conditions.<br />See what deserves attention.</h2><p>These controls do not change the answer. They reveal where your plan is sensitive.</p>
    <div className="sliders">{sliders.map(([key, label, min, max]) => <label key={key}><span><strong>{label}</strong><b>{sandbox[key]}%</b></span><input aria-label={label} type="range" min="0" max="100" value={sandbox[key]} onChange={(event) => setSandbox((current) => ({ ...current, [key]: Number(event.target.value) }))} style={{ "--value": `${sandbox[key]}%` }} /><small><span>{min}</span><i /><span>{max}</span></small></label>)}</div>
    <div className="sensitivity" role="status"><WandSparkles size={18} /><span><strong>Most sensitive right now:</strong> {sensitivity}.</span></div>
  </article>;
}

function ReflectionPanel({ analysis }) {
  return <section id="reflection" className="reflection" aria-labelledby="reflection-title"><div className="reflection-intro"><p className="eyebrow">06 - Reflection, not recommendation</p><h2 id="reflection-title">Leave with better<br /><span>questions.</span></h2><p>Prism has not chosen for you. It has made the decision more visible so you can move forward deliberately.</p></div>
    <div className="reflection-content"><article className="map-card"><div className="map-head"><div><p className="eyebrow">Decision confidence map</p><h3>What needs your attention?</h3></div><BadgeCheck size={20} /></div>{analysis.evidenceMap.map((item) => <div className="evidence-row" key={item.label}><span className={`evidence-dot ${item.status}`} /><div><strong>{item.label}</strong><p>{item.detail}</p></div><em>{item.status.replaceAll("_", " ")}</em></div>)}</article>
      <article className="next-card"><p className="eyebrow">Research mode</p><h3>Reduce uncertainty with evidence.</h3>{analysis.research.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p><ArrowUpRight size={16} /></div>)}</article></div>
    <div className="reflection-prompts">{analysis.reflection.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></article>)}</div>
  </section>;
}
