---
name: Financial Quest
description: An arcade ledger — a dark teal money quest where every dollar is visible, every number cites its IRS source, and gold appears only when earned.
colors:
  teal-ink: "hsl(195 40% 7%)"
  card-ink: "hsl(194 34% 10%)"
  popover-ink: "hsl(194 34% 11%)"
  panel-ink: "hsl(192 28% 15%)"
  ledger-line: "hsl(191 26% 18%)"
  mist-text: "hsl(165 25% 92%)"
  fog-text: "hsl(180 12% 62%)"
  electric-verdigris: "hsl(165 75% 52%)"
  verdigris-ink: "hsl(195 50% 8%)"
  earned-gold: "hsl(43 90% 62%)"
  gold-ink: "hsl(42 90% 10%)"
  money-emerald: "hsl(152 65% 55%)"
  emerald-ink: "hsl(152 60% 8%)"
  caution-amber: "hsl(35 92% 62%)"
  amber-ink: "hsl(35 90% 10%)"
  problem-red: "hsl(6 80% 62%)"
  red-ink: "hsl(195 50% 8%)"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Public Sans, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Bricolage Grotesque, Public Sans, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
  figure:
    fontFamily: "Spline Sans Mono, ui-monospace, monospace"
    fontSize: "2.6rem"
    fontWeight: 600
    lineHeight: 1
  body:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Spline Sans Mono, ui-monospace, monospace"
    fontSize: "10px"
    fontWeight: 600
    letterSpacing: "0.16em"
rounded:
  sm: "16px"
  md: "18px"
  lg: "20px"
  xl: "24px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.electric-verdigris}"
    textColor: "{colors.verdigris-ink}"
    rounded: "{rounded.sm}"
    padding: "16px"
  button-success:
    backgroundColor: "{colors.money-emerald}"
    textColor: "{colors.emerald-ink}"
    rounded: "{rounded.sm}"
    padding: "16px"
  card-conversational:
    backgroundColor: "{colors.card-ink}"
    rounded: "{rounded.xl}"
    padding: "24px 32px"
  recommendation-block:
    backgroundColor: "{colors.panel-ink}"
    rounded: "{rounded.sm}"
    padding: "20px"
  badge-earned:
    backgroundColor: "{colors.card-ink}"
    textColor: "{colors.earned-gold}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# Design System: Financial Quest

## Overview

**Creative North Star: "The Arcade Ledger"**

A game HUD laid over an accountant's ledger. The world is a single dark room: deep teal-ink ground with a faint 44px grid (`.quest-ground`) and a soft verdigris glow rising from the top edge, as if the board itself is lit. Every dollar is visible somewhere — the stacked budget bar accounts for the whole paycheck — and every computed number can show its arithmetic and cite its IRS source. The tone is confident and playful (phases, badges, "Quest Log") but the numbers are dead serious: mono, tabular, cited, and labeled "projected" when they are.

The build pins `.dark` on `<html>`; the light palette exists in `:root` for coherence but never ships. Color is rationed by meaning, not decoration: verdigris is the app's voice, and the other four hues are a strict semantic contract (see Colors). The world explicitly refuses the pastel fintech card-stack and the emoji-as-reward default — rewards are minted gold badges with Lucide stroke icons, never emoji.

**Key Characteristics:**
- Dark-only teal-ink ground with a faint grid texture; browser chrome (selection, caret, range inputs, scrollbars, focus rings) is tokenized too
- One accent voice (electric verdigris) plus four semantically locked hues: gold earned, emerald money-good, amber caution, red problems
- Every currency figure is mono + tabular with an explicit cadence suffix (`/mo`, `/yr`)
- Generous radii (16–24px), soft colored glows instead of hard shadows, spring-based motion that respects reduced-motion globally
- Micro-labels in uppercase tracked mono are the ledger's annotation layer

## Colors

A near-monochrome teal room where five hues each carry one non-negotiable meaning.

### Primary
- **Electric Verdigris** (`hsl(165 75% 52%)`, `--primary`): the app's voice. Primary buttons, the active step highlight, the committed segment of the budget bar, recommended numbers, jargon-term underlines, link hovers, the focus ring, the caret, selection tint, and the `.quest-ground` glow. Dark verdigris ink (`hsl(195 50% 8%)`) sits on top of it.

