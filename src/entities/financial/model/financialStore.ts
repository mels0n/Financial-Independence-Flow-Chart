import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FLOW_ORDER, getFlowStep, getStepIndex, type PhaseId, type StepId } from '@/shared/config/flow';

export type { StepId };

export type TaxYear = string;
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
    isHysa: boolean;
    emergencyFundMonths: number;
}

export interface ActionItem {
    id: string;
    stepId?: string; // Optional for backward compatibility/manual items, but recommended
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
    /** Phase whose completion is currently being celebrated (drives the milestone toast). Not persisted. */
    celebratingPhase: PhaseId | null;

    // Actions
    setYear: (year: TaxYear) => void;
    setProfileBase: (data: Partial<FinancialProfile>) => void;
    setAllocation: (stepId: string, amount: number) => void;
    addActionItem: (item: Omit<ActionItem, 'completed'>) => void;
    toggleActionItem: (id: string) => void;
    clearCelebration: () => void;

    // Navigation
    nextStep: () => void;
    goBack: () => void;
    goToStep: (step: StepId) => void;

    // Computed
    getRemainingBudget: () => number;
}

export const DEFAULT_YEAR = '2026';

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
                isHysa: false,
                emergencyFundMonths: 3,
            },
            allocations: {},
            actionItems: [],
            celebratingPhase: null,

            getRemainingBudget: () => {
                const { profile, allocations } = get();
                const totalAllocated = Object.values(allocations).reduce((acc, val) => acc + val, 0);
                return profile.monthlyIncome - profile.monthlyExpenses - totalAllocated;
            },

            setAllocation: (stepId, amount) => set((state) => ({
                allocations: { ...state.allocations, [stepId]: amount }
            })),

            setYear: (year) => set({ selectedYear: year }),

            setProfileBase: (data) => set((state) => ({
                profile: { ...state.profile, ...data }
            })),

            addActionItem: (item) => set((state) => {
                if (state.actionItems.some(i => i.id === item.id)) return state;
                return { actionItems: [...state.actionItems, { ...item, completed: false }] };
            }),

            toggleActionItem: (id) => set((state) => ({
                actionItems: state.actionItems.map(i =>
                    i.id === id ? { ...i, completed: !i.completed } : i
                )
            })),

            clearCelebration: () => set({ celebratingPhase: null }),

            goToStep: (step) => set((state) => ({
                history: [...state.history, state.currentStep],
                currentStep: step
            })),

            goBack: () => set((state) => {
                const newHistory = [...state.history];
                const prev = newHistory.pop();
                if (prev) {
                    // Clear the state that belongs to the step we return to, so the user
                    // can re-enter it without stale allocations or action items.
                    const newAllocations = { ...state.allocations };
                    delete newAllocations[prev];

                    const newActionItems = state.actionItems.filter(item => item.stepId !== prev);

                    return {
                        currentStep: prev,
                        history: newHistory,
                        allocations: newAllocations,
                        actionItems: newActionItems,
                        celebratingPhase: null,
                    };
                }
                return state;
            }),

            nextStep: () => {
                const { currentStep, getRemainingBudget } = get();
                const budget = getRemainingBudget();
                const currentIndex = FLOW_ORDER.indexOf(currentStep);

                // Once past the setup phases, an empty budget ends the run: the player
                // has allocated everything they can this year.
                if (currentIndex > 3 && budget <= 0 && currentStep !== 'completed') {
                    // Leaving a phase's last step still mints its badge, even when the
                    // budget runs out on that step.
                    const leavingPhase = getFlowStep(currentStep)?.phase ?? null;
                    const wouldEnter = FLOW_ORDER[currentIndex + 1];
                    const enteringPhase = wouldEnter && wouldEnter !== 'completed' ? getFlowStep(wouldEnter)?.phase ?? null : null;
                    const crossedPhase = leavingPhase !== null && leavingPhase !== enteringPhase ? leavingPhase : null;

                    set((state) => ({
                        history: [...state.history, state.currentStep],
                        currentStep: 'budget-exhausted',
                        celebratingPhase: crossedPhase ?? state.celebratingPhase,
                    }));
                    return;
                }

                if (currentIndex !== -1 && currentIndex < FLOW_ORDER.length - 1) {
                    const next = FLOW_ORDER[currentIndex + 1];
                    // Crossing into a new phase completes the old one: fire the milestone.
                    // Deliberately silent when next === 'completed': the finale screen is
                    // the celebration there, so the optimize-phase toast would double up.
                    const leavingPhase = getFlowStep(currentStep)?.phase ?? null;
                    const enteringPhase = next === 'completed' ? null : getFlowStep(next)?.phase ?? null;
                    const crossedPhase = leavingPhase !== null && leavingPhase !== enteringPhase && next !== 'completed'
                        ? leavingPhase
                        : null;

                    set((state) => ({
                        history: [...state.history, state.currentStep],
                        currentStep: next,
                        celebratingPhase: crossedPhase ?? state.celebratingPhase,
                    }));
                }
            },
        }),
        {
            name: 'financial-quest-storage',
            // sessionStorage: survives refresh, clears when the tab closes.
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                currentStep: state.currentStep,
                history: state.history,
                selectedYear: state.selectedYear,
                profile: state.profile,
                allocations: state.allocations,
                actionItems: state.actionItems,
            }),
        }
    ));

// Helper to fully reset
export const resetFinancialQuest = () => {
    sessionStorage.removeItem('financial-quest-storage');
    window.location.reload();
};
