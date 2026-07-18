# Prism

**Understand your decision before you make it.**

Prism is an AI-native decision workspace. Instead of delivering a single confident answer, it helps people inspect the goals, constraints, assumptions, uncertainties, risks, and trade-offs behind an important choice.

## What it does

1. Collects a decision and a small amount of user context.
2. Builds an editable **Decision Blueprint**.
3. Selects dynamic reasoning lenses that are relevant to that specific decision.
4. Explores plausible scenarios rather than predicting an outcome.
5. Lets the user stress-test an assumption and adjust decision conditions in a sandbox.
6. Ends with an evidence map, research actions, and reflection prompts—not a recommendation.

## Core experience

- **Decision Blueprint:** goals, values, constraints, unknowns, risks, assumptions, stakeholders, resources, opportunities, and success criteria.
- **Dynamic lenses:** each perspective explains why it was selected, then presents observations, trade-offs, questions, and possible blind spots.
- **Scenario Explorer:** investigates changes when conditions hold, an assumption weakens, or external conditions shift.
- **Decision Stress Test:** deliberately breaks a selected assumption before reality does.
- **Decision Sandbox:** adjusts time, financial runway, risk tolerance, and priorities to surface sensitivity.
- **Decision Confidence Map:** distinguishes well-supported areas from items needing verification, uncertainty, and personal judgement.
- **Research Mode:** turns uncertainty into concrete evidence-gathering next steps.

## Tech

- Next.js 16, React, JavaScript
- Tailwind-free bespoke CSS system for the product UI
- Motion for subtle progressive transitions
- Lucide icons
- OpenAI Responses API with a server-side route
- Zod validation for the analysis request

## Run locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

### Configure GPT-5.6

Set `OPENAI_API_KEY` in `.env.local`. Prism's server route defaults to `PRISM_OPENAI_MODEL=gpt-5.6`; set `PRISM_OPENAI_MODEL` only if the model identifier available in your account differs.

Without an API key, Prism remains fully navigable in polished demo mode using the included GATE-vs-placements sample analysis. This makes the core interaction easy to evaluate without credentials.

## Architecture

```text
Browser → Guided context → /api/analyze → OpenAI Responses API
    ↓                              ↓
Interactive decision workspace ← structured JSON analysis
```

The browser never receives the OpenAI API key. The route validates requests, asks the model for a transparent structured decision model, and returns it for rendering. Model output is intentionally framed as editable hypotheses, never a definitive recommendation.

## Hackathon implementation notes

Prism was built through iterative Codex-assisted product engineering: designing the decision workflow, implementing reusable interaction patterns, shaping a production Next.js app, and refining the reasoning UI. GPT-5.6 powers the structured decision analysis when a key is configured; Codex accelerated the implementation and iterative UI/architecture work.

## Deploy

Deploy to Vercel and add `OPENAI_API_KEY` and optionally `PRISM_OPENAI_MODEL` as environment variables. Never expose the API key through a public client-side variable.

## License

Released under the [MIT License](LICENSE).
