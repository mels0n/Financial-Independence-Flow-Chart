import { create } from 'zustand';

interface WalletState {
    monthlyIncome: number;
    currentBalance: number;
    expenses: {
        rent: number;
        utilities: number;
        minimalDebt: number;
        otherEssentials: number;
    };
    setIncome: (amount: number) => void;
    setExpense: (key: keyof WalletState['expenses'], amount: number) => void;
    resetBalance: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
    monthlyIncome: 0,
    currentBalance: 0,
    expenses: {
        rent: 0,
        utilities: 0,
        minimalDebt: 0,
        otherEssentials: 0,
    },
    setIncome: (amount) => set({ monthlyIncome: amount, currentBalance: amount }),
    setExpense: (key, amount) =>
        set((state) => ({
            expenses: { ...state.expenses, [key]: amount },
        })),
    resetBalance: () =>
        set((state) => {
            const totalExpenses = Object.values(state.expenses).reduce((a, b) => a + b, 0);
            return { currentBalance: state.monthlyIncome - totalExpenses };
        }),
}));