### Secondary
- **Earned Gold** (`hsl(43 90% 62%)`, `--reward`): appears only when something has been earned — the badge shelf pills, the phase-cleared milestone toast (border, icon chip, glow, caps label), and confetti. Rendered as tinted fills (`reward/15`) with `reward/50` borders, never as a large surface.
- **Money Emerald** (`hsl(152 65% 55%)`, `--success`): strictly money-good facts — "free to allocate" when positive, cleared-step checkmarks and ledger amounts, the action-progress bar, "wealth engine" totals, tax-saved callouts, the official-status badge.
- **Caution Amber** (`hsl(35 92% 62%)`, `--warning`): caution and projected data only — the `PROJECTED` mono chip on source footnotes and status badges.
- **Problem Red** (`hsl(6 80% 62%)`, `--destructive`): genuine problems only — negative free budget, over-contribution warnings (tinted `destructive/10` panel with `destructive/40` border).

### Neutral
- **Teal Ink** (`hsl(195 40% 7%)`, `--background`): the ground; also the page theme color (`#0b1418`).
- **Card Ink** (`hsl(194 34% 10%)`, `--card` / `--surface`): step cards, toasts, unchecked action tiles.
- **Panel Ink** (`hsl(192 28% 15%)`, `--secondary` / `--muted` / `--accent`): inset panels, input fills, track backgrounds, recommendation blocks (at 60% over card).
- **Ledger Line** (`hsl(191 26% 18%)`, `--border` / `--input`): every rule, divider, and the `.quest-ground` gridlines (at 35%).
- **Mist Text** (`hsl(165 25% 92%)`, `--foreground`): primary text, faintly teal-warmed.
- **Fog Text** (`hsl(180 12% 62%)`, `--muted-foreground`): descriptions, legends, micro-labels, expense bar segment (at 30%).

### Named Rules
**The Earned Gold Rule.** Gold renders only on things the player has earned: badge pills, the milestone toast, the finale. It never decorates navigation, buttons, or headers. Unearned badges are dashed-border fog, not dim gold.

**The Semantic Lock Rule.** Emerald = money-good fact, amber = caution/projected, red = genuine problem, verdigris = the app talking. No hue substitutes for another, and none is used for mood.

**The Tinted-Fill Rule.** Semantic hues appear as tinted fills with matching translucent borders (`color/10–15` fill, `color/25–50` border, full-strength text/icon) — a solid semantic background is reserved for primary/success action buttons and completed checkmarks.

## Typography

**Display Font:** Bricolage Grotesque (falls back to Public Sans)
**Body Font:** Public Sans (with system-ui)
**Label/Mono Font:** Spline Sans Mono (with ui-monospace)

**Character:** A characterful, slightly quirky display face over a plainspoken civic body, with a mono that does all the counting. The display face carries the quest's personality; the mono carries its credibility.

### Hierarchy
- **Display** (700, 1.5–2rem responsive `text-2xl md:text-[2rem]`, tight leading, `tracking-tight`, `text-wrap: balance`): step-card titles and page h1s (h1 reaches `text-4xl` on /sources).
- **Headline** (700, 1.25–1.5rem, display face): rail headers ("Quest Log", "Action Board") and section h2s, usually paired with a verdigris Lucide icon.
- **Figure** (600 mono tabular, 2.6rem, line-height 1): the recommended number — the largest thing on any step. Smaller figures step down through `text-2xl`/`text-xl` but stay mono.
- **Body** (400, 1rem–1.125rem, relaxed leading): descriptions in fog text, statements in mist text; prose measures cap near 62ch.
- **Label** (600 mono, 10–11px, uppercase, `tracking-[0.14em–0.16em]`): the ledger annotation layer — "Recommended", "Badges", phase names, table headers, status chips, "from:" provenance lines.

### Named Rules
**The One Currency Rule.** Every dollar figure renders through the `Currency` component: Spline Sans Mono, `tabular-nums`, rounded to whole dollars with en-US separators, true minus sign (−), and an explicit smaller muted cadence suffix (`/mo`, `/yr`) when recurring. Dollar amounts inside plain label strings are wrapped in mono/tabular spans to match.

