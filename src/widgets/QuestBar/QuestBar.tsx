"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { cn } from "@/shared/lib/utils";
import { useState, useEffect } from "react";
import { CheckCircle2, Wallet, Trophy, ClipboardList, CheckSquare, Square } from "lucide-react";

export function QuestBar() {
    const { profile, getRemainingBudget, currentStep, actionItems, toggleActionItem } = useFinancialStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="hidden lg:flex flex-col w-80 h-screen sticky top-0 bg-background border-r border-border p-6" />; // Skeleton-ish placeholder keeping layout stable

    const income = profile.monthlyIncome;
    const remaining = getRemainingBudget();
    // If income is 0, avoid division by zero
    const healthPercent = income > 0 ? (remaining / income) * 100 : 100;

    // Simple logic to determine "Completed" steps for the checklist
    // In a real app we might track this more explicitly
    const steps = [
        { id: 'income', label: 'Income Defined' },
        { id: 'budget', label: 'Expenses Tracked' },
        { id: 'emergency-fund', label: 'Safety Net' },
        { id: 'match-employer', label: 'Employer Match' },
        { id: 'debt-payoff', label: 'Toxic Debt' },
        { id: 'emergency-fund-full', label: 'Full Emergency Fund' },
        { id: 'hsa', label: 'HSA' },
        { id: 'ira', label: 'IRA' },
        { id: 'moderate-debt', label: 'Moderate Debt' },
        { id: 'max-401k', label: 'Max 401k' },
        { id: 'goals', label: 'Future Goals' },
        { id: 'education', label: 'Education / 529' },
        { id: 'mega-backdoor', label: 'Mega Backdoor' },
        { id: 'low-interest-debt', label: 'Low Interest Debt' },
        { id: 'taxable', label: 'Taxable Account' },
    ];

    // Find index of current step to check off previous ones
    const flowOrder = [
        'year-selection', 'income', 'budget', 'emergency-fund',
        'match-employer', 'debt-payoff', 'emergency-fund-full', 'hsa', 'ira',
        'moderate-debt', 'max-401k', 'goals',
        'education', 'mega-backdoor', 'low-interest-debt', 'taxable',
        'completed'
    ];

    // Handle special states that define "how far" we are
    let currentIndex = flowOrder.indexOf(currentStep);

    if (currentStep === 'budget-exhausted') {
        // If budget is exhausted, we are effectively "done" with as much as we could do.
        // We should probably mark everything as "processed" or just show the ones we passed?
        // Better: calculate it based on what is in the history?
        // Simple fix: If budget exhausted, assume we are at the end for visual purposes, 
        // OR just look at the last "real" step in history?
        // Let's treat it as 'completed' for the sake of the bar, or maybe match the last step.
        // ACTUALLY: The user wants to see what they finished.
        currentIndex = flowOrder.length; // Show all as visited/checked? 
        // Or maybe we should find the furthest step they reached?
        // valid steps in history?
    } else if (currentIndex === -1) {
        // Should not happen, but safe fallback
        currentIndex = 0;
    }

    return (
        <div className="hidden lg:flex flex-col w-80 h-screen sticky top-0 bg-background border-r border-border p-6 overflow-y-auto">
            <div className="mb-8">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    Quest Log
                </h2>

                {/* Health Bar / Mana Bar */}
                <div className="p-4 bg-card rounded-2xl shadow-sm border border-border mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                            <Wallet className="w-4 h-4" /> Remaining Budget
                        </span>
                        <span className={cn(
                            "font-bold font-mono",
                            remaining < 0 ? "text-destructive" : "text-emerald-500"
                        )}>
                            ${remaining.toLocaleString()}
                        </span>
                    </div>
                    <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full transition-all duration-500",
                                remaining < 0 ? "bg-destructive w-full" : "bg-emerald-500"
                            )}
                            style={{ width: remaining < 0 ? '100%' : `${healthPercent}%` }}
                        />
                    </div>
                    <p className="text-xs text-center mt-2 text-muted-foreground">
                        {healthPercent.toFixed(0)}% of income unallocated
                    </p>
                </div>

                {/* Steps List */}
                <div className="space-y-3">
                    {steps.map((step) => {
                        // Approximate index logic
                        const stepIdx = flowOrder.indexOf(step.id);
                        const isCompleted = stepIdx < currentIndex;
                        const isActive = step.id === currentStep;

                        return (
                            <div
                                key={step.id}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl transition-all",
                                    isActive ? "bg-primary/10 border border-primary/20" : "opacity-90",
                                    isCompleted ? "opacity-60" : ""
                                )}
                            >
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2",
                                    isCompleted ? "bg-emerald-500 border-emerald-500 text-primary-foreground"
                                        : isActive ? "border-primary text-primary"
                                            : "border-border text-transparent"
                                )}>
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <span className={cn(
                                    "text-sm font-medium",
                                    isCompleted ? "line-through text-muted-foreground"
                                        : isActive ? "text-primary font-bold"
                                            : "text-foreground"
                                )}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>


        </div>
    );
}
