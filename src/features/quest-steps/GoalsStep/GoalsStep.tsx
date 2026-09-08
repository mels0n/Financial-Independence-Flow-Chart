"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { RecommendationBlock } from "@/shared/ui/RecommendationBlock/RecommendationBlock";
import { Currency } from "@/shared/ui/Currency/Currency";
import { ArrowRight, Car, GraduationCap, Home, Target } from "lucide-react";
import { useState } from "react";

export function GoalsStep() {
    const { nextStep, setAllocation, getRemainingBudget, profile, setProfileBase } = useFinancialStore();
    const remaining = getRemainingBudget();

    const [hasGoals, setHasGoals] = useState<boolean | null>(null);

    const [goalName, setGoalName] = useState('Dream Home');
    const [targetAmount, setTargetAmount] = useState('');
    const [timelineYears, setTimelineYears] = useState(5);

    const handleAnswer = (ans: boolean) => {
        setHasGoals(ans);
        if (!ans) {
            nextStep();
        }
    };

    const targetVal = parseFloat(targetAmount.replace(/,/g, "")) || 0;
    const months = timelineYears * 12;
    const monthlySavings = Math.ceil(targetVal / months);

    const affordable = monthlySavings <= remaining;

    const excessCash = profile.excessCash || 0;
    const canLumpSum = targetVal > 0 && excessCash >= targetVal;

    const handleCommit = () => {
        if (targetVal > 0 && affordable) {
            setAllocation('goals', monthlySavings);
            useFinancialStore.getState().addActionItem({
                id: 'save-goal',
                stepId: 'goals',
                label: `Save $${monthlySavings.toLocaleString()}/mo for ${goalName} (${timelineYears} yrs)`
            });
            useFinancialStore.getState().addActionItem({
                id: 'goals-account',
                stepId: 'goals',
                label: `Open specific HYSA sub-account for '${goalName}'`
            });
        }
        nextStep();
    };

    const handleLumpSumCommit = () => {
        useFinancialStore.getState().spendExcess('goals', targetVal);
        useFinancialStore.getState().addActionItem({
            id: 'save-goal-lump-sum',
            stepId: 'goals',
            label: `Transfer $${targetVal.toLocaleString()} from Initial Savings to new '${goalName}' HYSA`
        });
        nextStep();
    }

    if (hasGoals === null) {
        return (
            <ConversationalCard
                title="Future quests"
                description="Saving for any major purchases in the next 3-5 years?"
                icon={Target}
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { icon: GraduationCap, label: "College" },
                            { icon: Car, label: "Car" },
                            { icon: Home, label: "House" },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="flex flex-col items-center justify-center p-3 bg-secondary rounded-xl text-center">
                                <Icon className="w-5 h-5 mb-1.5 text-primary" aria-hidden />
                                <span className="text-xs font-medium text-foreground">{label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleAnswer(true)}
                            className="p-6 bg-card border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-lg font-bold text-foreground"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => handleAnswer(false)}
                            className="p-6 bg-card border-2 border-border rounded-2xl hover:border-muted-foreground/40 transition-all text-lg font-bold text-foreground"
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
            title="Safe harbor strategy"
            description="Money needed within 5 years does not belong in the stock market. It gets a harbor instead."
            icon={Target}
            mode="advice"
        >
            <div className="space-y-5">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="goal-name" className="text-sm font-medium text-foreground">What is the goal?</label>
                        <select
                            id="goal-name"
                            value={goalName}
                            onChange={(e) => setGoalName(e.target.value)}
                            className="w-full p-2.5 bg-secondary text-foreground rounded-lg mt-1 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="Dream Home">Dream home (down payment)</option>
                            <option value="New Car">New car</option>
                            <option value="Wedding">Wedding</option>
                            <option value="Vacation">Big vacation</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="goal-amount" className="text-sm font-medium text-foreground">Target amount</label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>$</span>
                                <input
                                    id="goal-amount"
                                    type="text"
                                    inputMode="numeric"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                    className="w-full p-2.5 pl-7 bg-secondary rounded-lg font-mono tabular font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="50,000"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="goal-years" className="text-sm font-medium text-foreground">
                                Timeline: <span className="font-mono tabular font-bold text-primary">{timelineYears} {timelineYears === 1 ? "year" : "years"}</span>
                            </label>
                            <input
                                id="goal-years"
                                type="range"
                                min="1" max="10" step="1"
                                value={timelineYears}
                                onChange={(e) => setTimelineYears(Number(e.target.value))}
                                className="w-full mt-3 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {targetVal > 0 ? (
                    <>
                        {canLumpSum && (
                            <div className="p-4 rounded-xl border border-success/40 bg-success/10">
                                <h5 className="font-bold text-success text-sm mb-1">Fully funded by your surplus</h5>
                                <p className="text-sm text-foreground/90 mb-3">
                                    You hold <Currency value={excessCash} className="text-sm font-bold text-foreground" /> in unallocated cash.
                                    This goal can be funded today.
                                </p>
                                <button
                                    onClick={handleLumpSumCommit}
                                    className="w-full py-3 bg-success text-success-foreground rounded-xl font-bold transition-all hover:brightness-110 active:scale-[0.99]"
                                >
                                    Fund <Currency value={targetVal} className="font-bold" /> now
                                </button>
                            </div>
                        )}

                        <RecommendationBlock
                            label="Save monthly"
                            amount={monthlySavings}
                            benefit={<span>Fully funded in <strong className="text-foreground">{timelineYears} {timelineYears === 1 ? "year" : "years"}</strong>.</span>}
                            math={[
                                { label: `Target: ${goalName}`, value: `$${targetVal.toLocaleString()}` },
                                { label: `Timeline: ${timelineYears} yr`, value: `÷ ${months} months` },
                                { label: "Monthly savings", value: `$${monthlySavings.toLocaleString()}`, total: true },
                                { label: "Your free budget (the cap)", value: `$${remaining.toLocaleString()}` },
                            ]}
                            assumptions="Park it in a HYSA or CDs, not the stock market: interest earned along the way will finish the goal slightly early."
                        >
                            {!affordable && (
                                <p className="text-sm font-semibold text-destructive">
                                    Exceeds your free budget. Extend the timeline or reduce the target.
                                </p>
                            )}
                            <button
                                onClick={handleCommit}
                                disabled={!affordable || targetVal <= 0}
                                className="w-full p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50 font-bold flex items-center justify-center gap-2"
                            >
                                Set goal and continue <ArrowRight className="w-5 h-5" aria-hidden />
                            </button>
                            <button
                                onClick={() => nextStep()}
                                className="mx-auto text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground rounded"
                            >
                                Skip this step
                            </button>
                        </RecommendationBlock>
                    </>
                ) : (
                    <p className="p-4 rounded-xl bg-secondary/60 border border-border text-sm text-muted-foreground">
                        Enter a target and the plan calculates itself.
                    </p>
                )}
            </div>
        </ConversationalCard>
    );
}
