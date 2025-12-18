"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function LowInterestDebtStep() {
    const { nextStep, getRemainingBudget } = useFinancialStore();
    const [hasDebt, setHasDebt] = useState<boolean | null>(null);

    const handleAnswer = (ans: boolean) => {
        setHasDebt(ans);
        if (!ans) {
            nextStep();
        }
    };

    if (hasDebt === null) {
        return (
            <ConversationalCard
                title="The Last Debts 📉"
                description="Do you have any remaining low-interest debts? (e.g., &lt; 4%)"
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                        This might include a mortgage or a very cheap car loan.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleAnswer(true)}
                            className="p-6 bg-card border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-xl font-bold text-foreground"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => handleAnswer(false)}
                            className="p-6 bg-card border-2 border-border rounded-2xl hover:border-border transition-all text-xl font-bold text-foreground"
                        >
                            No, I am debt free
                        </button>
                    </div>
                </div>
            </ConversationalCard>
        );
    }

    return (
        <ConversationalCard
            title="Mathematical Peace"
            description="Mathematically, you shouldn't pay these off early (markets return > 4%)."
            mode="advice"
        >
            <div className="space-y-6">
                <div className="p-4 bg-secondary rounded-xl text-center">
                    <p className="text-foreground font-bold mb-2">Psychology vs Math</p>
                    <p className="text-sm text-muted-foreground">
                        If being 100% debt-free brings you peace, go for it.
                        Otherwise, keeping the cheap debt and investing the difference works better in the long run.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => nextStep()}
                        className="flex-1 p-4 bg-card border border-border rounded-2xl font-bold text-sm text-foreground hover:bg-secondary transition-colors"
                    >
                        Okay, I'll keep the debt
                    </button>
                    <button
                        onClick={() => {
                            const remaining = useFinancialStore.getState().getRemainingBudget();
                            if (remaining > 0) {
                                useFinancialStore.getState().setAllocation('low-interest-debt', remaining);
                            }
                            nextStep();
                        }}
                        className="flex-1 p-4 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                        I want to pay it off (${useFinancialStore.getState().getRemainingBudget().toLocaleString()}/mo)
                    </button>
                </div>
            </div>
        </ConversationalCard>
    );
}