**The Mono-Caps Annotation Rule.** Small structural labels are always mono, uppercase, wide-tracked, 10–11px. This is the system's only "small caps" device; there are no sans-serif kickers.

## Layout

A three-column game HUD at desktop: Quest Log rail left (fixed 320px, `sticky top-0 h-screen`, own scroll, right border), the conversational step card center (max-w-2xl, centered on the `.quest-ground` grid), Action Board right (fixed 320px, left border, appears at `xl`). The left rail appears at `lg`; below that both rails collapse into sheets summoned from a fixed 16px-tall (h-16) mobile header with `bg-background/85 backdrop-blur-md`. Container is centered with 2rem padding, capped at 1400px.

Rhythm runs on Tailwind's 4px grid: 16px (`p-4`) inside panels and buttons, 20px (`p-5`) in recommendation blocks, 24–32px (`p-6 sm:p-8`) inside step cards, 20–24px vertical stacks (`space-y-5`, `mb-6`) between blocks. The rails use tighter 10–12px item spacing. The phase rail draws a 1px left spine (`border-l pl-3.5`) that turns translucent verdigris for the current phase.

## Elevation & Depth

No neutral drop shadows. Depth comes from tonal layering (teal-ink ground → card ink → panel ink) plus 1px ledger-line borders; when a shadow appears it is a large, soft, downward *colored glow* whose hue states the meaning of the element casting it.

### Shadow Vocabulary
- **Ambient card seat** (`box-shadow: 0 16px 48px -24px hsl(var(--background))`): default step card; barely-there grounding against the grid.
- **Advice glow** (`0 16px 48px -16px hsl(var(--primary)/0.25)`): advice-mode cards, paired with a `primary/30` border.
- **Hover invitation** (`0 8px 24px -12px hsl(var(--primary)/0.35)`): unchecked action tiles on hover, with border shifting to `primary/50`.
- **Reward glow** (`0 20px 60px -20px hsl(var(--reward)/0.45)`): the milestone toast only.
- **Active halo** (`0 0 0 3px hsl(var(--primary)/0.2)`): the current step's marker dot.

### Named Rules
**The Colored-Glow Rule.** Shadows are always tinted by a token (`--primary`, `--reward`, or the background itself), always large-radius with negative spread, never hard-edged or offset-styled. If an element doesn't mean anything, it doesn't glow.

## Shapes

Generously rounded, soft-machine geometry keyed off `--radius: 1.25rem`. Step cards are the roundest surfaces (24px, `rounded-3xl`); action buttons and recommendation blocks sit at 16px (`rounded-2xl`); inset panels and tiles at 12–16px (`rounded-xl`); small controls at 8px (`rounded-lg`). Badges, the budget bar, progress tracks, and meta chips are full pills. Borders are 1px ledger-line everywhere (choice buttons use 2px); dashed borders mean "not yet" — empty states, unearned badges, and the rule above the show-the-math disclosure. The signature texture is the striped diagonal (`.stripe-pending`, 45° verdigris stripes alternating full and 30% opacity every 4px) meaning "proposed but not committed."

Icons are Lucide stroke icons exclusively (strokeWidth 2.25–3.5 for emphasis), usually seated in a rounded tinted chip (`h-9`–`h-11`, `rounded-xl`/`rounded-2xl`, `primary/10` fill + `primary/30–40` border). No emoji anywhere.

## Components

### Buttons
- **Shape:** softly rounded pill-adjacent blocks (16px radius), full-width within cards, bold text (16–18px), 16px padding.
- **Primary (allocate/advance):** solid verdigris on verdigris-ink; hover `brightness(1.10)`, active `scale(0.99)`, disabled 50% opacity. Often carries a trailing `ArrowRight`.
- **Success (lump-sum funding):** identical anatomy in money-emerald; used only when the action is itself a money-good move.
- **Choice pair:** side-by-side `bg-card` blocks with 2px borders; the affirmative hovers to `border-primary bg-primary/5`, the decline hovers to a neutral border.
- **Quiet escape:** "Skip this step" is a plain underlined muted text link, never a styled button.

