"use client";

import { useFinancialStore, resetFinancialQuest } from "@/entities/financial/model/financialStore";
import { AnimatePresence, motion } from "framer-motion";
import { FLOW_STEPS, getFlowStep, getPhase, getStepIndex } from "@/shared/config/flow";
import { PlanLedger } from "@/widgets/PlanLedger/PlanLedger";
import { YearSelectionStep } from "@/features/quest-steps/YearSelectionStep/YearSelectionStep";
import { IncomeStep } from "@/features/quest-steps/IncomeStep/IncomeStep";
import { BudgetStep } from "@/features/quest-steps/BudgetStep";
import { EmergencyFundStep } from "@/features/quest-steps/EmergencyFundStep/EmergencyFundStep";
import { EmployerMatchStep } from "@/features/quest-steps/EmployerMatchStep/EmployerMatchStep";
import { DebtStep } from "@/features/quest-steps/DebtStep/DebtStep";
import { HsaStep } from "@/features/quest-steps/HsaStep/HsaStep";
import { IraStep } from "@/features/quest-steps/IraStep/IraStep";
import { Max401kStep } from "@/features/quest-steps/Max401kStep/Max401kStep";
import { ModerateDebtStep } from "@/features/quest-steps/ModerateDebtStep/ModerateDebtStep";
import { GoalsStep } from "@/features/quest-steps/GoalsStep/GoalsStep";
import { MegaBackdoorStep } from "@/features/quest-steps/MegaBackdoorStep/MegaBackdoorStep";
import { TaxableStep } from "@/features/quest-steps/TaxableStep/TaxableStep";
import { EducationStep } from "@/features/quest-steps/EducationStep/EducationStep";
import { LowInterestDebtStep } from "@/features/quest-steps/LowInterestDebtStep/LowInterestDebtStep";

import { ArrowLeft, RefreshCcw, Trophy, Flag, Compass } from "lucide-react";

export function QuestFlow() {
    const { currentStep, goBack, history } = useFinancialStore();
    const canGoBack = history?.length > 0;

    const flowStep = getFlowStep(currentStep);
    const stepNumber = flowStep ? getStepIndex(currentStep) + 1 : null;
    const phase = flowStep ? getPhase(flowStep.phase) : null;

    return (
        <div className="w-full max-w-2xl mx-auto relative">
            <div className="flex justify-between items-center mb-4 px-2 min-h-[1.75rem]">
                {canGoBack ? (
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded"
                    >
                        <ArrowLeft className="w-4 h-4" aria-hidden /> Back
                    </button>
                ) : <div />}

                {flowStep && phase && (
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary bg-primary/10 border border-primary/25 rounded-full px-3 py-1">
                        {phase.name} · {stepNumber} of {FLOW_STEPS.length}
                    </span>
                )}

                {history.length > 0 ? (
                    <button
                        onClick={resetFinancialQuest}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors rounded"
                    >
                        <RefreshCcw className="w-3.5 h-3.5" aria-hidden /> Start over
                    </button>
                ) : <div />}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {currentStep === "year-selection" && <YearSelectionStep />}
                    {currentStep === "income" && <IncomeStep />}
                    {currentStep === "budget" && <BudgetStep />}
                    {currentStep === "emergency-fund" && <EmergencyFundStep mode="starter" />}
                    {currentStep === "match-employer" && <EmployerMatchStep />}
                    {currentStep === "debt-payoff" && <DebtStep />}
                    {currentStep === "emergency-fund-full" && <EmergencyFundStep mode="full" />}
                    {currentStep === "hsa" && <HsaStep />}
                    {currentStep === "ira" && <IraStep />}
                    {currentStep === "max-401k" && <Max401kStep />}
                    {currentStep === "moderate-debt" && <ModerateDebtStep />}
                    {currentStep === "goals" && <GoalsStep />}
                    {currentStep === "mega-backdoor" && <MegaBackdoorStep />}
                    {currentStep === "education" && <EducationStep />}
                    {currentStep === "low-interest-debt" && <LowInterestDebtStep />}
                    {currentStep === "taxable" && <TaxableStep />}

                    {currentStep === "budget-exhausted" && <FinaleCard variant="exhausted" />}
                    {currentStep === "completed" && <FinaleCard variant="completed" />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function FinaleCard({ variant }: { variant: "completed" | "exhausted" }) {
    const completed = variant === "completed";

    return (
        <div className="rounded-3xl border border-reward/40 bg-card p-6 sm:p-8 shadow-[0_24px_80px_-32px_hsl(var(--reward)/0.4)]">
            <div className="text-center mb-6">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-reward/50 bg-reward/15 text-reward">
                    {completed ? <Trophy className="h-6 w-6" aria-hidden /> : <Flag className="h-6 w-6" aria-hidden />}
                </span>
                <h2 className="font-display text-3xl font-bold text-foreground [text-wrap:balance] mb-2">
                    {completed ? "Quest complete." : "Every dollar deployed."}
                </h2>
                <p className="text-muted-foreground text-base max-w-md mx-auto">
                    {completed
                        ? "Every dollar of your budget has a job, in the right order. This is your plan."
                        : "You allocated everything your budget allows this year. Finding that limit is the win. This is your plan."}
                </p>
            </div>

            <PlanLedger className="mb-6" />

            <div className="rounded-2xl border border-border bg-secondary/40 p-4 mb-6 text-left">
                <h3 className="text-sm font-bold text-foreground mb-1">What happens now</h3>
                <p className="text-sm text-muted-foreground">
                    Execute the Action Board, one item at a time. Come back next year, when the
                    actions are done, or whenever your income changes.
                </p>
            </div>

            <div className="rounded-2xl border border-border p-4 mb-6 text-left">
                <div className="flex items-start gap-3">
                    <Compass className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Next quest:</span> saving is half the game.
                        When you are ready,{" "}
                        <a
                            href="https://retirement.melson.us/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-primary underline underline-offset-2 hover:no-underline"
                        >
                            learn how to draw income in retirement
                        </a>.
                    </p>
                </div>
            </div>

            <button
                onClick={resetFinancialQuest}
                className="mx-auto flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]"
            >
                <RefreshCcw className="w-4 h-4" aria-hidden /> Start a fresh run
            </button>
        </div>
    );
}
