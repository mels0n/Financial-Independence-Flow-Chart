"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ASSUMPTIONS } from "@/shared/config/financial-constants";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { RecommendationBlock } from "@/shared/ui/RecommendationBlock/RecommendationBlock";
import { Currency } from "@/shared/ui/Currency/Currency";
import { ArrowRight, TrendingDown } from "lucide-react";
import { formatPercent } from "@/shared/lib/utils";
import { useState } from "react";

/** Standard amortized monthly payment for a balance at an annual rate over n months. */
function amortizedPayment(balance: number, annualRate: number, months: number): number {
    if (months <= 0) return balance;
    const r = annualRate / 12;
    if (r === 0) return Math.ceil(balance / months);
    return Math.ceil((balance * r) / (1 - Math.pow(1 + r, -months)));
}

export function ModerateDebtStep() {
    const { nextStep, getRemainingBudget, setAllocation } = useFinancialStore();
    const remaining = getRemainingBudget();

    const [hasDebt, setHasDebt] = useState<boolean | null>(null);
    const [debtAmount, setDebtAmount] = useState('');
    const [minPayment, setMinPayment] = useState('');
    const [payoffMonths, setPayoffMonths] = useState(12);

    const handleAnswer = (ans: boolean) => {
        setHasDebt(ans);
        if (!ans) {
            nextStep();
        }
    };

    const debtVal = parseFloat(debtAmount.replace(/,/g, "")) || 0;
    const minPay = parseFloat(minPayment.replace(/,/g, "")) || 0;
    const annualRate = ASSUMPTIONS.moderateDebtRate.value;
    const years = payoffMonths / 12;

    // Your expense budget already contains the minimum payment (that is how the
    // budget step defines expenses), so only the EXTRA gets allocated here.
    const requiredPayment = amortizedPayment(debtVal, annualRate, payoffMonths);
    const extraPayment = Math.max(0, requiredPayment - minPay);

    const minAlreadyCovers = debtVal > 0 && extraPayment === 0;
    const affordable = extraPayment <= remaining;

    const handleCommit = () => {
        if (debtVal > 0 && extraPayment > 0 && affordable) {
            setAllocation('moderate-debt', extraPayment);
            useFinancialStore.getState().addActionItem({
                id: 'pay-debt',
                stepId: 'moderate-debt',
                label: `Pay an extra $${extraPayment.toLocaleString()}/mo above the minimum to clear moderate debt in ${payoffMonths} months`
            });
        }
        nextStep();
    }

    if (hasDebt === null) {
        return (
            <ConversationalCard
                title="Moderate debt check"
                description="High-interest fires are out and the match is claimed. Before filling the rest of the tax shelters, deal with mid-rate debt."
                icon={TrendingDown}
            >
                <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-warning/30 bg-warning/10 text-sm text-foreground/90">
                        <strong>What counts:</strong> student loans, car loans, or personal loans between roughly 4% and 7%.
                        Your mortgage stays out of this for now.
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleAnswer(true)}
                            className="p-6 bg-card border-2 border-border rounded-2xl hover:border-warning hover:bg-warning/10 transition-all text-lg font-bold text-foreground"
                        >
                            Yes, I have some
                        </button>
                        <button
                            onClick={() => handleAnswer(false)}
                            className="p-6 bg-card border-2 border-border rounded-2xl hover:border-success hover:bg-success/10 transition-all text-lg font-bold text-foreground"
                        >
                            No, I&apos;m clean
                        </button>
                    </div>
                </div>
            </ConversationalCard>
        );
    }

    return (
        <ConversationalCard
            title="The attack plan"
            description="Moderate rates do not need scorched earth, but they should be gone before low-return investing."
            icon={TrendingDown}
            mode="advice"
        >
            <div className="space-y-5">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="mod-debt-amount" className="text-sm font-medium text-foreground">Total balance remaining</label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>$</span>
                                <input
                                    id="mod-debt-amount"
                                    type="text"
                                    inputMode="numeric"
                                    value={debtAmount}
                                    onChange={(e) => setDebtAmount(e.target.value)}
                                    className="w-full p-2.5 pl-7 bg-secondary rounded-lg font-mono tabular font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="15,000"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="mod-debt-min" className="text-sm font-medium text-foreground">Monthly minimum you already pay</label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>$</span>
                                <input
                                    id="mod-debt-min"
                                    type="text"
                                    inputMode="numeric"
                                    value={minPayment}
                                    onChange={(e) => setMinPayment(e.target.value)}
                                    className="w-full p-2.5 pl-7 bg-secondary rounded-lg font-mono tabular font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="250"
                                />
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">Already counted in your expenses.</p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="mod-debt-months" className="text-sm font-medium text-foreground">
                            Payoff timeline: <span className="font-mono tabular font-bold text-primary">{payoffMonths} months</span> ({years.toFixed(1)} years)
                        </label>
                        <input
                            id="mod-debt-months"
                            type="range"
                            min="6" max="60" step="6"
                            value={payoffMonths}
                            onChange={(e) => setPayoffMonths(Number(e.target.value))}
                            className="w-full mt-2 cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>6 mo</span>
                            <span>5 years</span>
                        </div>
                    </div>
                </div>

                {debtVal > 0 ? (
                    minAlreadyCovers ? (
                        <div className="p-4 rounded-xl border border-success/40 bg-success/10 text-sm text-foreground/90">
                            <strong className="text-success">Your minimum already wins:</strong> paying{" "}
                            <Currency value={minPay} per="mo" className="text-sm font-bold text-foreground" /> clears this balance
                            within {payoffMonths} months at the assumed {formatPercent(annualRate)} APR. Nothing extra to allocate.
                            <button
                                onClick={() => nextStep()}
                                className="mt-3 block w-full p-3 bg-success text-success-foreground rounded-xl font-bold transition-all hover:brightness-110"
                            >
                                Continue
                            </button>
                        </div>
                    ) : (
                        <RecommendationBlock
                            label="Extra payment"
                            amount={extraPayment}
                            benefit={<span>Debt-free in <strong className="text-foreground">{payoffMonths} months</strong>.</span>}
                            math={[
                                { label: "Balance", value: `$${debtVal.toLocaleString()}` },
                                { label: `Amortized at ${formatPercent(annualRate)} APR over ${payoffMonths} mo`, value: `$${requiredPayment.toLocaleString()}/mo` },
                                { label: "Minimum already in your expenses", value: `− $${minPay.toLocaleString()}` },
                                { label: "Extra to allocate", value: `$${extraPayment.toLocaleString()}/mo`, total: true },
                                { label: "Your free budget (the cap)", value: `$${remaining.toLocaleString()}` },
                            ]}
                            assumptions={`${ASSUMPTIONS.moderateDebtRate.detail} Your loan's actual rate will shift this slightly; the payoff order does not change.`}
                        >
                            {!affordable && (
                                <p className="text-sm font-semibold text-destructive">
                                    This exceeds your free budget of <Currency value={remaining} className="text-sm font-bold" />. Extend the timeline.
                                </p>
                            )}
                            <button
                                onClick={handleCommit}
                                disabled={!affordable || debtVal <= 0}
                                className="w-full p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50 font-bold flex items-center justify-center gap-2"
                            >
                                Commit to the plan <ArrowRight className="w-5 h-5" aria-hidden />
                            </button>
                            <button
                                onClick={() => nextStep()}
                                className="mx-auto text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground rounded"
                            >
                                Skip this step
                            </button>
                        </RecommendationBlock>
                    )
                ) : (
                    <p className="p-4 rounded-xl bg-secondary/60 border border-border text-sm text-muted-foreground">
                        Enter your balance above and the plan calculates itself.
                    </p>
                )}
            </div>
        </ConversationalCard>
    );
}
