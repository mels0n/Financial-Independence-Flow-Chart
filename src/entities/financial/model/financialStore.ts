import { create } from 'zustand';

export type StepId =
    | 'year-selection'
    | 'income'
    | 'budget'
    | 'emergency-fund'
    | 'match-employer'
    | 'debt-payoff'
    | 'hsa'
    | 'ira'
    | 'max-401k'
    | 'moderate-debt'
    | 'goals'
    | 'education'
    | 'mega-backdoor'
    | 'taxable'
    | 'low-interest-debt'
    | 'emergency-fund-full'
    | 'completed'
    | 'budget-exhausted';

export type TaxYear = '2025' | '2026';
export type FilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_household';

interface FinancialProfile {
    monthlyIncome: number;
    monthlyExpenses: number;
    filingStatus: FilingStatus;
    emergencyFundAmount: number;
    offeredMatch: boolean;
    isMatchingFull: boolean;
    hasHighInterestDebt: boolean;
    hasHsaEligiblePlan: boolean;
    excessCash: number;
}

export interface ActionItem {
    id: string;
    label: string;
    completed: boolean;
}

interface FinancialState {
    currentStep: StepId;
    history: StepId[];
    selectedYear: TaxYear;
    profile: FinancialProfile;
    allocations: Record<string, number>;
    actionItems: ActionItem[];

    // Actions
    setYear: (year: TaxYear) => void;
    setProfileBase: (data: Partial<FinancialProfile>) => void;
    setAllocation: (stepId: string, amount: number) => void;
    addActionItem: (item: Omit<ActionItem, 'completed'>) => void;
    toggleActionItem: (id: string) => void;

    // Navigation
    nextStep: () => void;
    goBack: () => void;
    goToStep: (step: StepId) => void;

    // Computed
    getRemainingBudget: () => number;
}

export const DEFAULT_YEAR = '2025';

import { persist, createJSONStorage } from 'zustand/middleware';

export const useFinancialStore = create<FinancialState>()(
    persist(
        (set, get) => ({
            currentStep: 'year-selection',
            history: [],
            selectedYear: DEFAULT_YEAR as TaxYear,
            profile: {
                monthlyIncome: 0,
                monthlyExpenses: 0,
                filingStatus: 'single',
                emergencyFundAmount: 0,
                offeredMatch: false,
                isMatchingFull: false,
                hasHighInterestDebt: false,
                hasHsaEligiblePlan: false,
                excessCash: 0,
            },
            allocations: {},
            actionItems: [],

            getRemainingBudget: () => {
                const { profile, allocations } = get();
                // Start with Income
                let remainder = profile.monthlyIncome;
                // Subtract Expenses (Basic Budget)
                remainder -= profile.monthlyExpenses;

                // Subtract allocations
                const totalAllocated = Object.values(allocations).reduce((acc, val) => acc + val, 0);
                return remainder - totalAllocated;
            },

            setAllocation: (stepId, amount) => set((state) => ({
                allocations: { ...state.allocations, [stepId]: amount }
            })),

            setYear: (year) => set({ selectedYear: year }),

            setProfileBase: (data) => set((state) => ({
                profile: { ...state.profile, ...data }
            })),

            addActionItem: (item) => set((state) => {
                // Prevent duplicates
                if (state.actionItems.some(i => i.id === item.id)) return state;
                return { actionItems: [...state.actionItems, { ...item, completed: false }] };
            }),

            toggleActionItem: (id) => set((state) => ({
                actionItems: state.actionItems.map(i =>
                    i.id === id ? { ...i, completed: !i.completed } : i
                )
            })),

            goToStep: (step) => set((state) => ({
                history: [...state.history, state.currentStep],
                currentStep: step
            })),

            goBack: () => set((state) => {
                const newHistory = [...state.history];
                const prev = newHistory.pop();
                if (prev) {
                    return { currentStep: prev, history: newHistory };
                }
                return state;
            }),

            nextStep: () => {
                const { currentStep, getRemainingBudget } = get();
                const flow: StepId[] = [
                    'year-selection', 'income', 'budget', 'emergency-fund',
                    'match-employer', 'debt-payoff', 'emergency-fund-full', 'hsa', 'ira',
                    'moderate-debt', 'max-401k', 'goals',
                    'education', 'mega-backdoor', 'low-interest-debt', 'taxable',
                    'completed'
                ];

                const budget = getRemainingBudget();
                const currentIndex = flow.indexOf(currentStep);

                // If we simply check <= 0, we might stop them before they can even enter the stage where they spend 0.
                // We really want to stop them if they try to ADVANCE past an investment step with $0 left?
                // Let's be lenient: Any positive budget allows progress. 
                // If 0, only allow progress if we are NOT in an "allocation" phase?
                // Actually simplest logic: If budget <= 0, we force them to 'budget-exhausted' UNLESS they are in the setup phases (0-2).
                if (currentIndex > 3 && budget <= 0 && currentStep !== 'completed') {
                    set((state) => ({
                        history: [...state.history, state.currentStep],
                        currentStep: 'budget-exhausted'
                    }));
                    return;
                }

                const idx = flow.indexOf(currentStep);
                if (idx !== -1 && idx < flow.length - 1) {
                    set((state) => ({
                        history: [...state.history, state.currentStep],
                        currentStep: flow[idx + 1]
                    }));
                }
            },

            reset: () => {
                sessionStorage.removeItem('financial-quest-storage');
                window.location.reload();
            }
        }),
        {
            name: 'financial-quest-storage', // unique name
            storage: createJSONStorage(() => sessionStorage), // Use sessionStorage so it clears on close, OR localStorage if user wants "refresh" safety. User said: "if I close the browser is resets". That usually implies sessionStorage. BUT user also said "State of the answers need to be held in session". SessionStorage does that.
            // Wait, "if I close the browser is resets" could mean they WANT it to reset, or they observed it resetting.
            // "hold in session so if I refresh the data stays".
            // sessionStorage survives refresh. It clears on tab/window close. This matches the request perfectly.
        }
    ));

// Helper to fully reset
export const resetFinancialQuest = () => {
    sessionStorage.removeItem('financial-quest-storage');
    window.location.reload();
};
