"use client";

import { useId } from "react";
import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { useShallow } from "zustand/react/shallow";
import {
    PHASES,
    PHASE_ICONS,
    QUEST_COMPLETE_LORE,
    getEarnedPhases,
    getMaxReachedIndex,
    getPhaseSteps,
    getStepIndex,
} from "@/shared/config/flow";
import { cn } from "@/shared/lib/utils";
import { Currency } from "@/shared/ui/Currency/Currency";
import { useProposalStore } from "@/shared/model/proposalStore";
import {
    Check,
    Trophy,
    BookOpen,
    ScrollText,
    Swords,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface QuestBarProps {
    className?: string;
}

export function QuestBar({ className }: QuestBarProps) {
    const { profile, currentStep, history, allocations, selectedYear } = useFinancialStore(
        useShallow((s) => ({
            profile: s.profile,
            currentStep: s.currentStep,
            history: s.history,
            allocations: s.allocations,
            selectedYear: s.selectedYear,
        }))
    );
    const proposedAmount = useProposalStore((s) => s.proposedAmount);

    const income = profile.monthlyIncome;
    const expenses = profile.monthlyExpenses;
    const committed = Object.values(allocations).reduce((acc, v) => acc + v, 0);
    const remaining = income - expenses - committed;
    // The decision on screen right now: striped on the bar, capped by what is free.
    const pending = Math.min(Math.max(0, proposedAmount ?? 0), Math.max(0, remaining));
    const freeAfterPending = Math.max(0, remaining) - pending;

    const filingLabel = income > 0
        ? (profile.filingStatus === "married_joint" ? "Married" : "Single")
        : null;

    const reachedIndex = getMaxReachedIndex(currentStep, history);
    const earnedPhases = getEarnedPhases(currentStep, history);
    const questDone = currentStep === "completed";

    const pct = (v: number) => (income > 0 ? Math.max(0, (v / income) * 100) : 0);

    return (
        <div className={cn("hidden lg:flex flex-col w-80 h-screen sticky top-0 bg-background border-r border-border overflow-y-auto overflow-x-hidden", className)}>
            <div className="p-6 pb-4">
                <div className="flex items-baseline justify-between mb-5">
                    <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                        <Swords className="w-5 h-5 text-primary" aria-hidden />
                        Quest Log
                    </h2>
                    <span className="font-mono text-[11px] text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
                        {selectedYear}{filingLabel ? ` · ${filingLabel}` : ""}
                    </span>
                </div>

                {/* Stacked budget bar: the whole paycheck, accounted for */}
                <div className="rounded-2xl border border-border bg-card p-4 mb-6">
                    <div className="flex items-baseline justify-between mb-2.5">
                        <span className="text-xs font-semibold text-muted-foreground">Free to allocate</span>
                        <Currency
                            value={remaining}
                            per="mo"
                            className={cn("text-xl font-semibold", remaining < 0 ? "text-destructive" : "text-success")}
                        />
                    </div>

                    {income > 0 ? (
                        <>
                            <div
                                className="flex h-3.5 w-full overflow-hidden rounded-full border border-border"
                                role="img"
                                aria-label={`Budget: expenses $${expenses.toLocaleString()}, committed $${committed.toLocaleString()}${pending > 0 ? `, this step $${pending.toLocaleString()}` : ""}, free $${freeAfterPending.toLocaleString()} of $${income.toLocaleString()} income`}
                            >
                                <div className="h-full bg-muted-foreground/30" style={{ width: `${pct(expenses)}%` }} />
                                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${pct(committed)}%` }} />
                                <div className="h-full stripe-pending transition-all duration-500" style={{ width: `${pct(pending)}%` }} />
                                <div className="h-full bg-success/25 transition-all duration-500" style={{ width: `${pct(freeAfterPending)}%` }} />
                            </div>
                            <dl className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-1 text-[11px]">
                                <LegendRow swatch="bg-muted-foreground/30" label="Expenses" value={expenses} />
                                <LegendRow swatch="bg-primary" label="Committed" value={committed} />
                                {pending > 0 && <LegendRow swatch="stripe-pending" label="This step" value={pending} />}
                                <LegendRow swatch="bg-success/40" label="Free" value={freeAfterPending} />
                            </dl>
                        </>
                    ) : (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Set your income and the whole paycheck shows up here, one segment per move.
                        </p>
                    )}
                </div>

                {/* Phase rail with running ledger */}
                <nav aria-label="Quest progress" className="space-y-5">
                    {PHASES.map((phase) => {
                        const steps = getPhaseSteps(phase.id);
                        const firstIdx = getStepIndex(steps[0].id);
                        const lastIdx = getStepIndex(steps[steps.length - 1].id);
                        const phaseEarned = earnedPhases.includes(phase.id);
                        const phaseCurrent = !phaseEarned && reachedIndex >= firstIdx && reachedIndex <= lastIdx + 1 && !questDone;
                        const phaseFuture = !phaseEarned && !phaseCurrent;
                        const clearedInPhase = steps.filter((s) => getStepIndex(s.id) < reachedIndex).length;
                        const phaseTotal = steps.reduce((acc, s) => acc + (allocations[s.id] ?? 0), 0);

                        return (
                            <div key={phase.id}>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className={cn(
                                        "font-mono text-[10px] font-semibold uppercase tracking-[0.16em]",
                                        phaseEarned ? "text-success" : phaseCurrent ? "text-primary" : "text-muted-foreground"
                                    )}>
                                        {phase.name}
                                    </span>
                                    <span className="ml-auto font-mono text-[10px] text-muted-foreground tabular">
                                        {phaseEarned ? "cleared" : `${clearedInPhase}/${steps.length}`}
                                    </span>
                                </div>

                                <div className={cn(
                                    "ml-[5px] border-l-[1px] pl-3.5 space-y-0.5",
                                    phaseCurrent ? "border-primary/40" : "border-border"
                                )}>
                                    {phaseEarned || (phaseFuture && !questDone) ? (
                                        <div className="flex items-center justify-between py-1 text-xs text-muted-foreground">
                                            <span>{phaseEarned ? `${steps.length} steps cleared` : phase.tagline}</span>
                                            {phaseEarned && phaseTotal > 0 && (
                                                <Currency value={phaseTotal} per="mo" className="text-xs text-success" />
                                            )}
                                        </div>
                                    ) : (
                                        steps.map((step) => {
                                            const idx = getStepIndex(step.id);
                                            const done = idx < reachedIndex;
                                            const active = step.id === currentStep;
                                            const amount = allocations[step.id];

                                            return (
                                                <div
                                                    key={step.id}
                                                    aria-current={active ? "step" : undefined}
                                                    className={cn(
                                                        "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px]",
                                                        active && "bg-primary/10 border border-primary/30 font-semibold text-primary",
                                                        done && "text-muted-foreground",
                                                        !done && !active && "text-foreground/80"
                                                    )}
                                                >
                                                    <span className={cn(
                                                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                                                        done ? "border-success bg-success text-success-foreground"
                                                            : active ? "border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]"
                                                                : "border-border"
                                                    )}>
                                                        {done && <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden />}
                                                    </span>
                                                    <span className="truncate">{step.label}</span>
                                                    {amount !== undefined && amount > 0 && (
                                                        <Currency
                                                            value={amount}
                                                            per="mo"
                                                            className={cn("ml-auto text-[11px]", done ? "text-success" : "text-primary")}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* Badge shelf: gold appears here and nowhere else.
                    position:relative so badge tooltips anchor to the shelf's full
                    width instead of poking past the rail edge. */}
                <div className="relative mt-7 border-t border-border pt-5">
                    <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-3">
                        Badges
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                        {PHASES.map((phase) => {
                            const earned = earnedPhases.includes(phase.id);
                            return (
                                <li key={phase.id}>
                                    <BadgeChip
                                        earned={earned}
                                        name={phase.badgeName}
                                        icon={PHASE_ICONS[phase.id]}
                                        lore={phase.badgeLore}
                                        howToEarn={`Clear the ${phase.name} phase (${phase.tagline.toLowerCase()}).`}
                                    />
                                </li>
                            );
                        })}
                        <li>
                            <BadgeChip
                                earned={questDone}
                                name="Quest Complete"
                                icon={Trophy}
                                lore={QUEST_COMPLETE_LORE}
                                howToEarn="Finish all 16 steps of the quest."
                            />
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-auto border-t border-border p-4">
                <a href="/sources" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">
                    <ScrollText className="h-4 w-4" aria-hidden />
                    Sources and methodology
                </a>
                <a href="/docs" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">
                    <BookOpen className="h-4 w-4" aria-hidden />
                    Documentation
                </a>
            </div>
        </div>
    );
}

interface BadgeChipProps {
    earned: boolean;
    name: string;
    icon: LucideIcon;
    /** What the badge means once earned */
    lore: string;
    /** How a locked badge is earned */
    howToEarn: string;
}

/**
 * A badge with its story one hover away. Works for keyboard focus and a tap on
 * touch screens too: the chip is focusable and the tooltip shows on focus.
 */
function BadgeChip({ earned, name, icon: Icon, lore, howToEarn }: BadgeChipProps) {
    const tooltipId = useId();
    return (
        // No `relative` here: the tooltip anchors to the shelf container so it
        // spans the rail instead of overflowing it (which grew a scrollbar).
        <span className="group inline-block">
            <span
                tabIndex={0}
                aria-describedby={tooltipId}
                className={cn(
                    "inline-flex cursor-help items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                    earned
                        ? "border border-reward/50 bg-reward/15 text-reward"
                        : "border border-dashed border-border text-muted-foreground/70"
                )}
            >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {name}
            </span>
            <span
                id={tooltipId}
                role="tooltip"
                className="pointer-events-none invisible absolute inset-x-0 bottom-full z-30 mb-2 rounded-xl border border-border bg-popover p-3 text-left opacity-0 shadow-lg shadow-background/60 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
            >
                <span className={cn(
                    "mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.14em]",
                    earned ? "text-reward" : "text-muted-foreground"
                )}>
                    {earned ? "Badge earned" : "Badge locked"}
                </span>
                <span className="block text-xs leading-relaxed text-popover-foreground">
                    {earned ? lore : howToEarn}
                </span>
                {!earned && (
                    <span className="mt-1.5 block text-[11px] leading-relaxed text-muted-foreground">
                        {lore}
                    </span>
                )}
            </span>
        </span>
    );
}

function LegendRow({ swatch, label, value }: { swatch: string; label: string; value: number }) {
    return (
        <>
            <dt className="flex items-center gap-1.5 text-muted-foreground">
                <span className={cn("h-2 w-2 rounded-[3px]", swatch)} aria-hidden />
                {label}
            </dt>
            <dd className="m-0" />
            <dd className="m-0 text-right">
                <Currency value={value} className="text-[11px] text-foreground" />
            </dd>
        </>
    );
}
