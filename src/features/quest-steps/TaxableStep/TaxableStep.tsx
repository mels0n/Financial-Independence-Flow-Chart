"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { Currency } from "@/shared/ui/Currency/Currency";
import { ArrowRight, Globe2 } from "lucide-react";

export function TaxableStep() {
    const { nextStep, getRemainingBudget, setAllocation, profile, setProfileBase, allocations } = useFinancialStore();
    const remaining = getRemainingBudget();
    const excessCash = profile.excessCash || 0;

    const investmentSteps = ['match-employer', 'hsa', 'ira', 'max-401k', 'mega-backdoor', 'education'];
    const currentInvesting = investmentSteps.reduce((acc, key) => acc + (allocations[key] || 0), 0);
    const totalInvesting = currentInvesting + remaining;

    const savingsRate = profile.monthlyIncome > 0
        ? Math.round((totalInvesting / profile.monthlyIncome) * 100)
        : 0;

    const handleFinish = () => {
        if (remaining > 0) {
            setAllocation('taxable', remaining);
            useFinancialStore.getState().addActionItem({
                id: 'open-brokerage',
                stepId: 'taxable',
                label: `Open Taxable Brokerage (Vanguard/Fidelity/Schwab)`
            });
            useFinancialStore.getState().addActionItem({
                id: 'invest-taxable',
                stepId: 'taxable',
                label: `Set up auto-invest of $${remaining.toLocaleString()}/mo into Index Funds`
            });
        }

        if (excessCash > 0) {
            setProfileBase({ excessCash: 0 });
            useFinancialStore.getState().addActionItem({
                id: 'lump-sum-taxable',
                stepId: 'taxable',
                label: `Invest remaining cash lump sum ($${excessCash.toLocaleString()}) into Brokerage`
            });
        }

        nextStep();
    }

    return (
        <ConversationalCard
            title="The infinite frontier"
            description="Bases covered, future protected, tax shelters full. Everything left goes to the account with no ceiling."
            icon={Globe2}
            mode="advice"
        >
            <div className="space-y-5">
                <div className="rounded-2xl border border-primary/30 bg-secondary/60 overflow-hidden">
                    <div className="border-b border-border px-4 py-3">
                        <h4 className="font-display font-bold text-foreground">Your wealth engine</h4>
                        <p className="text-xs text-muted-foreground">Total monthly wealth building after this step</p>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-border text-center">
                        <div className="p-4">
                            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-1">Total investing</div>
                            <Currency value={totalInvesting} per="mo" className="text-3xl font-semibold text-success" />
                        </div>
                        <div className="p-4">
                            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-1">Savings rate</div>
                            <div className="font-mono tabular text-3xl font-semibold text-primary">{savingsRate}%</div>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-foreground/90">
                    A <strong>taxable brokerage account</strong> has no contribution limit and no withdrawal penalty.
                    It is the bridge to early retirement.
                </p>

                <div className="p-4 bg-secondary rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">Monthly contribution</span>
                        <Currency value={remaining} per="mo" className="text-xl font-bold text-success" />
                    </div>
                    {excessCash > 0 && (
                        <div className="flex justify-between items-center pt-2 border-t border-border">
                            <span className="text-sm font-medium text-foreground">Lump-sum injection</span>
                            <Currency value={excessCash} className="text-xl font-bold text-success" />
                        </div>
                    )}
                </div>

                <p className="text-sm text-muted-foreground p-3 rounded-lg border border-border bg-card">
                    <strong className="text-foreground">Strategy:</strong> buy and hold low-cost, broad market index funds
                    (VTI, VOO, or VT). Do not trade. Just buy.
                </p>

                <button
                    onClick={handleFinish}
                    className="w-full p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 active:scale-[0.99] font-bold text-lg flex items-center justify-center gap-2 group"
                >
                    Finish the quest <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden />
                </button>
            </div>
        </ConversationalCard>
    );
}
