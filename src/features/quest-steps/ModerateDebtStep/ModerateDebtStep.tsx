"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { ArrowRight, CheckCircle2, TrendingDown } from "lucide-react";
import { useState } from "react";

export function ModerateDebtStep() {
    const { nextStep, getRemainingBudget, setAllocation } = useFinancialStore();
    const remaining = getRemainingBudget();

    // State
    const [hasDebt, setHasDebt] = useState<boolean | null>(null);
    const [debtAmount, setDebtAmount] = useState('');
    const [payoffMonths, setPayoffMonths] = useState(12);

    const handleAnswer = (ans: boolean) => {
        setHasDebt(ans);
        if (!ans) {
            nextStep();
        }
    };

    // Logic
    const debtVal = parseFloat(debtAmount.replace(/,/g, "")) || 0;
    // Simple interest approximation: (Principal + (Principal * 5% * Years)) / Months
    // A bit rough but fine for this level. 5% is the threshold.
    const interestRate = 0.05;
    const years = payoffMonths / 12;
    const totalInterest = debtVal * interestRate * years;
    const totalToPay = debtVal + totalInterest;
    const monthlyPayment = Math.ceil(totalToPay / payoffMonths);

    const affordable = monthlyPayment <= remaining;

    const handleCommit = () => {
        if (debtVal > 0 && affordable) {
            setAllocation('moderate-debt', monthlyPayment);
            useFinancialStore.getState().addActionItem({
                id: 'pay-debt',
                label: `Pay $${monthlyPayment.toLocaleString()}/mo to Clear Moderate Debt in ${payoffMonths} months`
            });
        }
        nextStep();
    }

    if (hasDebt === null) {
        return (
            <ConversationalCard
                title="Moderate Debt Check 📉"
                description="You've handled the high-interest stuff and got your match. Before we fill up the rest of your tax-advantaged accounts, let's look at moderate-interest debt (4-5%)."
            >
                <div className="space-y-4">
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-900 dark:text-amber-100 mb-4">
                        <strong>What counts?</strong> Student loans, car loans, or personal loans with interest rates &gt; 5%.
                        <br />
                        <em>Note: Exclude your mortgage for now.</em>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleAnswer(true)}
                            className="p-6 bg-card border-2 border-border rounded-2xl hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all text-xl font-bold text-foreground"
                        >
                            Yes, I have some
                        </button>
                        <button
                            onClick={() => handleAnswer(false)}
                            className="p-6 bg-card border-2 border-border rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all text-xl font-bold text-foreground"
                        >
                            No, I'm clean
                        </button>
                    </div>
                </div>
            </ConversationalCard>
        );
    }

    // If they have debt
    return (
        <ConversationalCard
            title="The Attack Plan"
            description="Since these rates are moderate, we don't need to go 'scorched earth', but we should clear them before low-return investments."
            mode="advice"
        >
            <div className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Total Moderate Debt Remaining?</label>
                        <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <input
                                type="text"
                                value={debtAmount}
                                onChange={(e) => setDebtAmount(e.target.value)}
                                className="w-full p-2 pl-7 bg-secondary rounded-lg font-bold"
                                placeholder="15,000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Desired Payoff Timeline: {payoffMonths} Months ({years.toFixed(1)} Years)</label>
                        <input
                            type="range"
                            min="6" max="60" step="6"
                            value={payoffMonths}
                            onChange={(e) => setPayoffMonths(Number(e.target.value))}
                            className="w-full mt-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>6 Mo</span>
                            <span>5 Years</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-secondary rounded-xl">
                    <h4 className="font-bold flex items-center gap-2 mb-2">
                        <TrendingDown className="w-5 h-5 text-amber-600" />
                        Strategy
                    </h4>
                    {debtVal > 0 ? (
                        <div className="space-y-1">
                            <p className="text-sm text-foreground">
                                To be debt-free in <strong>{payoffMonths} months</strong>, you need to pay:
                            </p>
                            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                ${monthlyPayment.toLocaleString()}<span className="text-sm text-muted-foreground">/mo</span>
                            </p>
                            {!affordable && (
                                <p className="text-xs text-red-500 font-bold mt-2">
                                    ⚠️ This exceeds your remaining budget of ${remaining.toLocaleString()}! Increase the timeline.
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Enter your debt details above to calculate a plan.</p>
                    )}
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <span className="text-sm font-medium">Remaining Monthly Budget</span>
                    <span className="font-bold font-mono text-emerald-500">${remaining.toLocaleString()}</span>
                </div>

                <button
                    onClick={handleCommit}
                    disabled={!affordable || debtVal <= 0}
                    className="w-full p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl hover:opacity-90 disabled:opacity-50 transition-all font-medium flex items-center justify-center gap-2"
                >
                    I'll focus on this. Next <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </ConversationalCard>
    );
}
