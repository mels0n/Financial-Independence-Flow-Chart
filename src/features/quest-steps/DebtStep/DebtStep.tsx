"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { ArrowRight, TrendingDown, Flame, Calculator } from "lucide-react";
import { useState } from "react";

export function DebtStep() {
    const { setProfileBase, nextStep, getRemainingBudget, setAllocation } = useFinancialStore();
    const [stepPhase, setStepPhase] = useState<"ask" | "calculator" | "advice">("ask");
    const [debtAmount, setDebtAmount] = useState("");

    const remainingBudget = getRemainingBudget();

    const handleAnswer = (hasDebt: boolean) => {
        setProfileBase({ hasHighInterestDebt: hasDebt });
        if (hasDebt) {
            setStepPhase("calculator");
        } else {
            nextStep();
        }
    };

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(debtAmount.replace(/,/g, ""));
        if (!isNaN(val) && val > 0) {
            setStepPhase("advice");
        }
    };

    const handleAllocate = () => {
        // Allocate ALL remaining budget to debt
        setAllocation('debt-payoff', remainingBudget);
        nextStep();
    }

    if (stepPhase === "ask") {
        return (
            <ConversationalCard
                title="The Toxic Stuff 🧪"
                description="Do you have any debts with an interest rate higher than 7%? (Credit cards, some auto loans, etc.)"
            >
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleAnswer(true)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-red-400 hover:bg-red-500/10 transition-all text-xl font-bold text-foreground">Yes</button>
                    <button onClick={() => handleAnswer(false)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-emerald-500 hover:bg-emerald-500/10 transition-all text-xl font-bold text-foreground">No, I'm good</button>
                </div>
            </ConversationalCard>
        );
    }

    if (stepPhase === "calculator") {
        return (
            <ConversationalCard
                title="Knowledge is Power"
                description="What is the total balance of this high-interest debt?"
            >
                <form onSubmit={handleCalculate} className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground font-medium">$</span>
                        <input
                            type="number"
                            value={debtAmount}
                            onChange={(e) => setDebtAmount(e.target.value)}
                            className="w-full pl-10 pr-4 py-4 text-2xl font-bold text-foreground bg-secondary rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="15,000"
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!debtAmount}
                        className="p-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        <ArrowRight className="w-8 h-8" />
                    </button>
                </form>
            </ConversationalCard>
        );
    }

    const totalDebt = parseFloat(debtAmount.replace(/,/g, ""));
    const monthsToKill = remainingBudget > 0 ? Math.ceil(totalDebt / remainingBudget) : 999;

    return (
        <ConversationalCard
            title="Put out the fire. 🔥"
            description="Mathematically, paying off 20% interest debt is the same as finding an investment that guarantees you a 20% return. It doesn't exist."
            mode="advice"
        >
            <div className="space-y-6">
                <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200 rounded-xl border border-red-100 dark:border-red-900">
                    <div className="flex gap-3 mb-2">
                        <Calculator className="w-6 h-6 shrink-0" />
                        <span className="font-bold">The Kill Plan</span>
                    </div>
                    <p className="text-lg">
                        You have <strong>${remainingBudget.toLocaleString()}/mo</strong> extra cash.
                        <br />
                        If you throw all of it at this debt, it will be gone in <strong>{monthsToKill} months</strong>.
                    </p>
                </div>

                <div className="p-4 bg-secondary rounded-xl text-sm text-foreground">
                    <p>
                        <strong>Your Mission:</strong> Pour every single extra dollar into destroying this debt.
                        Do not invest (besides the match) until this is gone.
                    </p>
                </div>

                <button
                    onClick={() => {
                        useFinancialStore.getState().addActionItem({
                            id: 'debt-avalanche',
                            label: `Execute Debt Avalanche: Pay $${remainingBudget.toLocaleString()}/mo to highest interest loan`
                        });
                        handleAllocate();
                    }}
                    className="w-full p-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all font-medium flex items-center justify-center gap-2"
                >
                    Allocate ${remainingBudget.toLocaleString()}/mo to Debt <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </ConversationalCard>
    );
}
