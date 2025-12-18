"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { ArrowRight, Globe } from "lucide-react";

export function TaxableStep() {
    const { nextStep, getRemainingBudget } = useFinancialStore();
    const remaining = getRemainingBudget();

    return (
        <ConversationalCard
            title="The Infinite Frontier 🌍"
            description="You have maxed every tax advantage available. You are a financial juggernaut."
            mode="advice"
        >
            <div className="space-y-6">
                <p className="text-foreground">
                    The final step is a standard <strong>Taxable Brokerage Account</strong>.
                </p>

                <div className="p-4 bg-secondary rounded-xl space-y-3">
                    <div>
                        <h4 className="font-bold flex items-center gap-2 mb-2">
                            <Globe className="w-5 h-5 text-primary" />
                            Remaining Power
                        </h4>
                        <p className="text-2xl font-bold font-mono text-emerald-500 mb-1">
                            ${remaining.toLocaleString()} / mo
                        </p>
                    </div>

                    <div className="text-sm text-muted-foreground space-y-2 pt-2 border-t border-border">
                        <p><strong>Where to invest?</strong> Low-cost, broad market Index Funds.</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li><strong>VTI / VOO (USA):</strong> Total US Stock Market or S&P 500.</li>
                            <li><strong>VT (Global):</strong> Total World Stock Market (includes Int'l).</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="p-4 border border-border rounded-xl bg-card">
                <p className="text-sm text-muted-foreground italic text-center">
                    "You don't need us anymore. You have mastered the flow. Now, simply stay the course and let compound interest do the rest."
                </p>

                <button
                    onClick={() => nextStep()}
                    className="w-full p-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                    Finish Quest <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </ConversationalCard>
    );
}
