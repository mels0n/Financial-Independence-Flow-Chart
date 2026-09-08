"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ASSUMPTIONS, getFinancialConstants, getYearMeta } from "@/shared/config/financial-constants";
import { useState } from "react";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { RecommendationBlock } from "@/shared/ui/RecommendationBlock/RecommendationBlock";
import { Currency } from "@/shared/ui/Currency/Currency";
import { ArrowRight, Building2, Repeat } from "lucide-react";
import { cn, formatPercent } from "@/shared/lib/utils";

export function Max401kStep() {
    const { nextStep, selectedYear, getRemainingBudget, profile, setAllocation } = useFinancialStore();
    const remainingBudget = getRemainingBudget();

    const [alreadyContributed, setAlreadyContributed] = useState(0);
    const [userHasPlan, setUserHasPlan] = useState(true);
    const [spouseHasPlan, setSpouseHasPlan] = useState(true);

    const baseLimit = getFinancialConstants(selectedYear).k401.limit;
    const yearMeta = getYearMeta(selectedYear);
    const isMarried = profile.filingStatus === 'married_joint';

    let limit = 0;
    let limitDescription = "individual limit";
    if (isMarried) {
        limit = (userHasPlan ? baseLimit : 0) + (spouseHasPlan ? baseLimit : 0);
        limitDescription = userHasPlan && spouseHasPlan
            ? "combined limit, both plans"
            : userHasPlan ? "your plan only"
                : spouseHasPlan ? "spouse's plan only" : "no plans available";
    } else {
        limit = userHasPlan ? baseLimit : 0;
        limitDescription = userHasPlan ? "individual limit" : "no plan available";
    }

    const rawRemaining = limit - alreadyContributed;
    const remainingToMax = Math.max(0, rawRemaining);
    const monthlyToMax = Math.round(remainingToMax / 12);
    const recommended = Math.min(remainingBudget, monthlyToMax);
    const isMaxed = rawRemaining <= 0;

    const bracket = ASSUMPTIONS.marginalFederalRateHigh.value;
    const predictedTaxSavings = Math.round(recommended * bracket);

    const excessCash = profile.excessCash || 0;
    const showCashFlowShifting = !isMaxed && excessCash > 10000 && recommended < monthlyToMax;

    const handleNext = () => {
        if (!isMaxed && recommended > 0) {
            setAllocation('max-401k', recommended);
            useFinancialStore.getState().addActionItem({
                id: 'max-401k',
                stepId: 'max-401k',
                label: `Increase payroll 401k contributions by $${recommended.toLocaleString()}/mo`
            });
        }
        nextStep();
    };

    return (
        <ConversationalCard
            title={isMaxed ? "401(k): maxed" : "Fill the 401(k)"}
            description="With moderate debts handled, go back to the employer plan and fill it to the ceiling."
            icon={Building2}
            mode="advice"
        >
            <div className="space-y-5">
                {!isMaxed && (
                    <div className="p-4 rounded-xl border border-border bg-card">
                        <div className="flex items-baseline justify-between gap-4">
                            <span className="text-sm text-muted-foreground">{selectedYear} {limitDescription}</span>
                            <Currency value={limit} className="text-2xl font-bold text-foreground" />
                        </div>

                        <div className="mt-4 pt-4 border-t border-border space-y-3">
                            <label htmlFor="user-plan" className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={userHasPlan}
                                    onChange={e => setUserHasPlan(e.target.checked)}
                                    id="user-plan"
                                    className="w-4 h-4 rounded border-border bg-secondary text-primary focus:ring-primary"
                                />
                                I have a 401(k)/403(b) available at my job
                            </label>

                            {isMarried && (
                                <label htmlFor="spouse-plan" className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={spouseHasPlan}
                                        onChange={e => setSpouseHasPlan(e.target.checked)}
                                        id="spouse-plan"
                                        className="w-4 h-4 rounded border-border bg-secondary text-primary focus:ring-primary"
                                    />
                                    My spouse has one at their job
                                </label>
                            )}
                        </div>
                    </div>
                )}

                <div className="p-4 border border-border rounded-xl flex items-center justify-between gap-4 bg-card">
                    <div>
                        <label htmlFor="k401-contributed" className="text-sm font-medium text-foreground">Already contributing or contributed?</label>
                        <p className="text-xs text-muted-foreground">Total {selectedYear} employee contributions</p>
                    </div>
                    <div className="relative w-32 shrink-0">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>$</span>
                        <input
                            id="k401-contributed"
                            type="number"
                            value={alreadyContributed || ''}
                            onChange={(e) => setAlreadyContributed(Number(e.target.value))}
                            className="w-full pl-6 pr-3 py-2 bg-secondary rounded-lg font-mono tabular font-bold text-right text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="0"
                        />
                    </div>
                </div>

                {showCashFlowShifting && (
                    <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
                        <h4 className="font-bold text-foreground flex items-center gap-2 mb-1.5 text-sm">
                            <Repeat className="h-4 w-4 text-primary" aria-hidden />
                            Cash-flow shifting: the power move
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            You hold <Currency value={excessCash} className="text-sm font-bold text-foreground" /> in surplus cash, but your monthly
                            budget only supports <Currency value={recommended} per="mo" className="text-sm font-bold text-foreground" />.
                            Temporarily set your 401(k) contribution near 100% of paycheck and live on the cash.
                            That legally teleports your savings into tax-advantaged space.
                        </p>
                    </div>
                )}

                {!isMaxed && recommended > 0 ? (
                    <RecommendationBlock
                        amount={recommended}
                        benefit={
                            <span>
                                <span className="block font-mono tabular text-base font-bold text-success">≈ ${predictedTaxSavings.toLocaleString()}/mo less tax</span>
                                while the contribution runs
                            </span>
                        }
                        math={[
                            { label: `${selectedYear} employee limit (${limitDescription})`, value: `$${limit.toLocaleString()}` },
                            { label: "Already contributed", value: `− $${alreadyContributed.toLocaleString()}` },
                            { label: "Spread across 12 months", value: "÷ 12" },
                            { label: "Monthly to hit the max", value: `$${monthlyToMax.toLocaleString()}` },
                            { label: "Your free budget (the cap)", value: `$${remainingBudget.toLocaleString()}` },
                            { label: "This plan allocates", value: `$${recommended.toLocaleString()}/mo`, total: true },
                            { label: `Tax saved: $${recommended.toLocaleString()} × ${formatPercent(bracket)}`, value: `≈ $${predictedTaxSavings.toLocaleString()}/mo` },
                        ]}
                        assumptions={`${ASSUMPTIONS.marginalFederalRateHigh.detail} Contributions go through payroll deduction; you cannot transfer cash into a 401(k) directly.`}
                        source={yearMeta.sources.k401}
                    >
                        <button
                            onClick={handleNext}
                            className="w-full p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 active:scale-[0.99] font-bold text-base flex items-center justify-center gap-2"
                        >
                            Allocate <Currency value={recommended} per="mo" className="font-bold" perClassName="text-primary-foreground/70" />
                            <ArrowRight className="w-5 h-5" aria-hidden />
                        </button>
                        <button
                            onClick={() => nextStep()}
                            className="mx-auto text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground rounded"
                        >
                            Skip this step
                        </button>
                    </RecommendationBlock>
                ) : (
                    <button
                        onClick={handleNext}
                        className="w-full p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 active:scale-[0.99] font-bold flex items-center justify-center gap-2"
                    >
                        {isMaxed ? "Maxed. Next step" : "Nothing to allocate. Next"} <ArrowRight className="w-5 h-5" aria-hidden />
                    </button>
                )}
            </div>
        </ConversationalCard>
    );
}
