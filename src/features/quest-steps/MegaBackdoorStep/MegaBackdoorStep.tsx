"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useState } from "react";

export function MegaBackdoorStep() {
    const { nextStep, profile, setProfileBase } = useFinancialStore();
    const [stepPhase, setStepPhase] = useState<"ask" | "advice">("ask");

    const handleAnswer = (ans: boolean) => {
        if (ans) {
            setStepPhase("advice");
        } else {
            nextStep();
        }
    };

    if (stepPhase === "ask") {
        return (
            <ConversationalCard
                title="The Secret Level 🤫"
                description="Does your 401k plan allow 'After-Tax' contributions (not Roth) AND in-service withdrawals?"
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground p-3 bg-secondary rounded-lg">
                        This is rare. Check your plan document or call HR. It allows you to contribute way past the $23k limit (up to ~$69k total).
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleAnswer(true)}
                            className="p-6 bg-card border-2 border-border rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-xl font-bold text-foreground"
                        >
                            Yes / Check it
                        </button>
                        <button
                            onClick={() => handleAnswer(false)}
                            className="p-6 bg-card border-2 border-border rounded-2xl hover:border-border transition-all text-xl font-bold text-foreground"
                        >
                            No / Skip
                        </button>
                    </div>
                </div>
            </ConversationalCard>
        );
    }

    return (
        <ConversationalCard
            title="Mega Backdoor Roth 🚀"
            description="You have unlocked a massive tax shelter."
            mode="advice"
        >
            <div className="space-y-6">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2">The Strategy</h4>
                    <ol className="list-decimal pl-4 space-y-2 text-sm text-indigo-800 dark:text-indigo-200">
                        <li>Contribute "After-Tax" dollars to 401k.</li>
                        <li>IMMEDIATELY convert to Roth 401k (or rollover to Roth IRA).</li>
                        <li>Pay 0 tax on growth forever.</li>
                    </ol>
                </div>

                <button
                    onClick={() => {
                        // Action Item
                        if (typeof useFinancialStore.getState().addActionItem === 'function') {
                            useFinancialStore.getState().addActionItem({
                                id: 'mega-backdoor',
                                label: 'Call 401k Provider about After-Tax In-Service Withdrawals'
                            });
                        }
                        nextStep();
                    }}
                    className="w-full p-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all font-medium flex items-center justify-center gap-2"
                >
                    Added to List. Next <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </ConversationalCard>
    );
}
