import { useState } from "react";
import { useFinancialStore } from "@/entities/financial/model/financialStore";

export type BudgetMode = "ask" | "input" | "guidance" | "advice";

export const useBudgetLogic = () => {
    const { profile, setProfileBase, nextStep } = useFinancialStore();
    const [mode, setMode] = useState<BudgetMode>("ask");
    const [expenses, setExpenses] = useState("");

    const income = profile.monthlyIncome;

    const handleModeSelection = (selection: "yes" | "no") => {
        if (selection === "yes") setMode("input");
        else setMode("guidance");
    };

    const calculateEstimate = () => {
        // 50/30/20 Rule: 80% usually covers Needs (50) + Wants (30)
        const estimated = Math.round(income * 0.8);
        setExpenses(estimated.toString());
        setMode("input");

        // Action Item for later refinement
        if (typeof useFinancialStore.getState().addActionItem === 'function') {
            useFinancialStore.getState().addActionItem({
                id: 'create-budget',
                label: 'Create a Detailed Budget (You guessed earlier)'
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(expenses.replace(/,/g, ""));
        if (val >= 0) {
            setProfileBase({ monthlyExpenses: val });
            setMode("advice");
        }
    };

    // Derived State for Advice Mode
    const numericExpenses = parseFloat(expenses.replace(/,/g, "")) || 0;
    const ratio = income > 0 ? (numericExpenses / income) * 100 : 0;
    const disposable = income - numericExpenses;

    let sentiment = "";
    let message = "";

    if (ratio <= 50) {
        message = "You're living well within your means! This leaves plenty for savings.";
        sentiment = "🌟 Excellent";
    } else if (ratio <= 75) {
        message = "This is a healthy balance, but keep an eye on discretionary spending.";
        sentiment = "✅ Good";
    } else {
        message = "Your expenses are high relative to your income. We might need to look at budgeting strategies.";
        sentiment = "⚠️ Tight";
    }

    return {
        mode,
        income,
        expenses,
        setExpenses,
        handleModeSelection,
        calculateEstimate,
        handleSubmit,
        nextStep,
        advice: {
            numericExpenses,
            disposable,
            sentiment,
            message
        }
    };
};
