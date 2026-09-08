"use client";

import { useState } from "react";
import { useFinancialStore, FilingStatus } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { ArrowRight, Users, User, Wallet } from "lucide-react";

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
                title="Tax profile"
                description="Contribution limits double for some accounts when you file jointly. How will you be filing?"
                icon={Wallet}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => handleStatusSelect("single")}
                        className="p-6 bg-card border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <span className="p-2 rounded-lg border border-primary/30 bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                <User className="w-5 h-5" aria-hidden />
                            </span>
                            <span className="font-bold text-lg text-foreground">Single</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Or head of household</p>
                    </button>

                    <button
                        onClick={() => handleStatusSelect("married_joint")}
                        className="p-6 bg-card border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <span className="p-2 rounded-lg border border-primary/30 bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                <Users className="w-5 h-5" aria-hidden />
                            </span>
                            <span className="font-bold text-lg text-foreground">Married</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Filing jointly</p>
                    </button>
                </div>
            </ConversationalCard>
        );
    }

    return (
        <ConversationalCard
            title={filingStatus === "married_joint" ? "Household income" : "Your income"}
            description={
                filingStatus === "married_joint"
                    ? (<span>Total combined <strong className="text-foreground">MONTHLY</strong> take-home pay for both of you. This is the budget the whole quest allocates.</span>)
                    : (<span>Your approximate <strong className="text-foreground">MONTHLY</strong> take-home pay. This is the budget the whole quest allocates.</span>)
            }
            icon={Wallet}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground font-medium" aria-hidden>$</span>
                        <input
                            type="number"
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                            aria-label="Monthly take-home pay in dollars"
                            className="w-full pl-10 pr-4 py-4 text-2xl font-mono tabular font-bold text-foreground bg-secondary rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            placeholder="4,000"
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!income}
                        aria-label="Continue"
                        className="p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowRight className="w-7 h-7" aria-hidden />
                    </button>
                </div>
                <p className="text-xs text-muted-foreground font-medium pl-1">
                    Monthly amount, not yearly. After taxes.
                </p>
            </form>
        </ConversationalCard>
    );
}
