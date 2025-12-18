"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { ArrowRight, Rocket, Car, GraduationCap, Home } from "lucide-react";
import { useState } from "react";

export function GoalsStep() {
    const { nextStep, setAllocation, getRemainingBudget, profile, setProfileBase } = useFinancialStore();
    const remaining = getRemainingBudget();

    const [hasGoals, setHasGoals] = useState<boolean | null>(null);

    // Calculator State
    const [goalName, setGoalName] = useState('Dream Home');
    const [targetAmount, setTargetAmount] = useState('');
    const [timelineYears, setTimelineYears] = useState(5);

    const handleAnswer = (ans: boolean) => {
        setHasGoals(ans);
        if (!ans) {
            nextStep();
        }
    };

    // Calc Logic
    const targetVal = parseFloat(targetAmount.replace(/,/g, "")) || 0;
    const months = timelineYears * 12;
    const monthlySavings = Math.ceil(targetVal / months);

    const affordable = monthlySavings <= remaining;

    // Lump Sum Logic
    const excessCash = profile.excessCash || 0;
    const canLumpSum = targetVal > 0 && excessCash >= targetVal;

    const handleCommit = () => {
        if (targetVal > 0 && affordable) {
            setAllocation('future-goals', monthlySavings);
            useFinancialStore.getState().addActionItem({
                id: 'save-goal',
                label: `Save $${monthlySavings.toLocaleString()}/mo for ${goalName} (${timelineYears} yrs)`
            });
            // Also add the HYSA reminder
            if (typeof useFinancialStore.getState().addActionItem === 'function') {
                useFinancialStore.getState().addActionItem({
                    id: 'goals-account',
                    label: `Open specific HYSA sub-account for '${goalName}'`
                });
            }
        }
        nextStep();
    };

    const handleLumpSumCommit = () => {
        // Deduct from excess cash
        setProfileBase({ excessCash: excessCash - targetVal });

        // Add action item for transfer
        useFinancialStore.getState().addActionItem({
            id: 'save-goal-lump-sum',
            label: `Transfer $${targetVal.toLocaleString()} from Initial Savings to new '${goalName}' HYSA`
        });

        // Skip allocation since it's fully funded
        nextStep();
    }

    if (hasGoals === null) {
        return (
            <ConversationalCard
                title="Future Quests 🚀"
                description="Are you saving for any major purchases in the near future (3-5 years)?"
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center justify-center p-3 bg-secondary rounded-xl text-center">
                            <GraduationCap className="w-6 h-6 mb-1 text-indigo-500" />
                            <span className="text-xs font-medium">College</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-3 bg-secondary rounded-xl text-center">
                            <Car className="w-6 h-6 mb-1 text-blue-500" />
                            <span className="text-xs font-medium">Car</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-3 bg-secondary rounded-xl text-center">
                            <Home className="w-6 h-6 mb-1 text-emerald-500" />
                            <span className="text-xs font-medium">House</span>
                        </div>
                    </div>

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
                            No, just investing
                        </button>
                    </div>
                </div>
            </ConversationalCard>
        );
    }

    return (
        <ConversationalCard
            title="Safe Harbor Strategy"
            description="Money needed in < 5 years should NOT be in the stock market."
            mode="advice"
        >
            <div className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">What is the Goal?</label>
                        <select
                            value={goalName}
                            onChange={(e) => setGoalName(e.target.value)}
                            className="w-full p-2 bg-secondary rounded-lg mt-1 border-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="Dream Home">Dream Home (Down Payment)</option>
                            <option value="New Car">New Car</option>
                            <option value="Wedding">Wedding</option>
                            <option value="Vacation">Big Vacation</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Target Amount?</label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <input
                                    type="text"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                    className="w-full p-2 pl-7 bg-secondary rounded-lg font-bold"
                                    placeholder="50,000"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Timeline? ({timelineYears} Years)</label>
                            <input
                                type="range"
                                min="1" max="10" step="1"
                                value={timelineYears}
                                onChange={(e) => setTimelineYears(Number(e.target.value))}
                                className="w-full mt-3"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl">
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-100 mb-2">The Plan</h4>

                    {targetVal > 0 ? (
                        <div className="mb-4">
                            {canLumpSum ? (
                                <div className="p-4 bg-emerald-200 dark:bg-emerald-800 rounded-xl mb-4">
                                    <h5 className="font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                                        🚀 Fully Funded by Savings!
                                    </h5>
                                    <p className="text-sm text-emerald-800 dark:text-emerald-200 mt-1">
                                        You have <strong>${excessCash.toLocaleString()}</strong> in unallocated cash.
                                        You can fund this goal immediately.
                                    </p>
                                    <button
                                        onClick={handleLumpSumCommit}
                                        className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm"
                                    >
                                        Fund ${targetVal.toLocaleString()} Now
                                    </button>
                                </div>
                            ) : null}

                            {targetVal <= remaining && !canLumpSum ? (
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-800 dark:text-emerald-200 text-sm mb-2">
                                    <strong>Good News!</strong> You have enough monthly budget (${remaining.toLocaleString()}) to fund this goal in a single month! Do you already have this cash saved?
                                </div>
                            ) : null}
                            <p className="text-sm text-foreground">Save monthly:</p>
                            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                ${monthlySavings.toLocaleString()}<span className="text-sm text-muted-foreground">/mo</span>
                            </p>
                            {!affordable && (
                                <p className="text-xs text-red-500 font-bold mt-1">
                                    ⚠️ Exceeds remaining budget! Extend timeline or reduce target.
                                </p>
                            )}
                        </div>
                    ) : <p className="text-sm text-muted-foreground mb-4">Enter details to calculate.</p>}

                    <div className="text-sm text-emerald-800 dark:text-emerald-200 pt-3 border-t border-emerald-200 dark:border-emerald-800">
                        <strong>Where to put it?</strong> <br />
                        High Yield Savings Account (HYSA) or CDs. <br />
                        <em className="text-xs opacity-80">Do not risk money you need soon in the stock market.</em>
                    </div>
                </div>

                <button
                    onClick={handleCommit}
                    disabled={!affordable || targetVal <= 0}
                    className="w-full p-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 disabled:opacity-50 transition-all font-medium flex items-center justify-center gap-2"
                >
                    Set Goal & Continue <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </ConversationalCard>
    );
}
