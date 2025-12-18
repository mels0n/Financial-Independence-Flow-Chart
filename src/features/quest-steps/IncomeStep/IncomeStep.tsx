"use client";

import { useState } from "react";
import { useFinancialStore, FilingStatus } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { ArrowRight, Users, User, ScrollText } from "lucide-react";

export function IncomeStep() {
    const { setProfileBase, nextStep } = useFinancialStore();
    const [stepPhase, setStepPhase] = useState<"status" | "income">("status");
    const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
    const [income, setIncome] = useState("");

    const handleStatusSelect = (status: FilingStatus) => {
        setFilingStatus(status);
        setStepPhase("income");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(income.replace(/,/g, ""));
        if (val > 0) {
            setProfileBase({
                monthlyIncome: val,
                filingStatus: filingStatus
            });
            nextStep();
        }
    };

    if (stepPhase === "status") {
        return (
            <ConversationalCard
                title="Tax Profile"
                description="To minimize your taxes, how will you be filing?"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => handleStatusSelect("single")}
                        className="p-6 bg-card border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                <User className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-lg text-foreground">Single</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Or Head of Household</p>
                    </button>

                    <button
                        onClick={() => handleStatusSelect("married_joint")}
                        className="p-6 bg-card border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                                <Users className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-lg text-foreground">Married</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Filing Jointly</p>
                    </button>
                </div>
            </ConversationalCard>
        );
    }

    return (
        <ConversationalCard
            title={filingStatus === "married_joint" ? "Household Income" : "Your Income"}
            description={
                filingStatus === "married_joint"
                    ? "What is the total combined monthly take-home pay for both of you?"
                    : "What is your approximate monthly take-home pay?"
            }
        >
            <form onSubmit={handleSubmit} className="flex gap-4 items-center">
                <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground font-medium">$</span>
                    <input
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 text-2xl font-bold text-foreground bg-secondary rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="4,000"
                        autoFocus
                    />
                </div>
                <button
                    type="submit"
                    disabled={!income}
                    className="p-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                >
                    <ArrowRight className="w-8 h-8" />
                </button>
            </form>
        </ConversationalCard>
    );
}
