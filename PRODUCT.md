# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

General-public US savers (not finance professionals) who want to know, concretely, what to do with each month's paycheck and in what order. They arrive with a monthly income, a rough sense of expenses, and confusion about the alphabet soup (HSA, IRA, 401k, HYSA). Session-based use: one sitting per year, or whenever income changes.

## Product Purpose

An interactive, gamified version of the personal-finance "flowchart of prioritization": a one-card-at-a-time quest that walks the user through the canonical FI ordering (budget → starter emergency fund → employer match → high-interest debt → full emergency fund → HSA → IRA → max 401k → moderate debt → goals → 529 → mega backdoor → low-interest debt → taxable), allocates their real monthly budget step by step, and emits a concrete Action Board of tasks to execute. Success = the user leaves with every dollar assigned and a short list of real-world actions.

## Positioning

Unlike the static flowchart image or generic calculators, it allocates the user's actual budget against the current tax year's actual IRS limits, with each figure traceable to its official source document. Educational tool, explicitly not financial advice (disclaimer is a product fact and must remain).

## Operating Context

- Single-page quest at `/` plus SEO/AEO content routes: `/faq`, `/howto`, `/docs`, `/aifaq` (each with self-referential canonicals; a new route must add its own).
- User state lives in `sessionStorage` via zustand persist (survives refresh, clears on tab close). No accounts, no backend, no analytics on user figures: user data never leaves the browser. This privacy fact is durable and should be surfaced, not just true.
- Tax-year data in `src/shared/config/financial-constants.ts` for 2026 (official, with IRS citations in comments) and 2027 (projected estimates pending IRS announcements ~Nov 2026).
- Cross-promotes the companion site retirement.melson.us (withdrawal strategy) at quest completion.

## Capabilities and Constraints

- Next.js 14 App Router, TypeScript, Tailwind + CSS-variable tokens, zustand, framer-motion, lucide-react. Feature-Sliced Design layout (app/widgets/features/entities/shared) per the owner's global code standards.
- Deployed on Vercel; `git push` deploys. Push only with the owner's explicit go-ahead.
- 16-step flow; steps can be skipped; going back clears that step's allocation and action items; `budget-exhausted` is a terminal state when allocations consume the full budget.
- Recommendation math currently assumes a 22% federal bracket + 7.65% FICA for tax-savings estimates and a 4.2% HYSA rate; these are assumptions, not user inputs, and must be disclosed wherever used.
- Terminology: quest, steps, phases, Quest Log, Action Board, badges. Filing status collected but lightly used.

## Brand Commitments

- Name: "Financial Quest" (site: Financial Independence Flow Chart).
- Voice: playful, energetic, plain-English coach; jargon always explained (JargonTerm/glossary). Owner-approved direction (2026-09-07): bold, fun, action-packed GUI; gold reserved exclusively for earned rewards; emerald = money-good; verdigris/teal accent replaces generic blue; amber = caution/projected; red = genuine problems only.
- No em dashes in rendered site copy (owner's global rule for published copy).

## Evidence on Hand

- Real IRS figures with citations: IRS Notice 2025-67 (401k/IRA), Rev. Proc. 2025-19 (HSA), Rev. Proc. 2025-28 (standard deduction) in `src/shared/config/financial-constants.ts`. 2027 values are projections and must be labeled as such.
- No testimonials, user counts, or performance claims exist; do not fabricate any.

## Product Principles

- Show every dollar: the full paycheck is always accounted for on screen, not just a remainder.
- Cite every number: any computed figure can be expanded to its arithmetic, assumptions, and official source.
- Rewards are earned, never decorative: reward styling appears only at genuine milestones.
- Momentum over friction: one decision per screen, obvious primary action, skipping is always allowed and never shamed.
- The user's data is theirs: everything stays in the browser and the product says so.
