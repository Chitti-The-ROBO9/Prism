"use client";

import { AlertCircle, Layers3 } from "lucide-react";

export function PrismMark() {
  return <span className="prism-mark" aria-hidden="true"><i /><i /><i /></span>;
}

export function SectionHeading({ eyebrow, title, copy, action }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{copy && <p>{copy}</p>}</div>{action}</div>;
}

export function Insight({ label, text, icon }) {
  return <div className="insight"><span>{icon}</span><div><p>{label}</p><strong>{text}</strong></div></div>;
}

export function InlineError({ message, onRetry }) {
  if (!message) return null;
  return <div className="inline-error" role="alert"><AlertCircle size={17} /><span>{message}</span>{onRetry && <button onClick={onRetry}>Try again</button>}</div>;
}

export function BlueprintIcon({ className = "" }) {
  return <span className={`node-icon ${className}`}><Layers3 size={15} /></span>;
}
