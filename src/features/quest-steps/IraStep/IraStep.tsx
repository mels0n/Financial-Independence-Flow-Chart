
"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { FINANCIAL_CONSTANTS } from "@/shared/config/financial-constants";
import { useState } from "react";
import { ArrowRight, PiggyBank, TrendingUp } from "lucide-react";
import { JargonTerm } from "@/shared/ui/JargonTerm/JargonTerm";

export function IraStep() {
    const { selectedYear, nextStep, profile, setAllocation, getRemainingBudget } = useFinancialStore();
    const limits = FINANCIAL_CONSTANTS[selectedYear].ira;
    const [alreadyContributed, setAlreadyContributed] = useState(0);

    const remainingBudget = getRemainingBudget();
    const limit = profile.filingStatus === 'married_joint' ? limits.limit * 2 : limits.limit;

    // Logic
    const remainingToMax = Math.max(0, limit - alreadyContributed);
    const monthsRemaining = 12; // Simplified
    const monthlyToMax = Math.round(remainingToMax / 12);

    // We recommend the LESSER of: What they have left in budget, OR what they have left to max IRA (logic unchanged)
    const recommended = Math.min(remainingBudget, monthlyToMax);

    const isMaxed = remainingToMax <= 0;

    return (
        <ConversationalCard
            title={isMaxed ? "IRAs Maxed! 🌟" : "The Final Foundation 🏛️"}
            description={
                profile.filingStatus === 'married_joint'
                    ? "Since you are married, you can contribute to TWO IRAs (yours and your spouse's). IMPORTANT: These must be separate accounts (Individual Retirement Account), not one joint account."
                    : "After the match, debts, and HSA, your next best dollar goes into an IRA (Individual Retirement Account)."
            }
            mode="advice"
        >
            <div className="space-y-6">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex gap-3 text-sm text-amber-900 dark:text-amber-100">
                    <div className="shrink-0 mt-1">⚠️</div>
                    <div>
                        <strong>Critical Warning:</strong> An IRA is just a "bucket". Putting money in is step 1. You MUST log in and invest that money (e.g., into a Target Date Index Fund). If you don't, it sits in cash doing nothing!
                    </div>
                </div>

                {!isMaxed && (
                    <div className="p-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <PiggyBank className="w-24 h-24" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-2">{selectedYear} Combined Limit</p>
                        <p className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">${limit.toLocaleString()}</p>
                        <div className="flex flex-col gap-1 mt-2">
                            <p className="text-slate-400 text-sm">($7,500 × 2 people)</p>
                            <p className="text-slate-400 text-xs">+$1,000 catch-up per person if 50+</p>
                        </div>
                    </div>
                )}

                {/* Already Contributed Input */}
                <div className="p-4 border border-border rounded-xl flex items-center justify-between bg-card">
                    <div>
                        <label className="text-sm font-medium text-foreground">Already contributed this year?</label>
                        <p className="text-xs text-muted-foreground">{selectedYear} contributions only</p>
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

                {!isMaxed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-200 rounded-xl border border-purple-100 dark:border-purple-900">
                            <span className="font-bold block mb-1">Roth IRA</span>
                            Pay tax now, tax-free forever. Best if you expect to be richer later.
                        </div>
                        <div className="p-4 bg-sky-50 dark:bg-sky-900/20 text-sky-900 dark:text-sky-200 rounded-xl border border-sky-100 dark:border-sky-900">
                            <span className="font-bold block mb-1">Traditional IRA</span>
                            Tax deduction now, pay tax later. Best if you need the tax break today.
                        </div>
                    </div>
                )}

                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl">
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Income Limit?
                    </h4>
                    <p className="text-sm text-emerald-800 dark:text-emerald-200 mt-2">
                        If your income is very high (~$146k+ Single / ~$230k+ Married), you might need the <JargonTerm term="Backdoor Roth" definition="A completely legal loophole. You contribute to a Traditional IRA (getting no deduction), then immediately convert it to a Roth IRA." /> strategy. <a href="https://www.fidelity.com/learning-center/personal-finance/backdoor-roth-ira" target="_blank" rel="noopener noreferrer" className="underline text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 ml-1">Read more at Fidelity ↗</a>
                    </p>
                </div>

                <button
                    onClick={() => {
                        // Check for Earned Income
                        if (profile.monthlyIncome <= 0) {
                            alert("Wait! You must have 'Earned Income' to contribute to an IRA.");
                            return;
                        }

                        // Add Allocation & Action Item
                        if (!isMaxed && recommended > 0) {
                            setAllocation('ira', recommended);
                            useFinancialStore.getState().addActionItem({
                                id: 'open-ira',
                                label: `Maximize IRA: Contribute $${recommended.toLocaleString()}/mo ($${remainingToMax.toLocaleString()} remaining)`
                            });
                        } else if (isMaxed) {
                            // Maybe add a 'completed' note?
                        }

                        nextStep();
                    }}
                    className="w-full p-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all font-medium flex items-center justify-center gap-2"
                >
                    {isMaxed ? "IRA Done. Next Step" : `Allocate $${recommended.toLocaleString()}/mo & Next`} < ArrowRight className="w-5 h-5" />
                </button >
            </div >
        </ConversationalCard >
    );
}
