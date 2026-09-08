"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ASSUMPTIONS } from "@/shared/config/financial-constants";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { RecommendationBlock } from "@/shared/ui/RecommendationBlock/RecommendationBlock";
import { Currency } from "@/shared/ui/Currency/Currency";
import { Scale } from "lucide-react";
import { formatPercent } from "@/shared/lib/utils";
import { useState } from "react";

/** Standard amortized monthly payment for a balance at an annual rate over n months. */
function amortizedPayment(balance: number, annualRate: number, months: number): number {
    if (months <= 0) return balance;
    const r = annualRate / 12;
    if (r === 0) return Math.ceil(balance / months);
    return Math.ceil((balance * r) / (1 - Math.pow(1 + r, -months)));
}

export function LowInterestDebtStep() {
    const { nextStep, getRemainingBudget, setAllocation } = useFinancialStore();
    const remaining = getRemainingBudget();

    const [hasDebt, setHasDebt] = useState<boolean | null>(null);
    const [debtAmount, setDebtAmount] = useState('');
    const [minPayment, setMinPayment] = useState('');
    const [payoffMonths, setPayoffMonths] = useState(36);

    const handleAnswer = (ans: boolean) => {
        setHasDebt(ans);
        if (!ans) {
            nextStep();
        }
    };

    const debtVal = parseFloat(debtAmount.replace(/,/g, "")) || 0;
    const minPay = parseFloat(minPayment.replace(/,/g, "")) || 0;
    const annualRate = ASSUMPTIONS.lowDebtRate.value;
    const years = payoffMonths / 12;

    // Expenses already include the minimum payment; only the extra is allocated.
    const requiredPayment = amortizedPayment(debtVal, annualRate, payoffMonths);
    const extraPayment = Math.max(0, requiredPayment - minPay);

    const minAlreadyCovers = debtVal > 0 && extraPayment === 0;
    const affordable = extraPayment <= remaining;

    const handleCommit = () => {
        if (debtVal > 0 && extraPayment > 0 && affordable) {
            setAllocation('low-interest-debt', extraPayment);
            useFinancialStore.getState().addActionItem({
                id: 'pay-low-debt',
                stepId: 'low-interest-debt',
                label: `Pay an extra $${extraPayment.toLocaleString()}/mo above the minimum to clear low-interest debt in ${payoffMonths} months`
            });
        }
        nextStep();
    }

    if (hasDebt === null) {
        return (
            <ConversationalCard
                title="The last debts"
                description="Anything left under roughly 4%? Usually a mortgage or a very cheap car loan."
                icon={Scale}
            >
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleAnswer(true)}
                        className="p-6 bg-card border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-lg font-bold text-foreground"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => handleAnswer(false)}
                        className="p-6 bg-card border-2 border-border rounded-2xl hover:border-success hover:bg-success/10 transition-all text-lg font-bold text-foreground"
                    >
                        No, I am debt free
                    </button>
                </div>
            </ConversationalCard>
        );
    }

    return (
        <ConversationalCard
            title="Math versus peace"
            description="Below 4%, investing usually wins the arithmetic. Paying it off buys sleep. Both are winning moves; you pick."
            icon={Scale}
            mode="advice"
        >
            <div className="space-y-5">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="low-debt-amount" className="text-sm font-medium text-foreground">Total balance</label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>$</span>
                                <input
                                    id="low-debt-amount"
                                    type="text"
                                    inputMode="numeric"
                                    value={debtAmount}
                                    onChange={(e) => setDebtAmount(e.target.value)}
                                    className="w-full p-2.5 pl-7 bg-secondary rounded-lg font-mono tabular font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="25,000"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="low-debt-min" className="text-sm font-medium text-foreground">Monthly minimum you already pay</label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>$</span>
                                <input
                                    id="low-debt-min"
                                    type="text"
                                    inputMode="numeric"
                                    value={minPayment}
                                    onChange={(e) => setMinPayment(e.target.value)}
                                    className="w-full p-2.5 pl-7 bg-secondary rounded-lg font-mono tabular font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="450"
                                />
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">Already counted in your expenses.</p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="low-debt-months" className="text-sm font-medium text-foreground">
                            Payoff timeline: <span className="font-mono tabular font-bold text-primary">{payoffMonths} months</span> ({years.toFixed(1)} years)
                        </label>
                        <input
                            id="low-debt-months"
                            type="range"
                            min="12" max="360" step="12"
                            value={payoffMonths}
                            onChange={(e) => setPayoffMonths(Number(e.target.value))}
                            className="w-full mt-2 cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>1 year</span>
                            <span>30 years</span>
                        </div>
                    </div>
                </div>

                {debtVal > 0 && (
                    minAlreadyCovers ? (
                        <div className="p-4 rounded-xl border border-success/40 bg-success/10 text-sm text-foreground/90">
                            <strong className="text-success">Your minimum already wins:</strong> paying{" "}
                            <Currency value={minPay} per="mo" className="text-sm font-bold text-foreground" /> clears this balance
                            within {payoffMonths} months at the assumed {formatPercent(annualRate)} APR. Nothing extra to allocate.
                        </div>
                    ) : (
                        <RecommendationBlock
                            label="If you pay it off early"
                            amount={extraPayment}
                            math={[
                                { label: "Balance", value: `$${debtVal.toLocaleString()}` },
                                { label: `Amortized at ${formatPercent(annualRate)} APR over ${payoffMonths} mo`, value: `$${requiredPayment.toLocaleString()}/mo` },
                                { label: "Minimum already in your expenses", value: `− $${minPay.toLocaleString()}` },
                                { label: "Extra to allocate", value: `$${extraPayment.toLocaleString()}/mo`, total: true },
                                { label: "Your free budget (the cap)", value: `$${remaining.toLocaleString()}` },
                            ]}
                            assumptions={`${ASSUMPTIONS.lowDebtRate.detail} Your loan's actual rate will shift this slightly; the choice below does not change.`}
                        >
                            {!affordable && (
                                <p className="text-sm font-semibold text-destructive">
                                    Exceeds your free budget of <Currency value={remaining} className="text-sm font-bold" />. Extend the timeline.
                                </p>
                            )}
                        </RecommendationBlock>
                    )
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => nextStep()}
                        className="flex-1 p-4 bg-card border-2 border-border rounded-2xl font-bold text-sm text-foreground hover:border-primary hover:bg-primary/5 transition-all"
                    >
                        Keep the debt, invest instead
                    </button>
                    <button
                        onClick={handleCommit}
                        disabled={!affordable || debtVal <= 0 || minAlreadyCovers}
                        className="flex-1 p-4 bg-primary text-primary-foreground rounded-2xl font-bold text-sm transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                    >
                        Pay it off early
                    </button>
                </div>
            </div>
        </ConversationalCard>
    );
}
