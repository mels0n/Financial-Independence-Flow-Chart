"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ASSUMPTIONS, getFinancialConstants, getYearMeta } from "@/shared/config/financial-constants";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { RecommendationBlock, SourceFootnote } from "@/shared/ui/RecommendationBlock/RecommendationBlock";
import { Currency } from "@/shared/ui/Currency/Currency";
import { ArrowRight, Receipt, CalendarClock, Cloud, HeartPulse, Check, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";

export function HsaStep() {
    const { profile, setProfileBase, nextStep, setAllocation, selectedYear, getRemainingBudget } = useFinancialStore();
    const [stepPhase, setStepPhase] = useState<"intro" | "ask-eligible" | "calc" | "strategy">("intro");
    const [alreadyContributed, setAlreadyContributed] = useState(0);

    const hsaLimits = getFinancialConstants(selectedYear).hsa;
    const { self: limitSelf, family: limitFamily } = hsaLimits;
    const yearMeta = getYearMeta(selectedYear);

    const [coverageType, setCoverageType] = useState<"self" | "family">("self");

    // If planning a future year we have all 12 months; the current year gets what's left.
    const today = new Date();
    const currentYear = today.getFullYear();
    const targetYear = parseInt(selectedYear);
    const currentMonth = today.getMonth();
    const isFutureYear = targetYear > currentYear;
    const monthsRemaining = isFutureYear ? 12 : Math.max(1, 12 - currentMonth);

    const annualLimit = coverageType === 'self' ? limitSelf : limitFamily;
    const remainingToMax = Math.max(0, annualLimit - alreadyContributed);
    const rawRemaining = annualLimit - alreadyContributed;

    const aggressiveMonthly = Math.round(remainingToMax / monthsRemaining);
    const standardMonthly = Math.round(annualLimit / 12);

    const remainingBudget = getRemainingBudget();
    const recommended = Math.min(remainingBudget, aggressiveMonthly);

    const combinedRate = ASSUMPTIONS.marginalFederalRate.value + ASSUMPTIONS.ficaRate.value;
    const annualTaxSavings = Math.round(remainingToMax * combinedRate);

    const handleEligible = (y: boolean) => {
        setProfileBase({ hasHsaEligiblePlan: y });
        if (y) setStepPhase("calc");
        else nextStep();
    };

    const confirmAllocation = () => {
        setAllocation('hsa', recommended);
        useFinancialStore.getState().addActionItem({
            id: 'maximize-hsa',
            stepId: 'hsa',
            label: `Maximize HSA: Contribute $${recommended.toLocaleString()}/mo`
        });
        setStepPhase('strategy');
    };

    if (stepPhase === "intro") {
        return (
            <ConversationalCard
                title="The super account"
                description="Before we talk numbers, there is a secret weapon to unlock."
                icon={HeartPulse}
            >
                <div className="space-y-5">
                    <p className="text-base text-foreground">
                        Most people think an <strong>HSA (Health Savings Account)</strong> is just for paying doctors.
                        It is actually the strongest account in the US tax code.
                    </p>
                    <ul className="space-y-2.5 rounded-2xl border border-primary/25 bg-primary/5 p-4">
                        {[
                            ["Tax deduction going in", "an instant discount on this year's taxes"],
                            ["Tax-free growth", "investments compound like an IRA"],
                            ["Tax-free coming out", "for medical expenses, at any age"],
                        ].map(([head, tail]) => (
                            <li key={head} className="flex gap-2.5 text-sm text-foreground">
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={3} aria-hidden />
                                <span><strong>{head}</strong>: {tail}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-sm text-muted-foreground">
                        No other account has all three. The catch: you need a specific type of health insurance to open one.
                    </p>
                    <button
                        onClick={() => setStepPhase("ask-eligible")}
                        className="w-full p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 active:scale-[0.99] font-bold text-lg flex items-center justify-center gap-2"
                    >
                        See if I qualify <ArrowRight className="w-5 h-5" aria-hidden />
                    </button>
                </div>
            </ConversationalCard>
        );
    }

    if (stepPhase === "ask-eligible") {
        return (
            <ConversationalCard
                title="The eligibility check"
                description="Do you have a High Deductible Health Plan (HDHP)?"
                icon={HeartPulse}
            >
                <div className="space-y-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        For {selectedYear} this means your insurance deductible is at least{" "}
                        <strong className="text-foreground">${hsaLimits.hdhpMinDeductibleSelf.toLocaleString()} (self)</strong> or{" "}
                        <strong className="text-foreground">${hsaLimits.hdhpMinDeductibleFamily.toLocaleString()} (family)</strong>.
                        It is commonly the &quot;low premium&quot; option in employer plans, with an HSA attached.
                    </p>
                    <SourceFootnote source={{ ...yearMeta.sources.hsa, projected: yearMeta.status === "projected" }} />

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handleEligible(true)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-lg font-bold text-foreground">
                            Yes, I do
                        </button>
                        <button onClick={() => handleEligible(false)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-muted-foreground/40 transition-all text-lg font-bold text-foreground">
                            No / Not sure
                        </button>
                    </div>
                </div>
            </ConversationalCard>
        );
    }

    if (stepPhase === "calc") {
        const isMaxed = remainingToMax <= 0 && rawRemaining <= 0;
        const isOverContributed = rawRemaining < 0;

        const excessCash = profile.excessCash || 0;
        const canLumpSum = !isMaxed && excessCash >= remainingToMax && remainingToMax > 0;

        const description = isMaxed
            ? `You already hit the ${selectedYear} limit. Outstanding.`
            : isFutureYear
                ? `Planning for ${selectedYear}: you have the full 12 months.`
                : `It is month ${currentMonth + 1} of ${currentYear}. To hit the max, you sprint.`;

        return (
            <ConversationalCard
                title={isMaxed ? "HSA: maxed" : "Max it out"}
                description={description}
                icon={HeartPulse}
            >
                <div className="space-y-5">
                    <div className="flex gap-4 p-4 bg-secondary rounded-xl items-center justify-between">
                        <div>
                            <label htmlFor="hsa-coverage" className="text-xs text-muted-foreground block mb-1">Coverage</label>
                            <select
                                id="hsa-coverage"
                                value={coverageType}
                                onChange={(e) => setCoverageType(e.target.value as "self" | "family")}
                                className="bg-transparent font-bold text-lg text-foreground border-b-2 border-primary focus:outline-none cursor-pointer"
                            >
                                <option value="self" className="bg-popover text-popover-foreground">Self only</option>
                                <option value="family" className="bg-popover text-popover-foreground">Family plan</option>
                            </select>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground">{selectedYear} limit</div>
                            <Currency value={annualLimit} className="text-xl font-bold text-foreground" />
                        </div>
                    </div>

                    <div className="p-4 border border-border rounded-xl flex items-center justify-between gap-4">
                        <div>
                            <label htmlFor="hsa-contributed" className="text-sm font-medium text-foreground">Already contributed (or set up to contribute)?</label>
                            <p className="text-xs text-muted-foreground">Includes employer contributions</p>
                        </div>
                        <div className="relative w-32 shrink-0">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>$</span>
                            <input
                                id="hsa-contributed"
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
                                    Contact your provider to withdraw the excess before tax day to avoid a 6% penalty.
                                </p>
                            </div>
                        </div>
                    )}

                    {!isMaxed && !isOverContributed && (
                        <RecommendationBlock
                            amount={recommended}
                            benefit={
                                <span>
                                    <span className="block font-mono tabular text-base font-bold text-success">≈ ${annualTaxSavings.toLocaleString()} saved</span>
                                    estimated tax reduction this year
                                </span>
                            }
                            math={[
                                { label: `${selectedYear} HSA limit (${coverageType === 'self' ? 'self-only' : 'family'})`, value: `$${annualLimit.toLocaleString()}` },
                                { label: "Already contributed", value: `− $${alreadyContributed.toLocaleString()}` },
                                { label: `Months left in ${selectedYear}`, value: `÷ ${monthsRemaining}` },
                                { label: "Monthly to hit the max", value: `$${aggressiveMonthly.toLocaleString()}`, total: true },
                                { label: "Your free budget (the cap)", value: `$${remainingBudget.toLocaleString()}` },
                                { label: `Tax saved: $${remainingToMax.toLocaleString()} × ${Math.round(combinedRate * 1000) / 10}%`, value: `≈ $${annualTaxSavings.toLocaleString()}` },
                            ]}
                            assumptions={`Assumes the ${ASSUMPTIONS.marginalFederalRate.value * 100}% federal bracket plus ${ASSUMPTIONS.ficaRate.value * 100}% FICA (payroll HSA contributions avoid both). The steady-pace alternative is $${standardMonthly.toLocaleString()}/mo across a full year.`}
                            source={{ ...yearMeta.sources.hsa, projected: yearMeta.status === "projected" }}
                        >
                            {canLumpSum ? (
                                <button
                                    onClick={() => {
                                        setProfileBase({ excessCash: excessCash - remainingToMax });
                                        useFinancialStore.getState().addActionItem({
                                            id: 'hsa-lump-sum',
                                            stepId: 'hsa',
                                            label: `Transfer $${remainingToMax.toLocaleString()} from Savings to HSA`
                                        });
                                        setStepPhase("strategy");
                                    }}
                                    className="w-full p-4 bg-success text-success-foreground rounded-2xl transition-all hover:brightness-110 active:scale-[0.99] font-bold text-base flex items-center justify-center gap-2"
                                >
                                    Fund <Currency value={remainingToMax} className="font-bold" perClassName="text-success-foreground/70" /> now from surplus cash
                                    <ArrowRight className="w-5 h-5" aria-hidden />
                                </button>
                            ) : (
                                <button
                                    onClick={confirmAllocation}
                                    disabled={recommended <= 0}
                                    className="w-full p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50 font-bold text-base"
                                >
                                    Allocate <Currency value={recommended} per="mo" className="font-bold" perClassName="text-primary-foreground/70" />
                                </button>
                            )}
                            <button
                                onClick={() => nextStep()}
                                className="mx-auto text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground rounded"
                            >
                                Skip this step
                            </button>
                        </RecommendationBlock>
                    )}

                    {isMaxed && (
                        <button
                            onClick={() => nextStep()}
                            className="w-full p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 active:scale-[0.99] font-bold text-lg flex items-center justify-center gap-2"
                        >
                            Next step <ArrowRight className="w-5 h-5" aria-hidden />
                        </button>
                    )}
                </div>
            </ConversationalCard>
        );
    }

    return (
        <ConversationalCard
            title="The shoebox strategy"
            description="Your HSA is now a stealth retirement account. Do not spend it on Tylenol yet."
            icon={Receipt}
            mode="advice"
        >
            <div className="space-y-6">
                <div className="space-y-4">
                    {[
                        {
                            icon: CalendarClock,
                            head: "1. Pay cash now",
                            body: "Cover medical costs out of pocket if you can afford it, and let the HSA compound untouched.",
                        },
                        {
                            icon: Cloud,
                            head: "2. Keep a digital shoebox",
                            body: "Save every EOB and receipt to Google Drive, iCloud, or Dropbox. Label the folder \"HSA receipts\". They never expire.",
                        },
                        {
                            icon: Receipt,
                            head: "3. Reimburse yourself later",
                            body: "In 20 years, reimburse yourself for that old MRI, tax-free. A lifetime emergency fund, built from receipts.",
                        },
                    ].map(({ icon: Icon, head, body }) => (
                        <div key={head} className="flex gap-3 items-start">
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                                <Icon className="w-4 h-4" aria-hidden />
                            </span>
                            <div>
                                <h4 className="font-bold text-foreground">{head}</h4>
                                <p className="text-sm text-muted-foreground">{body}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => {
                        useFinancialStore.getState().addActionItem({
                            id: 'hsa-shoebox',
                            stepId: 'hsa',
                            label: 'Set up a cloud folder for medical receipts'
                        });
                        nextStep();
                    }}
                    className="w-full p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 active:scale-[0.99] font-bold flex items-center justify-center gap-2"
                >
                    Strategy locked. Next <ArrowRight className="w-5 h-5" aria-hidden />
                </button>
            </div>
        </ConversationalCard>
    );
}
