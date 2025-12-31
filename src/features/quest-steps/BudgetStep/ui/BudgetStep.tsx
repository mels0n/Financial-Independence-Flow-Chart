"use client";

import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { ArrowRight, Calculator } from "lucide-react";
import { JargonTerm } from "@/shared/ui/JargonTerm/JargonTerm";
import { useBudgetLogic } from "../model/useBudgetLogic";

export function BudgetStep() {
    const {
        mode,
        income,
        expenses,
        setExpenses,
        handleModeSelection,
        calculateEstimate,
        handleSubmit,
        nextStep,
        advice
    } = useBudgetLogic();

    if (mode === "ask") {
        return (
            <ConversationalCard
                title="The Real Talk."
                description={
                    <span>
                        Do you already know your total {" "}
                        <JargonTerm
                            term="monthly expenses"
                            definition={
                                <div className="space-y-2">
                                    <p className="font-bold border-b border-slate-700 pb-1 mb-2">Typically Includes:</p>
                                    <ul className="list-disc pl-4 space-y-1 text-slate-300">
                                        <li>Rent / Mortgage</li>
                                        <li>Food / Groceries</li>
                                        <li>Essential Utilities (Heat, Water)</li>
                                        <li>Income Expenses (Car, Internet)</li>
                                        <li>Health Care Premiums</li>
                                        <li>Minimum Debt Payments</li>
                                    </ul>
                                </div>
                            }
                        />
                        {" "} (Needs + Wants)?
                    </span>
                }
            >
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleModeSelection("yes")}
                        className="p-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-xl font-bold text-slate-700 dark:text-slate-200"
                    >
                        Yes, I track it
                    </button>
                    <button
                        onClick={() => handleModeSelection("no")}
                        className="p-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-xl font-bold text-slate-700 dark:text-slate-200"
                    >
                        No, I'm guessing
                    </button>
                </div>
            </ConversationalCard>
        );
    }

    if (mode === "guidance") {
        return (
            <ConversationalCard
                title="Let's Estimate."
                description="Without a budget, it's hard to win. But we can start with a 50/30/20 rule estimate."
            >
                <div className="space-y-4">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl">
                        <div className="flex gap-3 mb-2">
                            <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            <span className="font-bold text-indigo-900 dark:text-indigo-300">Quick Estimate</span>
                        </div>
                        <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-4">
                            Most people spend about 80% of what they make. We can use that as a placeholder for now.
                        </p>
                        <button
                            onClick={calculateEstimate}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Use ${(income * 0.8).toLocaleString()} (80% Estimate)
                        </button>
                    </div>

                    <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                        You can always come back and refine this later.
                    </p>
                </div>
            </ConversationalCard>
        );
    }

    if (mode === "input") {
        return (
            <ConversationalCard
                title="Monthly Expenses"
                description="What is the total money going OUT each month?"
            >
                <form onSubmit={handleSubmit} className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 font-medium">$</span>
                        <input
                            type="number"
                            value={expenses}
                            onChange={(e) => setExpenses(e.target.value)}
                            className="w-full pl-10 pr-4 py-4 text-2xl font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="2,000"
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!expenses}
                        className="p-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                    >
                        <ArrowRight className="w-8 h-8" />
                    </button>
                </form>
            </ConversationalCard>
        );
    }

    return (
        <ConversationalCard
            title={advice.sentiment}
            description={advice.message}
            mode="advice"
        >
            <div className="space-y-4">
                <div className="p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-primary/10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Monthly Income</span>
                        <span className="font-semibold dark:text-slate-200">${income.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Expenses</span>
                        <span className="font-semibold text-red-500">-${advice.numericExpenses.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
                    <div className="flex justify-between items-center">
                        <span className="text-slate-900 dark:text-white font-medium">Free Cash Flow</span>
                        <span className="font-bold text-primary text-xl flex items-center gap-1">
                            +${advice.disposable.toLocaleString()}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => nextStep()}
                    className="w-full p-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all font-medium flex items-center justify-center gap-2"
                >
                    Next: Emergency Fund <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </ConversationalCard>
    );
}
