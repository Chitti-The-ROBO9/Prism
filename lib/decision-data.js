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
  { key: "horizon", title: "What is your time horizon?", helper: "When will this decision start to matter in practice?", value: "6–12 months" },
  { key: "riskTolerance", title: "How much uncertainty feels acceptable?", helper: "There is no right level—this calibrates the exploration.", value: "Balanced" },
  { key: "values", title: "What values should carry the most weight?", helper: "For example: learning, security, family, impact, autonomy.", value: "Learning and financial independence" },
  { key: "constraints", title: "What constraints should Prism respect?", helper: "Time, budget, commitments, location, health, or obligations.", value: "College workload and limited daily study time" }
];

export const defaultContext = Object.fromEntries(questionSet.map(({ key, value }) => [key, value]));

export const demoAnalysis = {
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
