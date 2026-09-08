"use client";

import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { Currency } from "@/shared/ui/Currency/Currency";
import { ArrowRight, Calculator, Receipt } from "lucide-react";
import { JargonTerm } from "@/shared/ui/JargonTerm/JargonTerm";
import { useBudgetLogic } from "../model/useBudgetLogic";
import { ASSUMPTIONS } from "@/shared/config/financial-constants";

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
                title="The real talk"
                description={
                    <span>
                        Do you already know your total {" "}
                        <JargonTerm
                            term="monthly expenses"
                            definition={
                                <div className="space-y-2">
                                    <p className="font-bold border-b border-border pb-1 mb-2">Typically includes:</p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>Rent / mortgage</li>
                                        <li>Food / groceries</li>
                                        <li>Essential utilities (heat, water)</li>
                                        <li>Recurring bills (car, internet)</li>
                                        <li>Health care premiums</li>
                                        <li>Minimum debt payments</li>
                                    </ul>
                                </div>
                            }
                        />
                        {" "} (needs + wants)?
                    </span>
                }
                icon={Receipt}
            >
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleModeSelection("yes")}
                        className="p-6 bg-card border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-lg font-bold text-foreground"
                    >
                        Yes, I track it
                    </button>
                    <button
                        onClick={() => handleModeSelection("no")}
                        className="p-6 bg-card border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-lg font-bold text-foreground"
                    >
                        No, I&apos;m guessing
                    </button>
                </div>
            </ConversationalCard>
        );
    }

    if (mode === "guidance") {
        return (
            <ConversationalCard
                title="Let's estimate"
                description="Hard to win without a budget, but the 50/30/20 rule gives us a solid opening move."
                icon={Calculator}
            >
                <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
                        <div className="flex items-center gap-2.5 mb-2">
                            <Calculator className="w-4 h-4 text-primary" aria-hidden />
                            <span className="font-bold text-foreground text-sm">Quick estimate</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Most people spend about {ASSUMPTIONS.expenseEstimateRatio.value * 100}% of what they make
                            (needs + wants under the 50/30/20 rule). We use that as a placeholder for now.
                        </p>
                        <button
                            onClick={calculateEstimate}
                            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold transition-all hover:brightness-110 active:scale-[0.99]"
                        >
                            Use <Currency value={income * ASSUMPTIONS.expenseEstimateRatio.value} className="font-bold" /> (80% estimate)
                        </button>
                    </div>

                    <p className="text-center text-sm text-muted-foreground">
                        You can always come back and refine this later.
                    </p>
                </div>
            </ConversationalCard>
        );
    }

    if (mode === "input") {
        return (
            <ConversationalCard
                title="Monthly expenses"
                description="Total money going OUT each month."
                icon={Receipt}
            >
                <form onSubmit={handleSubmit} className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground font-medium" aria-hidden>$</span>
                        <input
                            type="number"
                            value={expenses}
                            onChange={(e) => setExpenses(e.target.value)}
                            aria-label="Total monthly expenses in dollars"
                            className="w-full pl-10 pr-4 py-4 text-2xl font-mono tabular font-bold text-foreground bg-secondary rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            placeholder="2,000"
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!expenses}
                        aria-label="Continue"
                        className="p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowRight className="w-7 h-7" aria-hidden />
                    </button>
                </form>
            </ConversationalCard>
        );
    }

    return (
        <ConversationalCard
            title={advice.sentiment}
            description={advice.message}
            icon={Receipt}
            mode="advice"
        >
            <div className="space-y-4">
                <div className="p-4 rounded-xl border border-border bg-secondary/50">
                    <dl>
                        <div className="flex justify-between items-center mb-2">
                            <dt className="text-sm text-muted-foreground">Monthly income</dt>
                            <dd><Currency value={income} className="text-sm font-semibold text-foreground" /></dd>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <dt className="text-sm text-muted-foreground">Expenses</dt>
                            <dd><Currency value={-advice.numericExpenses} className="text-sm font-semibold text-destructive" /></dd>
                        </div>
                        <div className="h-px bg-border my-2.5" aria-hidden />
                        <div className="flex justify-between items-center">
                            <dt className="text-sm font-semibold text-foreground">Free cash flow</dt>
                            <dd>
                                <Currency
                                    value={advice.disposable}
                                    per="mo"
                                    className={`text-2xl font-bold ${advice.disposable > 0 ? "text-success" : advice.disposable < 0 ? "text-destructive" : "text-muted-foreground"}`}
                                />
                            </dd>
                        </div>
                    </dl>
                </div>

                <p className="text-xs text-muted-foreground">
                    This is the ammunition for every step ahead. Watch it stack up in the Quest Log.
                </p>

                <button
                    onClick={() => nextStep()}
                    className="w-full p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 active:scale-[0.99] font-bold flex items-center justify-center gap-2"
                >
                    Next: the safety net <ArrowRight className="w-5 h-5" aria-hidden />
                </button>
            </div>
        </ConversationalCard>
    );
}
