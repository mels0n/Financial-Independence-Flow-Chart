"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { useState } from "react";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { ArrowRight, BarChart3, Building } from "lucide-react";

export function Max401kStep() {
    const { nextStep, selectedYear, getRemainingBudget, profile, setAllocation } = useFinancialStore();
    const remainingBudget = getRemainingBudget();

    // State
    const [alreadyContributed, setAlreadyContributed] = useState(0);
    const [spouseHasPlan, setSpouseHasPlan] = useState(true); // Default to true if married

    const baseLimit = selectedYear === '2026' ? 23500 : 23000;

    // Calculate Total Limit
    let limit = baseLimit;
    let limitDescription = "Individual Limit";

    if (profile.filingStatus === 'married_joint') {
        if (spouseHasPlan) {
            limit = baseLimit * 2;
            limitDescription = "Combined Limit (Both Working)";
        } else {
            limit = baseLimit;
            limitDescription = "Your Limit Only (Spouse has no plan)";
        }
    }

    // Logic
    const remainingToMax = Math.max(0, limit - alreadyContributed);
    const monthlyToMax = Math.round(remainingToMax / 12);

    // We recommend the LESSER of: What they have left in budget, OR what they have left to max 401k
    const recommended = Math.min(remainingBudget, monthlyToMax);
    const isMaxed = remainingToMax <= 0;

    // Cash Flow Shifting Logic
    const excessCash = profile.excessCash || 0;
    // Suggest shifting if they have significant cash (e.g. > $10k) but their monthly budget (recommended) won't max it out
    // OR if they just have a ton of cash.
    const showCashFlowShifting = !isMaxed && excessCash > 10000 && recommended < monthlyToMax;

    const handleNext = () => {
        if (!isMaxed && recommended > 0) {
            setAllocation('max-401k', recommended);
            useFinancialStore.getState().addActionItem({
                id: 'max-401k',
                label: `Increase 401k contributions by $${recommended.toLocaleString()}/mo`
            });
        }
        nextStep();
    };

    return (
        <ConversationalCard
            title={isMaxed ? "401k Maxed! 🏢" : "Max Out 401k 🏢"}
            description="With moderate debts under control, let's go back to your Employer Plan and fill it up completely."
            mode="advice"
        >
            <div className="space-y-6">
                {!isMaxed && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="bg-blue-500 rounded-full p-2 text-white">
                                <Building className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{selectedYear} {limitDescription}</p>
                                <p className="text-3xl font-bold text-foreground">
                                    ${limit.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {profile.filingStatus === 'married_joint' && (
                            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={spouseHasPlan}
                                    onChange={e => setSpouseHasPlan(e.target.checked)}
                                    id="spouse-plan"
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="spouse-plan" className="text-sm text-foreground select-none cursor-pointer">
                                    My spouse also has a 401k/403b at work
                                </label>
                            </div>
                        )}
                    </div>
                )}

                {showCashFlowShifting && (
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
                        <h4 className="font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2 mb-2">
                            🔄 Cash Flow Shifting Strategy
                        </h4>
                        <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-2">
                            You have <strong>${excessCash.toLocaleString()}</strong> in excess cash, but your monthly budget only supports contributing <strong>${recommended.toLocaleString()}/mo</strong> to your 401k.
                        </p>
                        <p className="text-sm text-indigo-800 dark:text-indigo-200">
                            <strong>The Hack:</strong> Temporarily set your 401k contribution to <strong>100% of your paycheck</strong>.
                            Use your cash savings to pay your bills during this time.
                            This effectively "moves" your savings into your tax-advantaged 401k!
                        </p>
                    </div>
                )}

                {/* Already Contributed Input */}
                <div className="p-4 border border-border rounded-xl flex items-center justify-between bg-card">
                    <div>
                        <label className="text-sm font-medium text-foreground">Already contributing / contributed?</label>
                        <p className="text-xs text-muted-foreground">Total {selectedYear} contributions</p>
                    </div>
                    <div className="relative w-32">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <input
                            type="number"
                            value={alreadyContributed || ''}
                            onChange={(e) => setAlreadyContributed(Number(e.target.value))}
                            className="w-full pl-6 pr-3 py-2 bg-secondary rounded-lg font-bold text-right focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card">
                    <span className="text-sm font-medium">Remaining Budget</span>
                    <span className="font-bold font-mono text-emerald-500">${remainingBudget.toLocaleString()}</span>
                </div>

                <button
                    onClick={handleNext}
                    className="w-full p-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all font-medium flex items-center justify-center gap-2"
                >
                    {isMaxed ? "Done. Next" : `Allocate $${recommended.toLocaleString()}/mo & Next`} <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </ConversationalCard >
    );
}
