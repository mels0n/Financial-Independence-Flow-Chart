"use client";

import { useState, useEffect } from "react";
import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { ArrowRight, ShieldCheck, AlertTriangle, Battery, BatteryFull, CheckCircle2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { JargonTerm } from "@/shared/ui/JargonTerm/JargonTerm";

interface EmergencyFundStepProps {
    mode?: "starter" | "full";
}

export function EmergencyFundStep({ mode = "starter" }: EmergencyFundStepProps) {
    const { profile, setProfileBase, nextStep } = useFinancialStore();
    const [stepPhase, setStepPhase] = useState<"ask-amount" | "ask-stability" | "advice">(() => {
        // If we already have a value from a previous step (Starter), skip asking again for Full
        if (mode === 'full' && profile.emergencyFundAmount > 0) {
            return 'ask-stability';
        }
        return 'ask-amount';
    });
    // Pre-fill if they already entered an amount in a previous step
    const [currentSavings, setCurrentSavings] = useState(
        profile.emergencyFundAmount > 0
            ? profile.emergencyFundAmount.toLocaleString()
            : ""
    );
    // Ensure we sync with profile if coming back to this step
    useEffect(() => {
        if (!currentSavings && profile.emergencyFundAmount > 0) {
            setCurrentSavings(profile.emergencyFundAmount.toLocaleString());
        }
    }, [profile.emergencyFundAmount]);

    const [isStable, setIsStable] = useState(true);
    const [showAdvice, setShowAdvice] = useState(false);

    // For now, simple input.
    const [isHysaLocal, setIsHysaLocal] = useState(profile.isHysa);

    // Initial load sync
    useEffect(() => {
        setIsHysaLocal(profile.isHysa);
    }, [profile.isHysa]);

    // Dynamic Target Logic
    // Starter = 1 month always
    // Full = Sliding Scale (Default 3 or 6)
    const [sliderMonths, setSliderMonths] = useState(3);

    const starterTarget = profile.monthlyExpenses * 1;
    const fullTarget3 = profile.monthlyExpenses * 3;
    const fullTarget6 = profile.monthlyExpenses * 6;

    // If starter, target is fixed. If full, it depends on isStable (default true initially)
    const target = mode === "starter"
        ? starterTarget
        : (isStable ? fullTarget3 : fullTarget6);

    // Recalculate derived values for effect
    const derivedVal = parseFloat(currentSavings.replace(/,/g, "")) || 0;
    const derivedTarget = mode === "starter" ? starterTarget : (isStable ? fullTarget3 : fullTarget6);
    const derivedExcess = Math.max(0, derivedVal - derivedTarget);

    // Sync Excess Cash - MOVED TO TOP LEVEL
    useEffect(() => {
        if (showAdvice) {
            if (derivedExcess !== profile.excessCash) {
                setProfileBase({ excessCash: derivedExcess });
            }
        }
    }, [showAdvice, derivedExcess, profile.excessCash, setProfileBase]);

    const titleText = mode === "starter" ? "Safety Net 🕸️" : "Fortress of Solitude 🏰";

    const descriptionText = mode === "starter"
        ? `Before we invest, let's make sure you won't crash. Do you have at least 1 month of expenses ($${starterTarget.toLocaleString()}) in CASH savings?`
        : `You previously noted $${profile.emergencyFundAmount.toLocaleString()} saved. To reach financial peace, we need 3-6 months of expenses. What is your TOTAL emergency savings now?`;

    const handleSubmitAmount = (e: React.FormEvent) => {
        e.preventDefault();
        // If mode is FULL, we first need to ask about stability BEFORE showing advice/target
        // Or we can just capture the amount first, then ask stability?
        // Let's capture amount.
        if (mode === "full") {
            setStepPhase("ask-stability");
        } else {
            // Starter mode doesn't need stability check
            finishStep();
        }
    };

    const handleStability = (stable: boolean) => {
        setIsStable(stable);
        // Default Slider based on stability
        const defaultMonths = stable ? 3 : 6;
        setSliderMonths(defaultMonths);

        // Update store with preference
        setProfileBase({ emergencyFundMonths: defaultMonths });

        // Now we can calculate target and show advice
        setStepPhase("advice");
        finishStep(stable);
    };

    const finishStep = (stableOverride?: boolean) => {
        const val = parseFloat(currentSavings.replace(/,/g, ""));
        if (!isNaN(val)) {
            // Save Amount AND HYSA status
            setProfileBase({
                emergencyFundAmount: val,
                isHysa: isHysaLocal
            });
            setShowAdvice(true);
        }
    };

    const handleNext = () => {
        nextStep();
    };

    // 1. Stability Check (Only for Full Mode)
    if (stepPhase === "ask-stability" && mode === "full") {
        return (
            <ConversationalCard
                title="Risk Assessment 🎲"
                description="How stable is your household income? (e.g., tenured job vs. freelancer/commission)"
            >
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleStability(true)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-emerald-500 hover:bg-emerald-500/10 transition-all text-left">
                        <div className="font-bold text-lg mb-1">Very Stable</div>
                        <div className="text-sm text-muted-foreground">My income is predictable and unlikely to stop.</div>
                    </button>
                    <button onClick={() => handleStability(false)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-amber-500 hover:bg-amber-500/10 transition-all text-left">
                        <div className="font-bold text-lg mb-1">Variable / Risky</div>
                        <div className="text-sm text-muted-foreground">I'm self-employed, commission-based, or in a volatile industry.</div>
                    </button>
                </div>
            </ConversationalCard>
        );
    }

    // 2. Advice / Result
    if (showAdvice) {
        const val = parseFloat(currentSavings.replace(/,/g, ""));

        // Use sliderMonths for Full mode
        const finalTarget = mode === "starter"
            ? starterTarget
            : profile.monthlyExpenses * sliderMonths;

        const isFunded = val >= finalTarget;
        const currentStepId = mode === "starter" ? "emergency-fund" : "emergency-fund-full";
        const remainingBudget = useFinancialStore.getState().getRemainingBudget();

        // Calculate gap
        const shortage = Math.max(0, finalTarget - val);
        const excess = Math.max(0, val - finalTarget);

        // Calculate cap: Don't allocate more than the shortage itself (1 month payoff)
        // or the remaining budget, whichever is smaller.
        const allocationAmount = Math.min(remainingBudget, shortage);

        // Calculate weeks/months
        const monthsToGoal = allocationAmount > 0 ? Math.ceil(shortage / allocationAmount) : 0;

        const handleAllocate = () => {
            if (allocationAmount > 0) {
                useFinancialStore.getState().setAllocation(currentStepId, allocationAmount);

                const durationText = monthsToGoal > 0 ? ` for ${monthsToGoal} months` : '';

                // Add Action Item to actually do it
                useFinancialStore.getState().addActionItem({
                    id: `emergency-fund-transfer-${mode}`, // Unique ID per mode
                    label: `Set up auto-transfer of $${allocationAmount.toLocaleString()}/mo to Savings${durationText} (${mode === 'starter' ? 'Starter' : 'Full'})`
                });
            }
            nextStep();
        };

        const handleSkip = () => {
            // Even if skipped, suggest opening a HYSA if they don't have one
            if (!isHysaLocal && !isFunded) {
                useFinancialStore.getState().addActionItem({
                    id: 'open-hysa',
                    label: 'Open High Yield Savings Account (HYSA)'
                });
            }
            // If they HAVE funds but it's NOT in a HYSA
            if (isFunded && !isHysaLocal && mode === 'starter') {
                useFinancialStore.getState().addActionItem({
                    id: 'move-to-hysa',
                    label: 'Move Emergency Fund to High Yield Savings Account (HYSA)'
                });
            }
            nextStep();
        };

        let title = "";
        let description = "";
        let icon = null;

        if (isFunded) {
            title = mode === "starter" ? "Safety Net Secured" : "Fortress Built";
            description = mode === "starter"
                ? "Excellent. having one month of cash prevents minor mishaps from becoming debt disasters."
                : `You are fully funded for ${isStable ? '3' : '6'} months of expenses. You have ultimate freedom of mind.`;
            icon = mode === "starter" ? <Battery className="w-12 h-12 text-emerald-500" /> : <BatteryFull className="w-12 h-12 text-primary" />;
        } else {
            // Underfunded
            title = mode === "starter" ? "Danger Zone" : "Keep Building";
            if (mode === 'starter') {
                description = `You are short by $${shortage.toLocaleString()}. Before getting any employer match or paying debt, you MUST save this cash.`;
            } else {
                // Dynamic description based on slider
                description = `Based on your risk profile, we recommend ${isStable ? '3' : '6'} months, but you have selected a target of ${sliderMonths} months ($${finalTarget.toLocaleString()}). You are short $${shortage.toLocaleString()}.`;
            }
            icon = <AlertTriangle className="w-12 h-12 text-orange-500" />;
        }

        return (
            <ConversationalCard
                title={title}
                description={description}
                mode="advice"
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-center py-4">
                        {icon}
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium text-muted-foreground">
                            <span>Current: ${val.toLocaleString()}</span>
                            <span>Target ({mode === 'starter' ? '1 mo' : `${sliderMonths} mo`}): ${finalTarget.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
                            <div
                                className={cn("h-full rounded-full transition-all duration-1000 ease-out",
                                    isFunded ? "bg-emerald-500" : "bg-orange-500"
                                )}
                                style={{ width: `${Math.min((val / finalTarget) * 100, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* SLIDER UI (Full Mode Only) */}
                    {mode === 'full' && (
                        <div className="p-4 bg-secondary/30 border border-border rounded-xl space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    🎚️ Risk Comfort Level
                                </label>
                                <span className="text-xl font-bold text-primary">{sliderMonths} Months</span>
                            </div>
                            <input
                                type="range"
                                min="3"
                                max="24"
                                step="1"
                                value={sliderMonths}
                                onChange={(e) => {
                                    const m = parseInt(e.target.value);
                                    setSliderMonths(m);
                                    setProfileBase({ emergencyFundMonths: m });
                                }}
                                className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-xs text-muted-foreground">
                                We recommend {isStable ? '3' : '6'} months, but you can adjust this up to 24 months ($ {(profile.monthlyExpenses * 24).toLocaleString()}) if you prefer extra safety.
                            </p>
                        </div>
                    )}

                    {isFunded && excess > 0 && (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded-xl">
                            <h4 className="font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2 mb-1">
                                🚀 Surplus Detected!
                            </h4>
                            <p className="text-sm text-emerald-800 dark:text-emerald-200">
                                You have <strong>${excess.toLocaleString()}</strong> in excess cash above your emergency fund.
                                We will use this to "Lump Sum" fund your investments in the next steps!
                            </p>
                        </div>
                    )}

                    {!isFunded && (
                        <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                            <h4 className="font-bold flex items-center gap-2 mb-2">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                The Plan
                            </h4>
                            <p className="text-sm text-foreground mb-3">
                                You have <strong>${remainingBudget.toLocaleString()}/mo</strong> available in your budget.
                            </p>
                            {remainingBudget > 0 ? (
                                <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        Allocating <strong>${allocationAmount.toLocaleString()}/mo</strong> will reach your goal in <strong>{monthsToGoal} months</strong> {monthsToGoal === 1 ? "(next month!)" : ""}.
                                    </p>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-blue-900 dark:text-blue-100 border border-blue-100 dark:border-blue-800">
                                        <strong>Pro Tip:</strong> Don't let this sit in a checking account. Put it in a <JargonTerm term="HYSA" definition="High Yield Savings Account. A bank account that pays 4-5% interest (vs 0.01% standard), is FDIC insured, and completely liquid." /> to fight inflation.
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-destructive">
                                    You have $0 budget left! You cannot fund this.
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        {!isFunded && remainingBudget > 0 ? (
                            <button
                                onClick={handleAllocate}
                                className="w-full p-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all font-medium flex items-center justify-center gap-2"
                            >
                                Allocate ${allocationAmount.toLocaleString()}/mo {monthsToGoal > 0 ? `(for ${monthsToGoal} mo)` : ''} <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSkip}
                                className={cn(
                                    "w-full p-4 rounded-2xl transition-all font-medium flex items-center justify-center gap-2",
                                    isFunded ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                )}
                            >
                                {isFunded ? "Goal Complete. Next" : "I cannot fund this right now. Skip"} <ArrowRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </ConversationalCard>
        );
    }

    // 0. Initial Ask Amount
    return (
        <ConversationalCard
            title={titleText}
            description={descriptionText}
        >
            <form onSubmit={handleSubmitAmount} className="flex flex-col gap-6">
                <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground font-medium">$</span>
                        <input
                            type="number"
                            value={currentSavings}
                            onChange={(e) => setCurrentSavings(e.target.value)}
                            className="w-full pl-10 pr-4 py-4 text-2xl font-bold text-foreground bg-secondary rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="0"
                            autoFocus
                        />
                    </div>
                </div>

                {mode === 'starter' && (
                    <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl border border-border cursor-pointer hover:bg-secondary transition-colors" onClick={() => setIsHysaLocal(!isHysaLocal)}>
                        <div className={cn("w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors", isHysaLocal ? "bg-emerald-500 border-emerald-500" : "border-muted-foreground")}>
                            {isHysaLocal && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">Is this in a High Yield Savings Account (HYSA)?</p>
                            <p className="text-xs text-muted-foreground">Earning 4-5% interest vs 0.01%</p>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full p-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex justify-center"
                >
                    <ArrowRight className="w-8 h-8" />
                </button>
            </form>
        </ConversationalCard>
    );
}
