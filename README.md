# Prism

> **Understand your decision before you make it.**

Prism is an AI-native decision workspace. It does not choose for people. Instead, it makes the structure behind an important decision visible: goals, values, constraints, assumptions, risks, unknowns, and trade-offs.

Built for the OpenAI hackathon's Work & Productivity category.

## Why Prism

Most AI products respond with a polished answer. Prism starts one level earlier: it helps a person inspect what their decision depends on before they commit.

The intended outcome is not, "The AI told me what to do." It is, "I did not realise how many assumptions were inside this decision."

## Experience

1. **Decision intake** - enter a real choice and add the context that matters.
2. **Decision Blueprint** - inspect the decision's goals, values, constraints, unknowns, assumptions, resources, risks, opportunities, stakeholders, and success criteria.
3. **Reasoning lenses** - Prism selects relevant perspectives for the decision and explains why each one is useful.
4. **Scenario explorer** - compare what changes when assumptions hold, weaken, or external conditions shift.
5. **Stress test and sandbox** - deliberately pressure-test assumptions and adjust the conditions that make the decision sensitive.
6. **Reflection** - leave with research actions and better questions, not a recommendation.

## Screenshots

Add final submission screenshots here before publishing the Devpost page:

| Screen | Placeholder |
| --- | --- |
| Decision intake | `docs/screenshots/01-decision-intake.png` |
| Decision Blueprint | `docs/screenshots/02-decision-blueprint.png` |
| Stress test and reflection | `docs/screenshots/03-reflection.png` |

## Architecture

```text
Browser
  -> guided decision context
  -> secure Next.js API route
  -> OpenAI Responses API (GPT-5.6)
  -> validated decision model
  -> interactive Prism workspace
```

- The OpenAI key is server-only and never reaches the browser.
- Requests and model responses are validated with Zod.
- The API does not store responses (`store: false`).
- The active workspace is saved locally so a refresh does not lose a decision.
- If an API key, quota, or connection is unavailable, Prism remains fully explorable in Demo Mode.

## Tech stack

- Next.js 16 and React 19
- Motion for restrained UI transitions
- Lucide icons
- OpenAI Responses API
- Zod validation
- Vercel deployment

## Local development

Requirements: Node.js 20.9 or later and npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

```bash
OPENAI_API_KEY=your_key_here
PRISM_OPENAI_MODEL=gpt-5.6
NEXT_PUBLIC_SITE_URL=https://your-prism-domain.vercel.app
```

`OPENAI_API_KEY` is optional for local exploration. Without it, Prism opens its interactive sample model instead of making an API request.

## Deploy to Vercel

1. Push this repository to GitHub.
2. In [Vercel](https://vercel.com/new), import the repository.
3. Vercel detects Next.js automatically. Keep the default build command: `npm run build`.
4. Add `OPENAI_API_KEY` in **Project Settings -> Environment Variables** for Production and Preview if live analysis is desired.
5. Set `PRISM_OPENAI_MODEL` to the GPT-5.6 model identifier available to the project.
6. After the first deployment, set `NEXT_PUBLIC_SITE_URL` to the deployed Vercel URL or custom domain, then redeploy.

No database, account setup, or rebuild is required for judges to explore Demo Mode.

## Quality checks

```bash
npm run lint
npm run build
```

Both checks should pass before every deployment.

## Hackathon notes

Prism uses GPT-5.6 for structured decision reasoning and is built iteratively with Codex. Codex accelerated the component architecture, interaction implementation, server route hardening, accessibility refinements, and deployment preparation.

For the demo video, show a single decision move from intake to Blueprint, pressure-test one assumption, adjust a sandbox control, and end on the Reflection screen. The product story is: **Prism does not replace judgment; it makes judgment more rigorous.**

## License

[MIT](LICENSE)
