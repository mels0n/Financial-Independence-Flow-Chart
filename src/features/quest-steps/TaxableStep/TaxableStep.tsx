"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { ArrowRight, Globe } from "lucide-react";

export function TaxableStep() {
    const { nextStep, getRemainingBudget, setAllocation, profile, setProfileBase, allocations } = useFinancialStore();
    const remaining = getRemainingBudget();
    const excessCash = profile.excessCash || 0;

    // Calculate total investing power across all steps
    // (Sum of existing investment allocations + this potential new one)
    const investmentSteps = ['match-employer', 'hsa', 'ira', 'max-401k', 'mega-backdoor', 'education'];
    const currentInvesting = investmentSteps.reduce((acc, key) => acc + (allocations[key] || 0), 0);
    const totalInvesting = currentInvesting + remaining;

    // Calculate total savings rate (Total Investing / Income)
    const savingsRate = profile.monthlyIncome > 0
        ? Math.round((totalInvesting / profile.monthlyIncome) * 100)
        : 0;

    const handleFinish = () => {
        // Allocate remaining monthly budget
        if (remaining > 0) {
            setAllocation('taxable', remaining);
            useFinancialStore.getState().addActionItem({
                id: 'open-brokerage',
                label: `Open Taxable Brokerage (Vanguard/Fidelity/Schwab)`
            });
            useFinancialStore.getState().addActionItem({
                id: 'invest-taxable',
                label: `Set up auto-invest of $${remaining.toLocaleString()}/mo into Index Funds`
            });
        }

        // Handle Lump Sum if they still have it
        if (excessCash > 0) {
            // We assume they dump the rest here
            setProfileBase({ excessCash: 0 });
            useFinancialStore.getState().addActionItem({
                id: 'lump-sum-taxable',
                label: `Invest remaining cash lump sum ($${excessCash.toLocaleString()}) into Brokerage`
            });
        }

        // Proceed to completion
        nextStep();
    }

    return (
        <ConversationalCard
            title="The Infinite Frontier 🌍"
            description="You have covered your bases, protected your future, and maxed your tax advantages."
            mode="advice"
        >
            <div className="space-y-6">
                <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xl">
                    <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-4">
                        <Globe className="w-8 h-8 text-emerald-400" />
                        <div>
                            <h4 className="font-bold text-lg">Financial Juggernaut Status</h4>
                            <p className="text-slate-400 text-sm">Your total monthly wealth building machine</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total Investing</div>
                            <div className="text-3xl font-bold text-emerald-400">${totalInvesting.toLocaleString()}<span className="text-sm text-slate-500">/mo</span></div>
                        </div>
                        <div>
                            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Savings Rate</div>
                            <div className="text-3xl font-bold text-blue-400">{savingsRate}%</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-foreground">
                        Any remaining money goes into a standard <strong>Taxable Brokerage Account</strong>.
                        Unlike your 401k/IRA, there is <strong>no limit</strong> and <strong>no penalty</strong> for withdrawal.
                        This is your bridge to early retirement.
                    </p>

                    <div className="p-4 bg-secondary rounded-xl space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="text-sm font-medium">Monthly Contribution</div>
                            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                                ${remaining.toLocaleString()}
                            </div>
                        </div>
                        {excessCash > 0 && (
                            <div className="flex justify-between items-center pt-2 border-t border-border">
                                <div className="text-sm font-medium">Lump Sum Injection</div>
                                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                                    ${excessCash.toLocaleString()}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="text-sm text-muted-foreground p-3 bg-card border border-border rounded-lg">
                        <strong>Strategy:</strong> Buy and hold low-cost, broad market Index Funds (e.g., VTI, VOO, or VT).
                        Do not trade. Just buy.
                    </div>
                </div>

                <button
                    onClick={handleFinish}
                    className="w-full p-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 group"
                >
                    Finish Quest <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </ConversationalCard>
    );
}
