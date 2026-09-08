"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { ArrowRight, KeyRound } from "lucide-react";
import { useState } from "react";

export function MegaBackdoorStep() {
    const { nextStep } = useFinancialStore();
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
                title="The secret level"
                description="Does your 401(k) plan allow 'after-tax' contributions (not Roth) AND in-service withdrawals?"
                icon={KeyRound}
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground p-3 bg-secondary rounded-lg">
                        This is rare. Check your plan document or call HR. If it exists, it lets you contribute
                        far past the normal employee limit, toward the total combined cap.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleAnswer(true)}
                            className="p-6 bg-card border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-lg font-bold text-foreground"
                        >
                            Yes / Check it
                        </button>
                        <button
                            onClick={() => handleAnswer(false)}
                            className="p-6 bg-card border-2 border-border rounded-2xl hover:border-muted-foreground/40 transition-all text-lg font-bold text-foreground"
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
            title="Mega backdoor Roth"
            description="You may have unlocked a massive tax shelter."
            icon={KeyRound}
            mode="advice"
        >
            <div className="space-y-5">
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
                    <h4 className="font-bold text-foreground mb-2">The strategy</h4>
                    <ol className="list-decimal pl-4 space-y-2 text-sm text-muted-foreground">
                        <li>Contribute &quot;after-tax&quot; dollars to the 401(k).</li>
                        <li>IMMEDIATELY convert to Roth 401(k), or roll over to a Roth IRA.</li>
                        <li>Pay zero tax on the growth, forever.</li>
                    </ol>
                </div>

                <button
                    onClick={() => {
                        useFinancialStore.getState().addActionItem({
                            id: 'mega-backdoor',
                            stepId: 'mega-backdoor',
                            label: 'Call 401k Provider about After-Tax In-Service Withdrawals'
                        });
                        nextStep();
                    }}
                    className="w-full p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 active:scale-[0.99] font-bold flex items-center justify-center gap-2"
                >
                    Added to the board. Next <ArrowRight className="w-5 h-5" aria-hidden />
                </button>
            </div>
        </ConversationalCard>
    );
}
