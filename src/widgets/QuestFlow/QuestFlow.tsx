"use client";

import { useFinancialStore, resetFinancialQuest } from "@/entities/financial/model/financialStore";
import { AnimatePresence, motion } from "framer-motion";
import { YearSelectionStep } from "@/features/quest-steps/YearSelectionStep/YearSelectionStep";
import { IncomeStep } from "@/features/quest-steps/IncomeStep/IncomeStep";
import { BudgetStep } from "@/features/quest-steps/BudgetStep/BudgetStep";
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

import { ArrowLeft, RefreshCcw } from "lucide-react";

export function QuestFlow() {
    const { currentStep, goBack, history } = useFinancialStore();
    const canGoBack = history?.length > 0;

    return (
        <div className="w-full max-w-2xl mx-auto relative">
            {canGoBack && (
                <button
                    onClick={goBack}
                    className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors pl-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
            )}

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

                    {currentStep === "budget-exhausted" && (
                        <div className="p-8 bg-card border border-border rounded-[2rem] shadow-xl text-center">
                            <h2 className="text-3xl font-bold mb-4 text-primary">Mission Accomplished for This Year! 🏁</h2>
                            <p className="text-muted-foreground text-lg mb-6">
                                You have successfully allocated every dollar of your available budget.
                                <br />
                                <strong>You found the limit of what is possible right now, and that is a win.</strong>
                            </p>

                            <div className="bg-secondary/50 p-6 rounded-xl mb-8 text-left">
                                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                    <span className="text-2xl">📋</span> Your Game Plan
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    You have a clear list of <strong>Action Items</strong> on the right.
                                    Execute them one by one. That is your path forward.
                                </p>
                                <p className="text-sm border-t border-border pt-4 text-muted-foreground">
                                    <strong>When to return?</strong> Come back next year, when all tasks are done, or whenever your income increases.
                                </p>
                            </div>

                            <button onClick={resetFinancialQuest} className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto">
                                <RefreshCcw className="w-4 h-4" /> Start Fresh
                            </button>
                        </div>
                    )}

                    {currentStep === "completed" && (
                        <div className="p-8 bg-card border border-border rounded-[2rem] shadow-xl text-center">
                            <h2 className="text-3xl font-bold mb-4 text-primary">Quest Complete! 🚀</h2>
                            <p className="text-muted-foreground text-lg mb-6">
                                You have allocated every dollar of your budget wisely.
                                You are on the path to Financial Independence.
                            </p>
                            <button onClick={resetFinancialQuest} className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity">
                                Start Over
                            </button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
