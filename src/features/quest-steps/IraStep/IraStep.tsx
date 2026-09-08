"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { getFinancialConstants, getYearMeta } from "@/shared/config/financial-constants";
import { useState } from "react";
import { ArrowRight, Landmark, AlertTriangle, TrendingUp, ExternalLink } from "lucide-react";
import { JargonTerm } from "@/shared/ui/JargonTerm/JargonTerm";
import { RecommendationBlock } from "@/shared/ui/RecommendationBlock/RecommendationBlock";
import { Currency } from "@/shared/ui/Currency/Currency";
import { cn } from "@/shared/lib/utils";

export function IraStep() {
    const { selectedYear, nextStep, profile, setAllocation, getRemainingBudget, setProfileBase } = useFinancialStore();
    const limits = getFinancialConstants(selectedYear).ira;
    const yearMeta = getYearMeta(selectedYear);
    const [alreadyContributed, setAlreadyContributed] = useState(0);

    const remainingBudget = getRemainingBudget();
    const isMarried = profile.filingStatus === 'married_joint';
    const limit = isMarried ? limits.limit * 2 : limits.limit;

    const rawRemaining = limit - alreadyContributed;
    const remainingToMax = Math.max(0, rawRemaining);
    const monthlyToMax = Math.round(remainingToMax / 12);
    const recommended = Math.min(remainingBudget, monthlyToMax);

    const isOverContributed = rawRemaining < 0;
    const isMaxed = rawRemaining <= 0;

    const excessCash = profile.excessCash || 0;
    const canLumpSum = !isMaxed && excessCash >= remainingToMax;

    const handleNext = () => {
        if (profile.monthlyIncome <= 0) {
            alert("Wait! You must have 'Earned Income' to contribute to an IRA.");
            return;
        }

        if (canLumpSum) {
            setProfileBase({ excessCash: excessCash - remainingToMax });
            useFinancialStore.getState().addActionItem({
                id: 'ira-lump-sum',
                stepId: 'ira',
                label: `Transfer $${remainingToMax.toLocaleString()} from Savings to IRA(s)`
            });
            nextStep();
            return;
        }

        if (!isMaxed && recommended > 0) {
            setAllocation('ira', recommended);
            useFinancialStore.getState().addActionItem({
                id: 'open-ira',
                stepId: 'ira',
                label: `Maximize IRA: Contribute $${recommended.toLocaleString()}/mo ($${remainingToMax.toLocaleString()} remaining)`
            });
        }
        nextStep();
    };

    return (
        <ConversationalCard
            title={isMaxed ? "IRA: maxed" : "The final foundation"}
            description={
                isMarried
                    ? "Married filing jointly means TWO IRAs (yours and your spouse's). They must be separate accounts; Individual is in the name."
                    : "After the match, the fires, and the HSA, your next best dollar goes into an IRA (Individual Retirement Account)."
            }
            icon={Landmark}
            mode="advice"
        >
            <div className="space-y-5">
                <div className="p-4 bg-warning/10 border border-warning/30 rounded-xl flex gap-3 text-sm">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
                    <p className="text-foreground/90">
                        <strong>An IRA is just a bucket.</strong> Putting money in is step 1. You must then log in and
                        invest it (a target-date index fund is the classic pick), or it sits in cash doing nothing.
                    </p>
                </div>

                <div className="p-4 border border-border rounded-xl flex items-center justify-between gap-4 bg-card">
                    <div>
                        <label htmlFor="ira-contributed" className="text-sm font-medium text-foreground">Already contributed this year?</label>
                        <p className="text-xs text-muted-foreground">{selectedYear} contributions only{isMarried ? ", both spouses combined" : ""}</p>
                    </div>
                    <div className="relative w-32 shrink-0">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>$</span>
                        <input
                            id="ira-contributed"
                            type="number"
                            value={alreadyContributed || ''}
                            onChange={(e) => setAlreadyContributed(Number(e.target.value))}
                            className={cn(
                                "w-full pl-6 pr-3 py-2 bg-secondary rounded-lg font-mono tabular font-bold text-right focus:outline-none focus:ring-2",
                                isOverContributed ? "text-destructive focus:ring-destructive" : "text-foreground focus:ring-primary/50"
                            )}
                            placeholder="0"
                        />
                    </div>
                </div>

                {isOverContributed && (
                    <div className="p-4 bg-destructive/10 border border-destructive/40 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden />
                        <div>
                            <h4 className="font-bold text-destructive">Over-contribution warning</h4>
                            <p className="text-sm text-foreground/90">
                                You have exceeded the limit by <Currency value={Math.abs(rawRemaining)} className="text-sm font-bold" />.
                                Withdraw the excess before tax time to avoid penalties.
                            </p>
                        </div>
                    </div>
                )}

                {!isMaxed && (
                    <RecommendationBlock
                        amount={canLumpSum ? remainingToMax : recommended}
                        per={canLumpSum ? "once" : "mo"}
                        label={canLumpSum ? "Fund from surplus cash" : "Recommended"}
                        benefit={
                            canLumpSum
                                ? <span>Your emergency-fund surplus covers the whole {selectedYear} contribution today.</span>
                                : <span>Fills your remaining <Currency value={remainingToMax} className="text-sm font-bold text-foreground" /> of {selectedYear} IRA space.</span>
                        }
                        math={[
                            {
                                label: isMarried ? `${selectedYear} limit ($${limits.limit.toLocaleString()} × 2 spouses)` : `${selectedYear} IRA limit`,
                                value: `$${limit.toLocaleString()}`
                            },
                            { label: "Already contributed", value: `− $${alreadyContributed.toLocaleString()}` },
                            { label: "Spread across 12 months", value: "÷ 12" },
                            { label: "Monthly to hit the max", value: `$${monthlyToMax.toLocaleString()}`, total: true },
                            { label: "Your free budget (the cap)", value: `$${remainingBudget.toLocaleString()}` },
                        ]}
                        assumptions={`Catch-up if 50+: an extra $${limits.catchUp.toLocaleString()} per person, not included above. You can also fund a year's IRA until that year's tax deadline.`}
                        source={{ ...yearMeta.sources.ira, projected: yearMeta.status === "projected" }}
                    >
                        <button
                            onClick={handleNext}
                            disabled={!canLumpSum && recommended <= 0}
                            className={cn(
                                "w-full p-4 rounded-2xl transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50 font-bold text-base flex items-center justify-center gap-2",
                                canLumpSum ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"
                            )}
                        >
                            {canLumpSum
                                ? <>Fund <Currency value={remainingToMax} className="font-bold" /> now <ArrowRight className="w-5 h-5" aria-hidden /></>
                                : <>Allocate <Currency value={recommended} per="mo" className="font-bold" perClassName="text-primary-foreground/70" /> <ArrowRight className="w-5 h-5" aria-hidden /></>}
                        </button>
                        <button
                            onClick={() => nextStep()}
                            className="mx-auto text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground rounded"
                        >
                            Skip this step
                        </button>
                    </RecommendationBlock>
                )}

                {isMarried && !isMaxed && (
                    <div className="p-4 border border-border rounded-xl bg-secondary/50">
                        <h4 className="font-bold text-foreground text-sm mb-1.5">Spousal IRA: the overlooked move</h4>
                        <p className="text-sm text-muted-foreground">
                            Both spouses can fund their own IRA, even if one does not work, as long as household
                            earned income covers the total.{" "}
                            <a
                                href="https://www.irs.gov/publications/p590a"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 underline underline-offset-2 text-primary hover:no-underline"
                            >
                                IRS Publication 590-A <ExternalLink className="h-3 w-3" aria-hidden />
                            </a>
                        </p>
                    </div>
                )}

                {!isMaxed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="p-4 rounded-xl border border-border bg-card">
                            <span className="font-bold block mb-1 text-foreground">Roth IRA</span>
                            <span className="text-muted-foreground">Pay tax now, tax-free forever. Best if you expect to be richer later.</span>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-card">
                            <span className="font-bold block mb-1 text-foreground">Traditional IRA</span>
                            <span className="text-muted-foreground">Deduction now, taxed later. Best if you need the break today.</span>
                        </div>
                    </div>
                )}

                <div className="p-4 rounded-xl border border-border bg-secondary/50 space-y-3 text-sm text-muted-foreground">
                    <p className="flex gap-2">
                        <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                        <span>
                            <strong className="text-foreground">Earned income rule:</strong> you cannot contribute more than you earned from work
                            (<JargonTerm term="Earned Income" definition="Money you make from a job or your own business. It does NOT include interest, dividends, or rental income." />).
                            {isMarried ? " For joint filers, combined household earned income counts." : ""}
                        </span>
                    </p>
                    <p className="flex gap-2">
                        <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                        <span>
                            <strong className="text-foreground">High earner?</strong> Above roughly $146k single / $230k married, look at the{" "}
                            <JargonTerm term="Backdoor Roth" definition="A completely legal maneuver: contribute to a Traditional IRA (with no deduction), then immediately convert it to a Roth IRA." />
                            {" "}strategy.{" "}
                            <a href="https://www.fidelity.com/learning-center/personal-finance/backdoor-roth-ira" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-2 text-primary hover:no-underline">
                                Fidelity explainer <ExternalLink className="h-3 w-3" aria-hidden />
                            </a>
                        </span>
                    </p>
                </div>

                {isMaxed && !isOverContributed && (
                    <button
                        onClick={handleNext}
                        className="w-full p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 active:scale-[0.99] font-bold flex items-center justify-center gap-2"
                    >
                        IRA done. Next step <ArrowRight className="w-5 h-5" aria-hidden />
                    </button>
                )}
                {isOverContributed && (
                    <button
                        onClick={() => nextStep()}
                        className="w-full p-4 bg-secondary text-secondary-foreground rounded-2xl transition-all hover:bg-secondary/80 font-bold flex items-center justify-center gap-2"
                    >
                        Understood. Next step <ArrowRight className="w-5 h-5" aria-hidden />
                    </button>
                )}
            </div>
        </ConversationalCard>
    );
}
