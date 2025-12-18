"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { ArrowRight, Coins } from "lucide-react";
import { useState } from "react";

export function EmployerMatchStep() {
    const { setProfileBase, nextStep, profile } = useFinancialStore();
    const isMarried = profile.filingStatus === "married_joint";

    // Phased logic:
    // 1. My Offer? -> 2. My Match?
    // 3. Spouse Offer? -> 4. Spouse Match? (If married)

    // Simplified State Machine
    type MatchPhase = "ask-me-offer" | "ask-me-match" | "ask-spouse-offer" | "ask-spouse-match" | "advice";
    const [phase, setPhase] = useState<MatchPhase>("ask-me-offer");

    const handleMeOffer = (y: boolean) => {
        if (y) setPhase("ask-me-match");
        else {
            // No offer for me. Check spouse or done.
            if (isMarried) setPhase("ask-spouse-offer");
            else nextStep();
        }
    };

    const handleMeMatch = (y: boolean) => {
        // I have an offer. Am I matching it?
        if (!y) {
            // I am failing. Go to advice immediately.
            setPhase("advice");
            return;
        }
        // I am good. Check spouse.
        if (isMarried) setPhase("ask-spouse-offer");
        else nextStep();
    };

    const handleSpouseOffer = (y: boolean) => {
        if (y) setPhase("ask-spouse-match");
        else nextStep(); // Neither has unmatched offer (or I was already checked).
    };

    const handleSpouseMatch = (y: boolean) => {
        if (!y) {
            setPhase("advice"); // Spouse is failing.
        } else {
            nextStep(); // Both are winning.
        }
    };

    if (phase === "ask-me-offer") {
        return (
            <ConversationalCard
                title="Free Money Check 💰"
                description="Does YOUR employer offer a 401(k) or 403(b) match?"
            >
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleMeOffer(true)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-xl font-bold text-foreground">Yes</button>
                    <button onClick={() => handleMeOffer(false)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-border transition-all text-xl font-bold text-foreground">No</button>
                </div>
            </ConversationalCard>
        );
    }

    if (phase === "ask-me-match") {
        return (
            <ConversationalCard
                title="Claiming your free money?"
                description="Are you contributing enough to get the full match? (Don't worry about maxing out the 401k limit yet—just get the match)."
            >
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleMeMatch(true)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-emerald-500 hover:bg-emerald-500/10 transition-all text-xl font-bold text-foreground">Yes, getting it</button>
                    <button onClick={() => handleMeMatch(false)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-destructive hover:bg-destructive/10 transition-all text-xl font-bold text-foreground">No / Not sure</button>
                </div>
            </ConversationalCard>
        );
    }

    if (phase === "ask-spouse-offer") {
        return (
            <ConversationalCard
                title="Double Dip? 👯‍♂️"
                description="Does your SPOUSE'S employer offer a match?"
            >
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleSpouseOffer(true)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-xl font-bold text-foreground">Yes</button>
                    <button onClick={() => handleSpouseOffer(false)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-border transition-all text-xl font-bold text-foreground">No</button>
                </div>
            </ConversationalCard>
        );
    }

    if (phase === "ask-spouse-match") {
        return (
            <ConversationalCard
                title="Claiming theirs?"
                description="Is your spouse capturing 100% of their available match? (Again, just the match amount, not the full 401k limit)."
            >
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleSpouseMatch(true)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-emerald-500 hover:bg-emerald-500/10 transition-all text-xl font-bold text-foreground">Yes, getting it</button>
                    <button onClick={() => handleSpouseMatch(false)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-destructive hover:bg-destructive/10 transition-all text-xl font-bold text-foreground">No / Not sure</button>
                </div>
            </ConversationalCard>
        );
    }

    // Advice State (If either failed)
    return (
        <ConversationalCard
            title="Stop. 🛑"
            description="You are leaving free money on the table."
            mode="advice"
        >
            <div className="space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 rounded-xl border border-emerald-100 dark:border-emerald-900 flex gap-3">
                    <Coins className="w-6 h-6 shrink-0" />
                    <p className="font-medium">An employer match is an instant 100% return on your money. No investment in the world beats that.</p>
                </div>
                <p className="text-muted-foreground">
                    Before proceeding, adjust your payroll contributions to capture the full match for {isMarried ? "BOTH jobs" : "your job"}.
                </p>
                <button
                    onClick={() => {
                        useFinancialStore.getState().addActionItem({
                            id: 'setup-match',
                            label: 'Increase Payroll Contribution to catch full Employer Match'
                        });
                        nextStep();
                    }}
                    className="w-full p-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all font-medium flex items-center justify-center gap-2"
                >
                    I'll set that up. Next Step <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </ConversationalCard>
    );
}
