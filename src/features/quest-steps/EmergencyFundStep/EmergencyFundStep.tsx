"use client";

import { useState, useEffect } from "react";
import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { RecommendationBlock } from "@/shared/ui/RecommendationBlock/RecommendationBlock";
import { Currency } from "@/shared/ui/Currency/Currency";
import { ArrowRight, ShieldCheck, AlertTriangle, Castle, Check, Rocket } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { JargonTerm } from "@/shared/ui/JargonTerm/JargonTerm";

interface EmergencyFundStepProps {
    mode?: "starter" | "full";
}

export function EmergencyFundStep({ mode = "starter" }: EmergencyFundStepProps) {
    const { profile, setProfileBase, nextStep } = useFinancialStore();
    const [stepPhase, setStepPhase] = useState<"ask-amount" | "ask-stability" | "advice">(() => {
        if (mode === 'full' && profile.emergencyFundAmount > 0) {
            return 'ask-stability';
        }
        return 'ask-amount';
    });
    // Raw digits only: a comma-formatted prefill is rejected by <input type="number">
    // and renders an empty field that still submits its hidden value.
    const [currentSavings, setCurrentSavings] = useState(
        profile.emergencyFundAmount > 0
            ? String(profile.emergencyFundAmount)
            : ""
    );

    const [isStable, setIsStable] = useState(true);
    const [showAdvice, setShowAdvice] = useState(false);
    const [isHysaLocal, setIsHysaLocal] = useState(() => profile.isHysa);

    const [sliderMonths, setSliderMonths] = useState(3);

    const starterTarget = profile.monthlyExpenses * 1;

    const derivedVal = parseFloat(currentSavings.replace(/,/g, "")) || 0;
    // Must track the SAME target the user sees (the slider), or the stored surplus
    // contradicts the on-screen numbers and later steps lump-sum the wrong cash.
    const derivedTarget = mode === "starter" ? starterTarget : profile.monthlyExpenses * sliderMonths;
    const derivedExcess = Math.max(0, derivedVal - derivedTarget);

    const parsedSavings = parseFloat(currentSavings.replace(/,/g, ""));
    const savingsInputValid = currentSavings.trim() !== "" && !isNaN(parsedSavings) && parsedSavings >= 0;

    useEffect(() => {
        if (showAdvice) {
            if (derivedExcess !== profile.excessCash) {
                setProfileBase({ excessCash: derivedExcess });
            }
        }
    }, [showAdvice, derivedExcess, profile.excessCash, setProfileBase]);

    const titleText = mode === "starter" ? "The safety net" : "The fortress";
    const StepIcon = mode === "starter" ? ShieldCheck : Castle;

    const descriptionText = mode === "starter"
        ? (
            <span>
                Before anything gets invested, one month of expenses (<Currency value={starterTarget} className="text-base font-bold text-foreground" />)
                sits in CASH. Not invested, just there. How much cash do you have saved?
            </span>
        )
        : (
            <span>
                You noted <Currency value={profile.emergencyFundAmount} className="text-base font-bold text-foreground" /> saved.
                Financial peace means 3-6 months of expenses. What is your TOTAL emergency savings now?
            </span>
        );

    const handleSubmitAmount = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === "full") {
            setStepPhase("ask-stability");
        } else {
            finishStep();
        }
    };

    const handleStability = (stable: boolean) => {
        setIsStable(stable);
        const defaultMonths = stable ? 3 : 6;
        setSliderMonths(defaultMonths);
        setProfileBase({ emergencyFundMonths: defaultMonths });
        setStepPhase("advice");
        finishStep();
    };

    const finishStep = () => {
        const val = parseFloat(currentSavings.replace(/,/g, ""));
        if (!isNaN(val)) {
            setProfileBase({
                emergencyFundAmount: val,
                isHysa: isHysaLocal
            });
            setShowAdvice(true);
        }
    };

    if (stepPhase === "ask-stability" && mode === "full") {
        return (
            <ConversationalCard
                title="Risk assessment"
                description="How stable is your household income? (Tenured job vs freelance or commission.)"
                icon={Castle}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={() => handleStability(true)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-success hover:bg-success/10 transition-all text-left">
                        <div className="font-bold text-lg mb-1 text-foreground">Very stable</div>
                        <div className="text-sm text-muted-foreground">My income is predictable and unlikely to stop.</div>
                    </button>
                    <button onClick={() => handleStability(false)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-warning hover:bg-warning/10 transition-all text-left">
                        <div className="font-bold text-lg mb-1 text-foreground">Variable / risky</div>
                        <div className="text-sm text-muted-foreground">Self-employed, commission-based, or a volatile industry.</div>
                    </button>
                </div>
            </ConversationalCard>
        );
    }

    if (showAdvice) {
        const val = parseFloat(currentSavings.replace(/,/g, ""));
        const finalTarget = mode === "starter"
            ? starterTarget
            : profile.monthlyExpenses * sliderMonths;

        const isFunded = val >= finalTarget;
        const currentStepId = mode === "starter" ? "emergency-fund" : "emergency-fund-full";
        const remainingBudget = useFinancialStore.getState().getRemainingBudget();

        const shortage = Math.max(0, finalTarget - val);
        const excess = Math.max(0, val - finalTarget);
        const allocationAmount = Math.min(remainingBudget, shortage);
        const monthsToGoal = allocationAmount > 0 ? Math.ceil(shortage / allocationAmount) : 0;

        const handleAllocate = () => {
            if (allocationAmount > 0) {
                useFinancialStore.getState().setAllocation(currentStepId, allocationAmount);
                const durationText = monthsToGoal > 0 ? ` for ${monthsToGoal} months` : '';
                useFinancialStore.getState().addActionItem({
                    id: `emergency-fund-transfer-${mode}`,
                    stepId: currentStepId,
                    label: `Set up auto-transfer of $${allocationAmount.toLocaleString()}/mo to Savings${durationText} (${mode === 'starter' ? 'Starter' : 'Full'})`
                });
            }
            nextStep();
        };

        const handleSkip = () => {
            if (!isHysaLocal && !isFunded) {
                useFinancialStore.getState().addActionItem({
                    id: 'open-hysa',
                    stepId: currentStepId,
                    label: 'Open High Yield Savings Account (HYSA)'
                });
            }
            if (isFunded && !isHysaLocal && mode === 'starter') {
                useFinancialStore.getState().addActionItem({
                    id: 'move-to-hysa',
                    stepId: currentStepId,
                    label: 'Move Emergency Fund to High Yield Savings Account (HYSA)'
                });
            }
            nextStep();
        };

        let title: string;
        let description: React.ReactNode;

        if (isFunded) {
            title = mode === "starter" ? "Safety net: secured" : "Fortress: built";
            description = mode === "starter"
                ? "One month of cash means a surprise bill stays a bill instead of becoming debt."
                : `Fully funded for ${sliderMonths} months of expenses. That is real freedom of mind.`;
        } else {
            title = mode === "starter" ? "Danger zone" : "Keep building";
            description = mode === 'starter'
                ? (
                    <span>
                        You are short by <Currency value={shortage} className="text-base font-bold text-destructive" />. Before any match
                        or debt payoff, this cash comes first.
                    </span>
                )
                : (
                    <span>
                        Your target is {sliderMonths} months (<Currency value={finalTarget} className="text-base font-bold text-foreground" />);
                        we recommend {isStable ? 3 : 6} for your risk profile. You are short{" "}
                        <Currency value={shortage} className="text-base font-bold text-warning" />.
                    </span>
                );
        }

        return (
            <ConversationalCard
                title={title}
                description={description}
                icon={isFunded ? StepIcon : AlertTriangle}
                mode="advice"
            >
                <div className="space-y-5">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium text-muted-foreground">
                            <span>Saved: <Currency value={val} className="text-sm text-foreground" /></span>
                            <span>Target ({mode === 'starter' ? '1 mo' : `${sliderMonths} mo`}): <Currency value={finalTarget} className="text-sm text-foreground" /></span>
                        </div>
                        <div
                            className="w-full bg-secondary rounded-full h-3.5 overflow-hidden border border-border"
                            role="progressbar"
                            aria-valuenow={Math.min(100, Math.round((val / Math.max(1, finalTarget)) * 100))}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label="Emergency fund progress"
                        >
                            <div
                                className={cn("h-full rounded-full transition-all duration-700 ease-out",
                                    isFunded ? "bg-success" : "bg-warning"
                                )}
                                style={{ width: `${Math.min((val / Math.max(1, finalTarget)) * 100, 100)}%` }}
                            />
                        </div>
                    </div>

                    {mode === 'full' && (
                        <div className="p-4 bg-secondary/50 border border-border rounded-xl space-y-3">
                            <div className="flex justify-between items-center">
                                <label htmlFor="ef-months" className="text-sm font-bold text-foreground">Risk comfort level</label>
                                <span className="text-lg font-bold text-primary font-mono tabular">{sliderMonths} months</span>
                            </div>
                            <input
                                id="ef-months"
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
                                className="w-full h-2 cursor-pointer"
                            />
                            <p className="text-xs text-muted-foreground">
                                We recommend {isStable ? 3 : 6} months. Go up to 24 (<Currency value={profile.monthlyExpenses * 24} className="text-xs" />) if extra safety helps you sleep.
                            </p>
                        </div>
                    )}

                    {isFunded && excess > 0 && (
                        <div className="p-4 rounded-xl border border-success/40 bg-success/10 flex gap-3">
                            <Rocket className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                            <p className="text-sm text-foreground/90">
                                <strong className="text-success">Surplus detected:</strong> you hold{" "}
                                <Currency value={excess} className="text-sm font-bold text-foreground" /> above the target.
                                The quest will offer to lump-sum it into investments in the steps ahead.
                            </p>
                        </div>
                    )}

                    {!isFunded && (
                        remainingBudget > 0 ? (
                            <RecommendationBlock
                                amount={allocationAmount}
                                benefit={<span>Reaches your target in <strong className="text-foreground">{monthsToGoal} {monthsToGoal === 1 ? "month" : "months"}</strong>.</span>}
                                math={[
                                    { label: `Target: ${mode === 'starter' ? 1 : sliderMonths} × $${profile.monthlyExpenses.toLocaleString()} expenses`, value: `$${finalTarget.toLocaleString()}` },
                                    { label: "Already saved", value: `− $${val.toLocaleString()}` },
                                    { label: "Shortage", value: `$${shortage.toLocaleString()}` },
                                    { label: "Your free budget (the cap)", value: `$${remainingBudget.toLocaleString()}` },
                                    { label: "Monthly transfer", value: `$${allocationAmount.toLocaleString()}`, total: true },
                                ]}
                                assumptions="Keep it liquid. A HYSA pays 4-5% and stays FDIC insured; the stock market is not the place for this money."
                            >
                                <button
                                    onClick={handleAllocate}
                                    className="w-full p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 active:scale-[0.99] font-bold flex items-center justify-center gap-2"
                                >
                                    Allocate <Currency value={allocationAmount} per="mo" className="font-bold" perClassName="text-primary-foreground/70" />
                                    {monthsToGoal > 0 && <span className="font-medium text-primary-foreground/80">for {monthsToGoal} mo</span>}
                                    <ArrowRight className="w-5 h-5" aria-hidden />
                                </button>
                                <button
                                    onClick={handleSkip}
                                    className="mx-auto text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground rounded"
                                >
                                    I cannot fund this right now
                                </button>
                            </RecommendationBlock>
                        ) : (
                            <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-sm text-foreground/90">
                                Your budget has <strong className="text-destructive">$0 free</strong>, so this cannot be funded monthly yet.
                                The fix lives upstream: lower expenses or raise income, then rerun the quest.
                            </div>
                        )
                    )}

                    {!isFunded && remainingBudget > 0 && (
                        <p className="text-xs text-muted-foreground">
                            Where to keep it: a <JargonTerm term="HYSA" definition="High Yield Savings Account. A bank account paying 4-5% interest (vs 0.01% standard), FDIC insured, and completely liquid." /> beats a checking account by roughly 4% a year.
                        </p>
                    )}

                    {(isFunded || remainingBudget <= 0) && (
                        <button
                            onClick={handleSkip}
                            className={cn(
                                "w-full p-4 rounded-2xl transition-all font-bold flex items-center justify-center gap-2",
                                isFunded
                                    ? "bg-success text-success-foreground hover:brightness-110 active:scale-[0.99]"
                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            )}
                        >
                            {isFunded ? "Goal complete. Next" : "Understood. Next"} <ArrowRight className="w-5 h-5" aria-hidden />
                        </button>
                    )}
                </div>
            </ConversationalCard>
        );
    }

    return (
        <ConversationalCard
            title={titleText}
            description={descriptionText}
            icon={StepIcon}
        >
            <form onSubmit={handleSubmitAmount} className="flex flex-col gap-5">
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground font-medium" aria-hidden>$</span>
                    <input
                        type="number"
                        value={currentSavings}
                        onChange={(e) => setCurrentSavings(e.target.value)}
                        aria-label="Current cash savings in dollars"
                        className="w-full pl-10 pr-4 py-4 text-2xl font-mono tabular font-bold text-foreground bg-secondary rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        placeholder="0"
                        autoFocus
                    />
                </div>

                {mode === 'starter' && (
                    <button
                        type="button"
                        onClick={() => setIsHysaLocal(!isHysaLocal)}
                        aria-pressed={isHysaLocal}
                        className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl border border-border text-left hover:bg-secondary transition-colors"
                    >
                        <span className={cn("w-6 h-6 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors", isHysaLocal ? "bg-success border-success text-success-foreground" : "border-muted-foreground")}>
                            {isHysaLocal && <Check className="w-4 h-4" strokeWidth={3} aria-hidden />}
                        </span>
                        <span className="flex-1">
                            <span className="block font-medium text-sm text-foreground">Is this in a High Yield Savings Account (HYSA)?</span>
                            <span className="block text-xs text-muted-foreground">Earning 4-5% interest vs 0.01%</span>
                        </span>
                    </button>
                )}

                <button
                    type="submit"
                    disabled={!savingsInputValid}
                    className="w-full p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg flex items-center justify-center gap-2"
                >
                    Continue <ArrowRight className="w-5 h-5" aria-hidden />
                </button>
            </form>
        </ConversationalCard>
    );
}
