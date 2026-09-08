"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { RecommendationBlock } from "@/shared/ui/RecommendationBlock/RecommendationBlock";
import { Currency } from "@/shared/ui/Currency/Currency";
import { ArrowRight, Flame } from "lucide-react";
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
        setAllocation('debt-payoff', remainingBudget);
        nextStep();
    }

    if (stepPhase === "ask") {
        return (
            <ConversationalCard
                title="The toxic stuff"
                description="Do you carry a balance on anything with an interest rate above 7%? Credit cards, payday loans, some auto loans."
                icon={Flame}
            >
                <div className="mb-4 rounded-xl border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
                    <strong className="text-foreground">What counts as debt here:</strong> only a balance that rolls
                    over month to month and accrues interest. A credit card you pay in full every month is not
                    debt; that spending already lives in your monthly expenses.
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleAnswer(true)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-destructive hover:bg-destructive/10 transition-all text-lg font-bold text-foreground">Yes</button>
                    <button onClick={() => handleAnswer(false)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-success hover:bg-success/10 transition-all text-lg font-bold text-foreground">No, I&apos;m good</button>
                </div>
            </ConversationalCard>
        );
    }

    if (stepPhase === "calculator") {
        return (
            <ConversationalCard
                title="Know your enemy"
                description="What is the total carried balance of this high-interest debt? (Only what rolls over and accrues interest, not this month's ordinary card spending.)"
                icon={Flame}
            >
                <form onSubmit={handleCalculate} className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground font-medium" aria-hidden>$</span>
                        <input
                            type="number"
                            value={debtAmount}
                            onChange={(e) => setDebtAmount(e.target.value)}
                            aria-label="Total high-interest debt balance in dollars"
                            className="w-full pl-10 pr-4 py-4 text-2xl font-mono tabular font-bold text-foreground bg-secondary rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            placeholder="15,000"
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!(parseFloat(debtAmount.replace(/,/g, "")) > 0)}
                        aria-label="Continue"
                        className="p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                    >
                        <ArrowRight className="w-7 h-7" aria-hidden />
                    </button>
                </form>
            </ConversationalCard>
        );
    }

    const totalDebt = parseFloat(debtAmount.replace(/,/g, ""));
    const monthsToKill = remainingBudget > 0 ? Math.ceil(totalDebt / remainingBudget) : 0;

    return (
        <ConversationalCard
            title="Put out the fire"
            description="Paying off 20% APR debt equals finding an investment with a guaranteed 20% return. No such investment exists."
            icon={Flame}
            mode="advice"
        >
            <div className="space-y-5">
                {remainingBudget > 0 ? (
                    <RecommendationBlock
                        label="The kill plan"
                        amount={remainingBudget}
                        benefit={
                            monthsToKill > 0
                                ? <span>Debt gone in <strong className="text-foreground">{monthsToKill} {monthsToKill === 1 ? "month" : "months"}</strong>.</span>
                                : undefined
                        }
                        math={[
                            { label: "High-interest balance", value: `$${totalDebt.toLocaleString()}` },
                            { label: "Every free dollar, every month", value: `$${remainingBudget.toLocaleString()}` },
                            { label: "Months to zero", value: `${monthsToKill}`, total: true },
                        ]}
                        assumptions="The avalanche method: highest interest rate first, minimums on everything else. Interest accrual is ignored here, so the real payoff is slightly longer; the order still holds."
                    >
                        <button
                            onClick={() => {
                                useFinancialStore.getState().addActionItem({
                                    id: 'debt-avalanche',
                                    stepId: 'debt-payoff',
                                    label: `Execute Debt Avalanche: Pay $${remainingBudget.toLocaleString()}/mo to highest interest loan`
                                });
                                handleAllocate();
                            }}
                            className="w-full p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 active:scale-[0.99] font-bold flex items-center justify-center gap-2"
                        >
                            Allocate <Currency value={remainingBudget} per="mo" className="font-bold" perClassName="text-primary-foreground/70" /> to debt
                            <ArrowRight className="w-5 h-5" aria-hidden />
                        </button>
                    </RecommendationBlock>
                ) : (
                    <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-sm text-foreground/90">
                        Your budget has nothing free to throw at this debt yet. Pay the minimums, revisit
                        expenses, and come back.
                        <button onClick={() => nextStep()} className="mt-3 block w-full p-3 bg-secondary text-secondary-foreground rounded-xl font-bold hover:bg-secondary/80 transition-colors">
                            Continue
                        </button>
                    </div>
                )}

                <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">The mission:</strong> every extra dollar destroys this debt.
                    No investing (beyond the match) until it is gone.
                </p>
            </div>
        </ConversationalCard>
    );
}