### Cards / Containers (ConversationalCard)
- **Corner Style:** 24px (`rounded-3xl`), max-w-2xl, 24–32px padding.
- **Background:** card ink; **advice mode** upgrades border to `primary/30`, title to verdigris, and adds the advice glow.
- **Header anatomy:** 44px icon chip + balanced display-bold title + fog description; entry animates with a spring (opacity/y/scale, damping 22, stiffness 260); inactive cards dim to 60% opacity.

### Recommendation Block (signature)
The standard shape of every computed recommendation: mono-caps "Recommended" label, the 2.6rem verdigris figure with cadence, the benefit stated beside it, then a dashed rule and a "Show the math" ± disclosure containing a mono ledger table (the resolving row gets a top rule + verdigris + `total` weight, and the table always includes the "Your free budget (the cap)" row), an assumptions paragraph, and a `SourceFootnote` (external-link citation plus amber `PROJECTED` chip when the year is unofficial). While on screen it publishes its monthly amount to the ephemeral proposal store so the budget bar shows it as a striped segment; lump sums (`per="once"`) stay off the bar.

### Inputs / Fields
- **Style:** panel-ink fills, 8–12px radius, mono tabular right-aligned for currency (with an absolute `$` prefix); inline selects are transparent with a 2px verdigris bottom border.
- **Focus:** `focus:ring-2` in `primary/50` (or global 2px `--ring` outline, offset 2); error state turns text and ring to problem red.
- **Range inputs:** `accent-color: var(--primary)` — no browser blue.

### Chips
- **Meta chips:** mono 10–11px in pill borders (year/filing status).
- **Status chips:** tinted-fill mono-caps (`success/15` official, `warning/15` projected).
- **Badges:** pill with Lucide icon; earned = `reward/50` border + `reward/15` fill + gold text; unearned = dashed border + 70% fog text.

### Navigation (Quest Log rail)
Phase names in mono-caps (emerald when cleared, verdigris when current, fog when future) with a `cleared`/`n/m` counter; steps hang off a 1px spine with 16px marker circles (emerald-filled check when done, verdigris ring + halo when active) and right-aligned per-step `Currency` amounts. Cleared and future phases collapse to a one-line summary. Footer links hover to `bg-primary/10 text-primary`.

### Milestone Toast (signature)
The one gold moment: fixed bottom-center card with reward border/glow, gold icon chip, mono-caps "Phase cleared · badge earned", display-bold badge name, and the phase's locked-in monthly total. Fires from store phase-crossings, auto-dismisses at 4.5s, is never persisted, and pairs with a ~1.4s canvas confetti burst in exactly three token colors (`--reward`, `--primary`, `--success`) read from computed styles. Both toast motion and confetti collapse under `useReducedMotion`.

## Do's and Don'ts

### Do:
- **Do** route every dollar figure through `Currency` (mono, tabular, whole dollars, explicit `/mo` or `/yr`, true − for negatives).
- **Do** route every computed recommendation through `RecommendationBlock`, ending the math table with the free-budget cap row and citing a source with the `projected` flag when the year is unofficial.
- **Do** derive step order, phase structure, and badge names from `src/shared/config/flow.ts` — never redeclare them.
- **Do** use tinted fills with matching translucent borders for semantic states, and dashed borders for not-yet states.
- **Do** honor reduced motion everywhere: the global media query zeroes animation/transition durations, and canvas effects check `useReducedMotion` before drawing.
- **Do** keep user data sessionStorage-only and say so; /sources shows the player exactly what the browser holds.

### Don't:
- **Don't** use gold for anything unearned — no gold headers, buttons, accents, or hover states.
- **Don't** use emerald for generic positivity, amber outside caution/projected, or red outside genuine problems.
- **Don't** use emoji as icons or rewards; the icon system is Lucide strokes in tinted chips.
- **Don't** ship neutral or hard-offset drop shadows; shadows are large soft glows tinted by a meaning-bearing token.
- **Don't** render proportional-figure or sans-serif currency, or omit the cadence suffix on recurring amounts.
- **Don't** build for light mode; `.dark` is pinned and the light `:root` palette is unshipped scaffolding.
