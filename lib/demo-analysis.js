const MAX_TITLE_LENGTH = 72;

function valueOr(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function shortText(value, maxLength = MAX_TITLE_LENGTH) {
  const compact = value.replace(/\s+/g, " ").trim().replace(/[?.!]+$/, "");
  return compact.length > maxLength ? `${compact.slice(0, maxLength - 1).trim()}...` : compact;
}

function listFrom(value, fallback) {
  const items = valueOr(value, fallback).split(/,|\band\b/i).map((item) => item.trim()).filter(Boolean);
  return items.length ? items.slice(0, 3) : [fallback];
}

function chooseLensProfile(decision) {
  const text = decision.toLowerCase();
  if (/startup|business|launch|product|company|founder/.test(text)) return { primary: "Business Perspective", secondary: "Customer Perspective", focus: "market fit and execution" };
  if (/job|career|placement|gate|study|college|degree|internship|learn/.test(text)) return { primary: "Career Perspective", secondary: "Learning Perspective", focus: "long-term growth and opportunity" };
  if (/move|abroad|relocat|country|city|visa/.test(text)) return { primary: "Transition Perspective", secondary: "Family Perspective", focus: "adaptation and practical commitments" };
  if (/money|invest|finance|buy|budget|salary/.test(text)) return { primary: "Financial Perspective", secondary: "Risk Perspective", focus: "financial resilience and downside" };
  return { primary: "Practical Perspective", secondary: "Values Perspective", focus: "feasibility and personal alignment" };
}

export function createDemoAnalysis(decision, context = {}) {
  const topic = shortText(valueOr(decision, "this decision"));
  const goal = valueOr(context.goal, "make a sustainable, well-informed choice");
  const concern = valueOr(context.concern, "avoid overlooking an important trade-off");
  const horizon = valueOr(context.horizon, "the coming months");
  const riskTolerance = valueOr(context.riskTolerance, "a balanced level of uncertainty");
  const constraints = valueOr(context.constraints, "available time and existing commitments");
  const values = listFrom(context.values, "learning, stability, and personal fit");
  const profile = chooseLensProfile(topic);

  return {
    title: topic,
    summary: `This simulated model explores how ${topic.toLowerCase()} aligns with your goal of ${goal.toLowerCase()} while respecting ${constraints.toLowerCase()}.`,
    blueprint: {
      goals: [goal, `Choose a path around ${topic} that remains workable over ${horizon}`],
      values,
      constraints: listFrom(constraints, "available time and existing commitments"),
      unknowns: [`Which facts about ${topic} would most change your view?`, `How the decision will feel after ${horizon}`],
      risks: [concern, `Committing to ${topic} before testing the assumptions behind it`],
      assumptions: [`Your current priorities will remain important through ${horizon}`, `The available time and support for ${topic} will be sufficient`],
      stakeholders: ["You", "People affected by the decision", "People whose input could reduce uncertainty"],
      resources: ["Your available time and attention", "Relevant conversations and first-hand research", "A small reversible experiment"],
      successCriteria: [`Progress toward ${goal.toLowerCase()}`, `A decision that fits ${constraints.toLowerCase()}`, "Clarity about the most important trade-offs"],
      opportunities: [`Use a small experiment to learn about ${topic}`, "Keep the next step reversible while more evidence is gathered"]
    },
    lenses: [
      {
        name: profile.primary,
        why: `This lens matters because ${topic} has implications for ${profile.focus}.`,
        observation: `Your stated goal is ${goal.toLowerCase()}, so the most useful comparison is whether each path meaningfully advances that outcome.`,
        tradeoff: `Potential progress toward ${goal.toLowerCase()} versus the limits created by ${constraints.toLowerCase()}.`,
        question: `What would make ${topic.toLowerCase()} feel worthwhile after ${horizon}?`,
        blindSpot: "Treating the most visible outcome as the only measure of success."
      },
      {
        name: profile.secondary,
        why: `This lens helps test whether ${topic.toLowerCase()} fits the people, priorities, and commitments around you.`,
        observation: `You named ${values.join(", ")} as important values, so any path that conflicts with them deserves closer scrutiny.`,
        tradeoff: "Moving quickly versus preserving the flexibility to adjust when your priorities become clearer.",
        question: `Which value would you be least willing to compromise while deciding about ${topic.toLowerCase()}?`,
        blindSpot: "Assuming your current energy, support, or motivation will stay constant."
      },
      {
        name: "Evidence Perspective",
        why: `The decision depends on information that is not yet verified, especially around ${concern.toLowerCase()}.`,
        observation: `Your current risk tolerance is ${riskTolerance.toLowerCase()}, which makes the quality of evidence especially important.`,
        tradeoff: "Deciding sooner versus taking time to reduce the uncertainty that matters most.",
        question: `What single fact would most change how you view ${topic.toLowerCase()}?`,
        blindSpot: "Mistaking a plausible story for evidence about your specific situation."
      }
    ],
    scenarios: [
      {
        name: "Conditions stay aligned",
        condition: `Your priorities, available time, and support remain consistent with pursuing ${topic.toLowerCase()}.`,
        outlook: `The decision is more likely to support ${goal.toLowerCase()} because its key conditions remain intact.`,
        watch: `Check whether your real weekly capacity still matches ${constraints.toLowerCase()}.`
      },
      {
        name: "A key assumption weakens",
        condition: `The concern "${concern}" becomes more significant than expected.`,
        outlook: `The trade-offs around ${topic.toLowerCase()} may become less acceptable, making a smaller or more reversible step more valuable.`,
        watch: "Identify an early signal that would tell you this condition is changing."
      },
      {
        name: "New evidence changes the picture",
        condition: `You learn something material about ${topic.toLowerCase()} before ${horizon}.`,
        outlook: "A better-informed choice may look different from the one that seems attractive today.",
        watch: "Decide in advance which evidence would justify revisiting the plan."
      }
    ],
    evidenceMap: [
      { label: "Your values and priorities", status: "highly_personal", detail: `Only you can weigh ${values.join(", ")} when deciding about ${topic.toLowerCase()}.` },
      { label: "Available time and constraints", status: "needs_verification", detail: `Compare ${constraints.toLowerCase()} with a realistic calendar rather than an ideal week.` },
      { label: "Future conditions", status: "uncertain", detail: `The outcome of ${topic.toLowerCase()} may shift as circumstances change over ${horizon}.` },
      { label: "Decision context", status: "well_supported", detail: "The simulated model is grounded in the goal, concern, values, and constraints you provided." }
    ],
    research: [
      `List the two facts that would most change your view of ${topic.toLowerCase()}.`,
      `Run one small, reversible test related to ${topic.toLowerCase()} within the next two weeks.`,
      `Talk with one person who understands the trade-off behind ${topic.toLowerCase()} and compare their experience with your constraints.`
    ],
    reflection: [
      `Which outcome would still feel worthwhile if ${topic.toLowerCase()} produced a slower result than hoped?`,
      `What assumption about ${topic.toLowerCase()} feels least tested right now?`,
      "What is the smallest next step that creates information without closing other options?"
    ]
  };
}
