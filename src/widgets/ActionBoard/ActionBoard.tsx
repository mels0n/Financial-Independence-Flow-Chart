"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { useShallow } from "zustand/react/shallow";
import { getFlowStep } from "@/shared/config/flow";
import { cn } from "@/shared/lib/utils";
import { Check, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { Fragment } from "react";

interface ActionBoardProps {
    className?: string;
}

/** Currency figures inside a label render mono/tabular like everywhere else. */
function renderLabel(label: string) {
    const parts = label.split(/(\$[\d,]+(?:\/mo)?)/g);
    return parts.map((part, i) =>
        /^\$[\d,]+(?:\/mo)?$/.test(part)
            ? <span key={i} className="font-mono tabular">{part}</span>
            : <Fragment key={i}>{part}</Fragment>
    );
}

export function ActionBoard({ className }: ActionBoardProps) {
    const { actionItems, toggleActionItem } = useFinancialStore(
        useShallow((s) => ({ actionItems: s.actionItems, toggleActionItem: s.toggleActionItem }))
    );

    if (actionItems.length === 0) {
        return (
            <div className={cn("hidden xl:flex flex-col w-80 h-screen sticky top-0 bg-background border-l border-border p-6", className)}>
                <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-primary" aria-hidden />
                    Action Board
                </h3>
                <div className="mt-6 rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground leading-relaxed">
                    Quest steps mint real-world actions here: accounts to open, payroll
                    percentages to change, transfers to schedule. Check them off as you
                    execute the plan.
                </div>
            </div>
        );
    }

    const done = actionItems.filter((i) => i.completed).length;
    const allDone = done === actionItems.length;

    return (
        <div className={cn("hidden xl:flex flex-col w-80 h-screen sticky top-0 bg-background border-l border-border p-6 overflow-y-auto", className)}>
            <div className="flex items-baseline justify-between">
                <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-primary" aria-hidden />
                    Action Board
                </h3>
                <span className="font-mono tabular text-xs text-muted-foreground">
                    {done}/{actionItems.length}
                </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
                The quest plans it. These make it real.
            </p>

            <div
                className="mt-3 mb-5 h-1.5 w-full overflow-hidden rounded-full bg-secondary"
                role="progressbar"
                aria-valuenow={done}
                aria-valuemin={0}
                aria-valuemax={actionItems.length}
                aria-label={`${done} of ${actionItems.length} actions done`}
            >
                <div
                    className="h-full rounded-full bg-success transition-all duration-500 ease-out"
                    style={{ width: `${(done / actionItems.length) * 100}%` }}
                />
            </div>

            <ul className="space-y-2.5">
                {actionItems.map((item) => {
                    const origin = item.stepId ? getFlowStep(item.stepId)?.label : undefined;
                    return (
                        <li key={item.id}>
                            <button
                                onClick={() => toggleActionItem(item.id)}
                                aria-pressed={item.completed}
                                className={cn(
                                    "group w-full flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all",
                                    item.completed
                                        ? "border-transparent bg-secondary/50"
                                        : "border-border bg-card hover:border-primary/50 hover:shadow-[0_8px_24px_-12px_hsl(var(--primary)/0.35)]"
                                )}
                            >
                                <span className={cn(
                                    "mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border transition-colors",
                                    item.completed
                                        ? "border-success bg-success text-success-foreground"
                                        : "border-muted-foreground/60 group-hover:border-primary"
                                )}>
                                    {item.completed && (
                                        <motion.span
                                            initial={{ scale: 0.4, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 24 }}
                                        >
                                            <Check className="h-3 w-3" strokeWidth={3.5} aria-hidden />
                                        </motion.span>
                                    )}
                                </span>
                                <span className="min-w-0">
                                    <span className={cn(
                                        "block text-[13px] font-semibold leading-snug",
                                        item.completed ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground"
                                    )}>
                                        {renderLabel(item.label)}
                                    </span>
                                    {origin && (
                                        <span className="mt-1 block font-mono text-[10px] text-muted-foreground">
                                            from: {origin}
                                        </span>
                                    )}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>

            {allDone && (
                <div className="mt-6 rounded-xl border border-success/40 bg-success/10 p-4 text-center text-sm font-semibold text-success animate-in fade-in duration-500">
                    Every action executed. Your plan is live.
                </div>
            )}
        </div>
    );
}
