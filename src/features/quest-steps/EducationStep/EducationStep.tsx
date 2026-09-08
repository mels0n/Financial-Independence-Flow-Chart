"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { ArrowRight, GraduationCap } from "lucide-react";
import { useState } from "react";
import { JargonTerm } from "@/shared/ui/JargonTerm/JargonTerm";

export function EducationStep() {
    const { nextStep } = useFinancialStore();
    const [hasKids, setHasKids] = useState<boolean | null>(null);

    const handleAnswer = (ans: boolean) => {
        setHasKids(ans);
        if (!ans) {
            nextStep();
        }
    };

    if (hasKids === null) {
        return (
            <ConversationalCard
                title="Generational wealth"
                description="Do you have children (or plan to) that you want education money saved for?"
                icon={GraduationCap}
            >
                <div className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                        This usually means a <strong className="text-foreground">529 plan</strong> or ESA.
                        Some states sweeten it with a tax deduction.
                    </p>
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
                            No / Not applicable
                        </button>
                    </div>
                </div>
            </ConversationalCard>
        );
    }

    return (
        <ConversationalCard
            title="529 plans"
            description="Tax-free growth for education expenses."
            icon={GraduationCap}
            mode="advice"
        >
            <div className="space-y-5">
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
                    <h4 className="font-bold text-foreground mb-2">
                        <JargonTerm term="529 Plan" definition="A tax-advantaged savings plan for future education costs. Money grows tax-free and withdrawals are tax-free if used for qualified expenses." />
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                        <strong className="text-foreground">State benefits:</strong> check if your state offers a
                        tax deduction. If it does, your state&apos;s plan usually wins.
                    </p>

                    <p className="rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
                        <strong className="text-foreground">What if they skip college?</strong> Thanks to the{" "}
                        <JargonTerm term="SECURE 2.0 Act" definition="Recent legislation allowing 529 to Roth IRA rollovers under specific conditions." />,
                        up to $35,000 lifetime can roll into a Roth IRA for the beneficiary (account open 15+ years).
                    </p>
                </div>

                <p className="p-4 rounded-xl border border-border bg-card text-sm text-muted-foreground italic">
                    Reaching this step puts you ahead of most of the pack. Research carefully: 529s are
                    great, but taxable accounts stay more flexible.
                </p>

                <button
                    onClick={() => {
                        useFinancialStore.getState().addActionItem({
                            id: 'open-529',
                            stepId: 'education',
                            label: 'Research State 529 Plan Benefits'
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
