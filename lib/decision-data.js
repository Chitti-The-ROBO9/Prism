export const prompts = [
  "Should I prepare for GATE or focus on placements?",
  "Should I launch this startup idea now?",
  "Should I move abroad for my next role?"
];

export const blueprintLabels = {
  goals: "Goals", values: "Values", constraints: "Constraints", unknowns: "Unknowns", risks: "Risks",
  assumptions: "Assumptions", stakeholders: "Stakeholders", resources: "Resources", successCriteria: "Success criteria", opportunities: "Opportunities"
};

export const questionSet = [
  { key: "goal", title: "What outcome matters most?", helper: "A clear goal helps Prism choose the right reasoning lenses.", value: "Build long-term career options" },
  { key: "concern", title: "What is your biggest concern?", helper: "Name the tension you do not want a generic answer to ignore.", value: "Avoid closing doors too early" },
  { key: "horizon", title: "What is your time horizon?", helper: "When will this decision start to matter in practice?", value: "6-12 months" },
  { key: "riskTolerance", title: "How much uncertainty feels acceptable?", helper: "There is no right level - this calibrates the exploration.", value: "Balanced" },
  { key: "values", title: "What values should carry the most weight?", helper: "For example: learning, security, family, impact, autonomy.", value: "Learning and financial independence" },
  { key: "constraints", title: "What constraints should Prism respect?", helper: "Time, budget, commitments, location, health, or obligations.", value: "College workload and limited daily study time" }
];

export const defaultContext = Object.fromEntries(questionSet.map(({ key, value }) => [key, value]));
