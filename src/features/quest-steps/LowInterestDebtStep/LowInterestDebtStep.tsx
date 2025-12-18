"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function LowInterestDebtStep() {
    const { nextStep, getRemainingBudget, setAllocation } = useFinancialStore();
    const remaining = getRemainingBudget();

    // State
    const [hasDebt, setHasDebt] = useState<boolean | null>(null);
    const [debtAmount, setDebtAmount] = useState('');
    const [payoffMonths, setPayoffMonths] = useState(36); // Default 3 years

    const handleAnswer = (ans: boolean) => {
        setHasDebt(ans);
        if (!ans) {
            nextStep();
        }
    };

    // Logic
    const debtVal = parseFloat(debtAmount.replace(/,/g, "")) || 0;
    const interestRate = 0.035; // Approx 3.5%
    const years = payoffMonths / 12;
    // Simple Interest approx
    const totalToPay = debtVal * (1 + (interestRate * years));
    const monthlyPayment = Math.ceil(totalToPay / payoffMonths);

    const affordable = monthlyPayment <= remaining;

    const handleCommit = () => {
        if (debtVal > 0 && affordable) {
            setAllocation('low-interest-debt', monthlyPayment);
            useFinancialStore.getState().addActionItem({
                id: 'pay-low-debt',
                label: `Pay $${monthlyPayment.toLocaleString()}/mo to Clear Low Interest Debt in ${payoffMonths} months`
            });
        }
        nextStep();
    }

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
            description="Mathematically, investing usually beats paying this off. But peace of mind is priceless."
            mode="advice"
        >
            <div className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Total Balance?</label>
                        <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <input
                                type="text"
                                value={debtAmount}
                                onChange={(e) => setDebtAmount(e.target.value)}
                                className="w-full p-2 pl-7 bg-secondary rounded-lg font-bold"
                                placeholder="25,000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Desired Payoff Timeline: {payoffMonths} Months ({years.toFixed(1)} Years)</label>
                        <input
                            type="range"
                            min="12" max="360" step="12"
                            value={payoffMonths}
                            onChange={(e) => setPayoffMonths(Number(e.target.value))}
                            className="w-full mt-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>1 Year</span>
                            <span>30 Years</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-secondary rounded-xl text-center">
                    <p className="text-foreground font-bold mb-2">The Plan</p>

                    {debtVal > 0 ? (
                        <div className="space-y-2">
                            <p className="text-3xl font-bold text-primary">
                                ${monthlyPayment.toLocaleString()}<span className="text-sm text-muted-foreground">/mo</span>
                            </p>
                            {!affordable && (
                                <p className="text-xs text-red-500 font-bold">
                                    ⚠️ Exceeds budget of ${remaining.toLocaleString()}
                                </p>
                            )}
                        </div>
                    ) : <p className="text-sm text-muted-foreground">Enter balance to calculate.</p>}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => nextStep()}
                        className="flex-1 p-4 bg-card border border-border rounded-2xl font-bold text-sm text-foreground hover:bg-secondary transition-colors"
                    >
                        Keep the Debt (Invest Instead)
                    </button>
                    <button
                        onClick={handleCommit}
                        disabled={!affordable || debtVal <= 0}
                        className="flex-1 p-4 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                        Pay it Off
                    </button>
                </div>
            </div>
        </ConversationalCard>
    );
}
