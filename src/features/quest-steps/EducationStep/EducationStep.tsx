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
                title="Generational Wealth 🎓"
                description="Do you have children (or plan to) that you want to save education money for?"
            >
                <div className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                        This usually implies contributing to a <strong>529 Plan</strong> or ESA.
                        Some states offer tax deductions for this.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleAnswer(true)}
                            className="p-6 bg-card border-2 border-border rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-xl font-bold text-foreground"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => handleAnswer(false)}
                            className="p-6 bg-card border-2 border-border rounded-2xl hover:border-border transition-all text-xl font-bold text-foreground"
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
            title="529 Plans"
            description="Tax-free growth for education expenses."
            mode="advice"
        >
            <div className="space-y-6">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        <h4 className="font-bold text-indigo-900 dark:text-indigo-100">
                            <JargonTerm term="529 Plan" definition="A tax-advantaged savings plan for future education costs. Money grows tax-free and withdrawals are tax-free if used for qualified expenses." />
                        </h4>
                    </div>
                    <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-3">
                        <strong>State Benefits:</strong> Check if your specific state offers a tax deduction. If so, prioritize your state's plan.
                    </p>

                    <div className="bg-white dark:bg-slate-900/50 p-3 rounded-lg text-xs text-indigo-800 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                        <strong>What if they don't go to college?</strong> Thanks to the <JargonTerm term="SECURE 2.0 Act" definition="Recent legislation allowing 529 to Roth IRA rollovers under specific conditions." />, you can roll up to $35,000 lifetime into a Roth IRA for the beneficiary (account must be open 15+ years).
                    </div>
                </div>

                <div className="p-4 border border-border rounded-xl bg-card">
                    <p className="text-sm text-muted-foreground italic">
                        "You've made it this far, which means you're ahead of 95% of the pack. Research this carefully. 529s are great, but taxable accounts offer more flexibility."
                    </p>
                </div>

                <button
                    onClick={() => {
                        if (typeof useFinancialStore.getState().addActionItem === 'function') {
                            useFinancialStore.getState().addActionItem({
                                id: 'open-529',
                                label: 'Research State 529 Plan Benefits'
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
