// Single source of truth for the quest flow.
// The store, QuestFlow, QuestBar, and the sources page all derive from this file;
// never redeclare step order anywhere else.

import { Map as MapIcon, Shield, Sparkles, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type StepId =
    | 'year-selection'
    | 'income'
    | 'budget'
    | 'emergency-fund'
    | 'match-employer'
    | 'debt-payoff'
    | 'emergency-fund-full'
    | 'hsa'
    | 'ira'
    | 'moderate-debt'
    | 'max-401k'
    | 'goals'
    | 'education'
    | 'mega-backdoor'
    | 'low-interest-debt'
    | 'taxable'
    | 'completed'
    | 'budget-exhausted';

export type PhaseId = 'foundation' | 'protect' | 'grow' | 'optimize';

export interface FlowPhase {
    id: PhaseId;
    name: string;
    tagline: string;
    badgeName: string;
    /** Shown in the badge tooltip: what clearing this phase actually means */
    badgeLore: string;
}

export interface FlowStep {
    id: StepId;
    label: string;
    phase: PhaseId;
    /** One-line answer to "why does this step outrank the ones after it?" */
    whyNow: string;
}

export const PHASES: FlowPhase[] = [
    {
        id: 'foundation', name: 'Foundation', tagline: 'Know your numbers', badgeName: 'Cartographer',
        badgeLore: 'Mapped the terrain: tax year picked, income and expenses on the table. The whole quest runs on these numbers.',
    },
    {
        id: 'protect', name: 'Protect', tagline: 'Guaranteed wins first', badgeName: 'Shieldbearer',
        badgeLore: 'Built the defenses: starter cash in place, full employer match claimed, high-interest debt handled, emergency fund complete.',
    },
    {
        id: 'grow', name: 'Grow', tagline: 'Fill the tax shelters', badgeName: 'Tax Unicorn',
        badgeLore: 'Filled the tax shelters: HSA, IRA, and 401(k) working at full strength, with moderate debt under control.',
    },
    {
        id: 'optimize', name: 'Optimize', tagline: 'Every last dollar', badgeName: 'Juggernaut',
        badgeLore: 'Squeezed every last dollar: future goals funded, education and mega backdoor weighed, final debts decided, taxable bridge built.',
    },
];

/** Tooltip copy for the final badge, which is not tied to a single phase. */
export const QUEST_COMPLETE_LORE = 'All 16 steps cleared and every dollar of the budget assigned a job. The rarest badge on the shelf.';

export const FLOW_STEPS: FlowStep[] = [
    {
        id: 'year-selection', label: 'Tax year', phase: 'foundation',
        whyNow: 'Every limit in this quest changes by tax year, so the year comes first.',
    },
    {
        id: 'income', label: 'Income', phase: 'foundation',
        whyNow: 'Your monthly take-home pay is the budget the whole quest allocates.',
    },
    {
        id: 'budget', label: 'Expenses', phase: 'foundation',
        whyNow: 'Income minus expenses is your free cash flow. Everything after this step spends it.',
    },
    {
        id: 'emergency-fund', label: 'Starter fund', phase: 'protect',
        whyNow: 'One month of cash keeps a surprise bill from becoming high-interest debt, which would undo every later step.',
    },
    {
        id: 'match-employer', label: 'Employer match', phase: 'protect',
        whyNow: 'A match is a 50-100% instant, guaranteed return. Nothing later in the quest can beat it.',
    },
    {
        id: 'debt-payoff', label: 'High-interest debt', phase: 'protect',
        whyNow: 'Paying off 20% APR debt is a guaranteed 20% return. Only the match outranks it.',
    },
    {
        id: 'emergency-fund-full', label: 'Full emergency fund', phase: 'protect',
        whyNow: 'With the fires out, 3-6 months of cash makes every investment after this safe to leave alone.',
    },
    {
        id: 'hsa', label: 'HSA', phase: 'grow',
        whyNow: 'The only account that is tax-free going in, growing, and coming out (for medical costs). Triple beats double.',
    },
    {
        id: 'ira', label: 'IRA', phase: 'grow',
        whyNow: 'Your best remaining tax shelter with full control over the investments inside it.',
    },
    {
        id: 'moderate-debt', label: 'Moderate debt', phase: 'grow',
        whyNow: 'Debt at 4-7% roughly ties expected market returns, so it slots between the shelters and pure investing.',
    },
    {
        id: 'max-401k', label: 'Max 401(k)', phase: 'grow',
        whyNow: 'Back to the employer plan to fill the rest of its tax-advantaged space.',
    },
    {
        id: 'goals', label: 'Future goals', phase: 'optimize',
        whyNow: 'Money you need within 5 years does not belong in the market. Fund near-term goals before long-term investing.',
    },
    {
        id: 'education', label: 'Education / 529', phase: 'optimize',
        whyNow: 'Tax-free growth for education, once your own retirement is on track. Airplane oxygen-mask rules.',
    },
    {
        id: 'mega-backdoor', label: 'Mega backdoor', phase: 'optimize',
        whyNow: 'If your plan allows it, this unlocks tens of thousands more in Roth space per year.',
    },
    {
        id: 'low-interest-debt', label: 'Low-interest debt', phase: 'optimize',
        whyNow: 'Below ~4%, investing usually wins the math. Paying it off buys peace, not returns. Your call.',
    },
    {
        id: 'taxable', label: 'Taxable account', phase: 'optimize',
        whyNow: 'No limits, no penalties, full flexibility. The bridge to early retirement takes every remaining dollar.',
    },
];

/** Ordered step ids, ending with the terminal 'completed' state. */
export const FLOW_ORDER: StepId[] = [...FLOW_STEPS.map((s) => s.id), 'completed'];

/** One badge icon per phase, shared by the Quest Log shelf and the milestone toast. */
export const PHASE_ICONS: Record<PhaseId, LucideIcon> = {
    foundation: MapIcon,
    protect: Shield,
    grow: Sparkles,
    optimize: Rocket,
};

/**
 * Steps whose allocations count as investing (the "wealth engine"). The savings
 * rate everywhere = investment allocations / income; debt payoff and emergency
 * savings are good moves but not investing.
 */
export const INVESTMENT_STEP_IDS: ReadonlySet<StepId> = new Set<StepId>([
    'match-employer', 'hsa', 'ira', 'max-401k', 'mega-backdoor', 'education', 'taxable',
]);

const stepIndexById = new Map<StepId, number>(FLOW_STEPS.map((s, i) => [s.id, i]));

export function getFlowStep(id: StepId): FlowStep | undefined {
    const idx = stepIndexById.get(id);
    return idx === undefined ? undefined : FLOW_STEPS[idx];
}

/** 0-based position in FLOW_STEPS; terminal states return FLOW_STEPS.length. */
export function getStepIndex(id: StepId): number {
    if (id === 'completed' || id === 'budget-exhausted') return FLOW_STEPS.length;
    return stepIndexById.get(id) ?? 0;
}

export function getPhase(id: PhaseId): FlowPhase {
    return PHASES.find((p) => p.id === id) ?? PHASES[0];
}

export function getPhaseSteps(id: PhaseId): FlowStep[] {
    return FLOW_STEPS.filter((s) => s.phase === id);
}

/**
 * The furthest position the player has cleared, from history plus the current step.
 * A terminal state counts only what was actually visited: finishing the quest clears
 * everything, but exhausting the budget at the HSA step clears only through the HSA.
 */
export function getMaxReachedIndex(currentStep: StepId, history: StepId[]): number {
    const realHistory = history.filter((h) => h !== 'completed' && h !== 'budget-exhausted');
    const historyMax = realHistory.length
        ? Math.max(...realHistory.map((h) => getStepIndex(h)))
        : -1;
    if (currentStep === 'completed') return FLOW_STEPS.length;
    if (currentStep === 'budget-exhausted') return historyMax + 1;
    return Math.max(getStepIndex(currentStep), historyMax + 1, 0);
}

/** Phases whose final step sits strictly behind the furthest cleared position. */
export function getEarnedPhases(currentStep: StepId, history: StepId[]): PhaseId[] {
    const reached = getMaxReachedIndex(currentStep, history);
    return PHASES
        .filter((phase) => {
            const steps = getPhaseSteps(phase.id);
            const lastIdx = getStepIndex(steps[steps.length - 1].id);
            return reached > lastIdx;
        })
        .map((p) => p.id);
}
