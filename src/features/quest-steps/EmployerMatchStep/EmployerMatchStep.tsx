"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { ArrowRight, Coins } from "lucide-react";
import { useState } from "react";

export function EmployerMatchStep() {
    const { nextStep, profile } = useFinancialStore();
    const isMarried = profile.filingStatus === "married_joint";

    type MatchPhase = "ask-me-offer" | "ask-me-match" | "ask-spouse-offer" | "ask-spouse-match" | "advice";
    const [phase, setPhase] = useState<MatchPhase>("ask-me-offer");
    const [myHasOffer, setMyHasOffer] = useState(false);

    const handleMeOffer = (y: boolean) => {
        setMyHasOffer(y);
        if (y) setPhase("ask-me-match");
        else {
            if (isMarried) setPhase("ask-spouse-offer");
            else nextStep();
        }
    };

    const handleMeMatch = (y: boolean) => {
        if (!y) {
            setPhase("advice");
            return;
        }
        if (isMarried) setPhase("ask-spouse-offer");
        else nextStep();
    };

    const handleSpouseOffer = (y: boolean) => {
        if (y) setPhase("ask-spouse-match");
        else nextStep();
    };

    const handleSpouseMatch = (y: boolean) => {
        if (!y) {
            setPhase("advice");
        } else {
            nextStep();
        }
    };

    if (phase === "ask-me-offer") {
        return (
            <ConversationalCard
                title="Free money check"
                description="Does YOUR employer offer a 401(k) or 403(b) match?"
                icon={Coins}
            >
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleMeOffer(true)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-lg font-bold text-foreground">Yes</button>
                    <button onClick={() => handleMeOffer(false)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-muted-foreground/40 transition-all text-lg font-bold text-foreground">No</button>
                </div>
            </ConversationalCard>
        );
    }

    if (phase === "ask-me-match") {
        return (
            <ConversationalCard
                title="Claiming your free money?"
                description="Are you contributing enough to get the full match? (Not the whole 401k limit; just the match.)"
                icon={Coins}
            >
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleMeMatch(true)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-success hover:bg-success/10 transition-all text-lg font-bold text-foreground">Yes, getting it</button>
                    <button onClick={() => handleMeMatch(false)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-destructive hover:bg-destructive/10 transition-all text-lg font-bold text-foreground">No / Not sure</button>
                </div>
            </ConversationalCard>
        );
    }

    if (phase === "ask-spouse-offer") {
        return (
            <ConversationalCard
                title={myHasOffer ? "Double dip?" : "Spouse's turn"}
                description="Does your SPOUSE'S employer offer a match?"
                icon={Coins}
            >
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleSpouseOffer(true)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-lg font-bold text-foreground">Yes</button>
                    <button onClick={() => handleSpouseOffer(false)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-muted-foreground/40 transition-all text-lg font-bold text-foreground">No</button>
                </div>
            </ConversationalCard>
        );
    }

    if (phase === "ask-spouse-match") {
        return (
            <ConversationalCard
                title="Claiming theirs?"
                description="Is your spouse capturing 100% of their available match? (Again: just the match, not the full limit.)"
                icon={Coins}
            >
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleSpouseMatch(true)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-success hover:bg-success/10 transition-all text-lg font-bold text-foreground">Yes, getting it</button>
                    <button onClick={() => handleSpouseMatch(false)} className="p-6 bg-card border-2 border-border rounded-2xl hover:border-destructive hover:bg-destructive/10 transition-all text-lg font-bold text-foreground">No / Not sure</button>
                </div>
            </ConversationalCard>
        );
    }

    return (
        <ConversationalCard
            title="Stop. Free money."
            description="You are leaving guaranteed returns on the table."
            icon={Coins}
            mode="advice"
        >
            <div className="space-y-4">
                <div className="p-4 rounded-xl border border-success/40 bg-success/10 flex gap-3">
                    <Coins className="w-5 h-5 shrink-0 text-success mt-0.5" aria-hidden />
                    <p className="font-medium text-sm text-foreground/90">
                        An employer match is an instant <strong className="text-success">50-100% return</strong> on
                        your money. No investment on Earth beats it, which is why it outranks everything except
                        the starter emergency fund.
                    </p>
                </div>
                <p className="text-sm text-muted-foreground">
                    Before anything else, adjust payroll contributions to capture the full match
                    for {isMarried ? "BOTH jobs" : "your job"}.
                </p>
                <button
                    onClick={() => {
                        useFinancialStore.getState().addActionItem({
                            id: 'setup-match',
                            stepId: 'match-employer',
                            label: 'Increase Payroll Contribution to catch full Employer Match'
                        });
                        nextStep();
                    }}
                    className="w-full p-4 bg-primary text-primary-foreground rounded-2xl transition-all hover:brightness-110 active:scale-[0.99] font-bold flex items-center justify-center gap-2"
                >
                    I&apos;ll set that up. Next step <ArrowRight className="w-5 h-5" aria-hidden />
                </button>
            </div>
        </ConversationalCard>
    );
}
