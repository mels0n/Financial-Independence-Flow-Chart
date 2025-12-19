"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { ArrowRight, Receipt, PiggyBank, CalendarClock, Cloud } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";

export function HsaStep() {
    const { profile, setProfileBase, nextStep, setAllocation, selectedYear, getRemainingBudget } = useFinancialStore();
    const [stepPhase, setStepPhase] = useState<"intro" | "ask-eligible" | "calc" | "strategy">("intro");
    const [alreadyContributed, setAlreadyContributed] = useState(0);

    // Constants
    const LIMIT_FAMILY_2025 = 8550;
    const LIMIT_SELF_2025 = 4300;
    const LIMIT_FAMILY_2026 = 8750; // Projected
    const LIMIT_SELF_2026 = 4400; // Projected

    const limitSelf = selectedYear === '2026' ? LIMIT_SELF_2026 : LIMIT_SELF_2025;
    const limitFamily = selectedYear === '2026' ? LIMIT_FAMILY_2026 : LIMIT_FAMILY_2025;

    const [coverageType, setCoverageType] = useState<"self" | "family">("self");

    // Date Logic
    const today = new Date();
    const currentYear = today.getFullYear();
    const targetYear = parseInt(selectedYear);
    const currentMonth = today.getMonth(); // 0 = Jan, 11 = Dec

    // If we are planning for a future year, we have 12 months.
    // If we are planning for the current year, we have remaining months.
    const isFutureYear = targetYear > currentYear;
    const monthsRemaining = isFutureYear ? 12 : Math.max(1, 12 - currentMonth);

    const annualLimit = coverageType === 'self' ? limitSelf : limitFamily;
    const remainingToMax = Math.max(0, annualLimit - alreadyContributed);

    // Monthly max based on REMAINING space vs REMAINING time
    const aggressiveMonthly = Math.round(remainingToMax / monthsRemaining);
    // Standard monthly is just annual / 12 (informational)
    const standardMonthly = Math.round(annualLimit / 12);

    const remainingBudget = getRemainingBudget();
    const recommended = Math.min(remainingBudget, aggressiveMonthly);

    // Tax Savings Calc (Est 22% bracket + 7.65% FICA)
    const annualTaxSavings = Math.round(remainingToMax * 0.2965);

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

    // 1. Educational Intro
    if (stepPhase === "intro") {
        return (
            <ConversationalCard
                title="The Super Account 🦸‍♂️"
                description="Before we talk numbers, let's unlock a secret weapon."
            >
                <div className="space-y-6">
                    <p className="text-lg text-foreground">
                        Most people think an <strong>HSA (Health Savings Account)</strong> is just for paying doctors.
                    </p>
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                        <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                            <span className="text-2xl">🦄</span> It's actually a Tax Unicorn.
                        </h4>
                        <ul className="space-y-2 text-sm text-foreground">
                            <li className="flex gap-2">✅ <strong>Tax Deduction</strong> (Instant discount on taxes)</li>
                            <li className="flex gap-2">✅ <strong>Tax-Free Growth</strong> (Investments grow like an IRA)</li>
                            <li className="flex gap-2">✅ <strong>Tax-Free Withdrawal</strong> (For medical expenses)</li>
                        </ul>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        It is the <em>only</em> account in the US tax code with all three benefits. But you need a specific type of health insurance to open one.
                    </p>
                    <button
                        onClick={() => setStepPhase("ask-eligible")}
                        className="w-full p-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all font-bold text-lg flex items-center justify-center gap-2"
                    >
                        See if I qualify <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </ConversationalCard>
        );
    }

    if (stepPhase === "ask-eligible") {
        return (
            <ConversationalCard
                title="The Eligibility Check"
                description="Do you have a High Deductible Health Plan (HDHP)?"
            >
                <div className="space-y-6">
                    <p className="text-muted-foreground">
                        This usually means your insurance deductible is at least <strong>$1,600 (Self)</strong> or <strong>$3,200 (Family)</strong>.
                        <br /><br />
                        Commonly found in employer plans as the "low premium" option with an HSA attached.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handleEligible(true)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-xl font-bold text-foreground">Yes, I do</button>
                        <button onClick={() => handleEligible(false)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-border transition-all text-xl font-bold text-foreground">No / Not sure</button>
                    </div>
                </div>
            </ConversationalCard>
        );
    }

    if (stepPhase === "calc") {
        const isMaxed = remainingToMax <= 0;
        const isOverContributed = remainingToMax < 0;

        // Lump Sum Logic
        const excessCash = profile.excessCash || 0;
        const canLumpSum = !isMaxed && excessCash >= remainingToMax;

        const description = isMaxed
            ? `You have already hit the ${selectedYear} limit. Great job.`
            : isFutureYear
                ? `Planning for ${selectedYear}. You have the full 12 months.`
                : `It is month ${currentMonth + 1} of ${currentYear}. To hit the max, you need to sprint.`;

        return (
            <ConversationalCard
                title={isMaxed ? "You nailed it! 🎉" : "Max it out."}
                description={description}
            >
                <div className="space-y-6">
                    <div className="flex gap-4 p-4 bg-secondary rounded-xl items-center justify-between">
                        <div>
                            <label className="text-xs text-muted-foreground block mb-1">Coverage</label>
                            <select
                                value={coverageType}
                                onChange={(e) => setCoverageType(e.target.value as any)}
                                className="bg-transparent font-bold text-lg text-foreground border-b-2 border-primary focus:outline-none cursor-pointer"
                            >
                                <option value="self" className="text-black dark:text-white bg-white dark:bg-slate-900">Self Only</option>
                                <option value="family" className="text-black dark:text-white bg-white dark:bg-slate-900">Family Plan</option>
                            </select>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground">Annual Limit</div>
                            <div className="text-xl font-bold text-foreground">${annualLimit.toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Already Contributed Input */}
                    <div className="p-4 border border-border rounded-xl flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-foreground">Already contributed?</label>
                            <p className="text-xs text-muted-foreground">Includes employer match</p>
                        </div>
                        <div className="relative w-32">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <input
                                type="number"
                                value={alreadyContributed || ''}
                                onChange={(e) => setAlreadyContributed(Number(e.target.value))}
                                className={cn(
                                    "w-full pl-6 pr-3 py-2 bg-secondary rounded-lg font-bold text-right focus:outline-none focus:ring-2",
                                    isOverContributed ? "text-red-500 border-red-500 ring-red-500 focus:ring-red-500" : "focus:ring-primary/50"
                                )}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {isOverContributed && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                            <div className="text-2xl">🚨</div>
                            <div>
                                <h4 className="font-bold text-red-800 dark:text-red-200">Over-Contribution Warning</h4>
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    You have exceeded the limit by <strong>${Math.abs(remainingToMax).toLocaleString()}</strong>.
                                    You must contact your provider to withdraw this "excess contribution" before tax day to avoid a 6% penalty.
                                </p>
                            </div>
                        </div>
                    )}

                    {!isMaxed && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-border rounded-xl text-center opacity-70">
                                    <div className="text-sm text-muted-foreground mb-1">Standard / Month</div>
                                    <div className="text-xl font-bold text-foreground">${standardMonthly}</div>
                                </div>
                                <div className="p-4 border border-primary/30 bg-primary/5 rounded-xl text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-primary text-[10px] text-primary-foreground px-2 py-0.5 rounded-bl-lg">CATCH UP</div>
                                    <div className="text-sm text-muted-foreground mb-1">To Max by Dec 31</div>
                                    <div className="text-2xl font-bold text-primary">${aggressiveMonthly}</div>
                                </div>
                            </div>

                            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-xl">
                                <div className="flex gap-2 items-center mb-2">
                                    <PiggyBank className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    <span className="font-bold text-emerald-800 dark:text-emerald-300">Potential Tax Savings</span>
                                </div>
                                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                                    Maxing the <strong>remaining ${remainingToMax.toLocaleString()}</strong> could save you approx <strong>${annualTaxSavings.toLocaleString()}</strong> immediately.
                                </p>
                            </div>
                        </>
                    )}

                    <div className="flex flex-col gap-2">
                        {isMaxed ? (
                            <button
                                onClick={() => nextStep()}
                                className="w-full p-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all font-bold text-lg"
                            >
                                Awesome. Next Step <ArrowRight className="inline w-5 h-5 ml-2" />
                            </button>
                        ) : (
                            <>
                                {canLumpSum ? (
                                    <button
                                        onClick={() => {
                                            // Deduct from excess cash?
                                            setProfileBase({ excessCash: excessCash - remainingToMax });
                                            useFinancialStore.getState().addActionItem({
                                                id: 'hsa-lump-sum',
                                                stepId: 'hsa',
                                                label: `Transfer $${remainingToMax.toLocaleString()} from Savings to HSA`
                                            });
                                            setStepPhase("strategy");
                                        }}
                                        className="w-full p-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all font-bold text-lg flex items-center justify-center gap-2"
                                    >
                                        <div className="text-left">
                                            <div className="text-xs opacity-90 uppercase tracking-wider">Lump Sum Available</div>
                                            <div>Fund ${remainingToMax.toLocaleString()} from Savings</div>
                                        </div>
                                        <ArrowRight className="w-6 h-6" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={confirmAllocation}
                                        className="w-full p-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all font-bold text-lg"
                                    >
                                        Allocate ${recommended.toLocaleString()}/mo
                                    </button>
                                )}
                                <p className="text-xs text-center text-muted-foreground">
                                    Based on remaining budget: ${remainingBudget.toLocaleString()}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </ConversationalCard>
        );
    }

    return (
        <ConversationalCard
            title="The 'Shoebox' Strategy 📑"
            description="The HSA is the only account that is Triple Tax Advantaged. Don't spend it on Tylenol yet."
            mode="advice"
        >
            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 mt-1">
                            <CalendarClock className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground">1. Pay with Cash Now</h4>
                            <p className="text-sm text-muted-foreground">Pay for medical expenses out of pocket if you can afford it. Let your HSA grow tax-free like an IRA.</p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-start">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 mt-1">
                            <Cloud className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground">2. Digital Shoebox</h4>
                            <p className="text-sm text-muted-foreground">
                                Save every EOB and receipt to <strong>Google Drive, iCloud, or Dropbox</strong>.
                                Label them "HSA Receipts". They never expire.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-start">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 mt-1">
                            <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground">3. Reimburse Yourself Later</h4>
                            <p className="text-sm text-muted-foreground">
                                In 20 years, when you need cash, "reimburse" yourself for that MRI from 2025 tax-free.
                                You basically get a tax-free emergency fund for life.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => {
                        // Add Action Item for offline task
                        if (typeof useFinancialStore.getState().addActionItem === 'function') {
                            useFinancialStore.getState().addActionItem({
                                id: 'hsa-shoebox',
                                stepId: 'hsa',
                                label: 'Set up Google Drive folder for Medical Receipts'
                            });
                        }
                        nextStep();
                    }}
                    className="w-full p-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all font-medium flex items-center justify-center gap-2"
                >
                    Got it. Strategy Locked. <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </ConversationalCard>
    );
}
