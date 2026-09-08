import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FLOW_ORDER, getFlowStep, type PhaseId, type StepId } from '@/shared/config/flow';

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
    /** Step that minted the item; typed so a typo fails to compile */
    stepId?: StepId;
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
    /** Lump sums taken out of excessCash, by step, so goBack can refund them */
    excessSpent: Record<string, number>;
    /** Phase whose completion is currently being celebrated (drives the milestone toast). Not persisted. */
    celebratingPhase: PhaseId | null;

    // Actions
    setYear: (year: TaxYear) => void;
    setProfileBase: (data: Partial<FinancialProfile>) => void;
    setAllocation: (stepId: string, amount: number) => void;
    /** Spend part of the emergency-fund surplus on a step's lump sum (refundable via goBack) */
    spendExcess: (stepId: StepId, amount: number) => void;
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

/** The milestone a transition earns: the phase being left, when the next real step starts a new one. */
function computeCrossedPhase(leaving: StepId, nextRealStep: StepId): PhaseId | null {
    // The finale screen is its own celebration; the optimize toast would double up.
    if (nextRealStep === 'completed') return null;
    const from = getFlowStep(leaving)?.phase ?? null;
    const to = getFlowStep(nextRealStep)?.phase ?? null;
    return from !== null && to !== null && from !== to ? from : null;
}

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
            excessSpent: {},
            celebratingPhase: null,

            getRemainingBudget: () => {
                const { profile, allocations } = get();
                const totalAllocated = Object.values(allocations).reduce((acc, val) => acc + val, 0);
                return profile.monthlyIncome - profile.monthlyExpenses - totalAllocated;
            },

            setAllocation: (stepId, amount) => set((state) => ({
                allocations: { ...state.allocations, [stepId]: amount }
            })),

            spendExcess: (stepId, amount) => set((state) => ({
                profile: { ...state.profile, excessCash: Math.max(0, state.profile.excessCash - amount) },
                excessSpent: { ...state.excessSpent, [stepId]: (state.excessSpent[stepId] ?? 0) + amount },
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
                if (!prev) return state;

                // Clear both the step being returned to (so it can be re-entered) and the
                // step being abandoned (so its half-committed state cannot leak into the
                // budget), refunding any lump sums either step took from the surplus.
                const clearIds = [prev, state.currentStep];
                const newAllocations = { ...state.allocations };
                const newExcessSpent = { ...state.excessSpent };
                let refund = 0;
                for (const id of clearIds) {
                    delete newAllocations[id];
                    if (newExcessSpent[id]) {
                        refund += newExcessSpent[id];
                        delete newExcessSpent[id];
                    }
                }

                return {
                    currentStep: prev,
                    history: newHistory,
                    allocations: newAllocations,
                    excessSpent: newExcessSpent,
                    profile: refund > 0
                        ? { ...state.profile, excessCash: state.profile.excessCash + refund }
                        : state.profile,
                    actionItems: state.actionItems.filter(
                        item => item.stepId === undefined || !clearIds.includes(item.stepId)
                    ),
                    celebratingPhase: null,
                };
            }),

            nextStep: () => {
                const { currentStep, getRemainingBudget } = get();
                const currentIndex = FLOW_ORDER.indexOf(currentStep);
                if (currentIndex === -1 || currentIndex >= FLOW_ORDER.length - 1) return;

                const next = FLOW_ORDER[currentIndex + 1];
                const budget = getRemainingBudget();
                const leaving = getFlowStep(currentStep);

                // An empty budget ends the run early, except: during the foundation phase
                // (nothing is allocated yet), on the starter fund step (it handles a zero
                // budget itself), and when the next step is 'completed' (allocating the
                // final dollar on the last step IS finishing the quest).
                const shouldExhaust = budget <= 0
                    && next !== 'completed'
                    && leaving !== undefined
                    && leaving.phase !== 'foundation'
                    && currentStep !== 'emergency-fund';

                const crossedPhase = computeCrossedPhase(currentStep, next);

                set((state) => ({
                    history: [...state.history, state.currentStep],
                    currentStep: shouldExhaust ? 'budget-exhausted' : next,
                    celebratingPhase: crossedPhase ?? state.celebratingPhase,
                }));
            },
        }),
        {
            name: 'financial-quest-storage',
            // sessionStorage: survives refresh, clears when the tab closes.
            storage: createJSONStorage(() => sessionStorage),
            // v2: the redesign renamed the goals allocation key and made stepId
            // universal; older persisted sessions are incompatible, so start fresh.
            version: 2,
            migrate: (persisted, version) => {
                if (version < 2) return undefined as unknown as FinancialState;
                return persisted as FinancialState;
            },
            partialize: (state) => ({
                currentStep: state.currentStep,
                history: state.history,
                selectedYear: state.selectedYear,
                profile: state.profile,
                allocations: state.allocations,
                actionItems: state.actionItems,
                excessSpent: state.excessSpent,
            }),
        }
    ));

// Helper to fully reset
export const resetFinancialQuest = () => {
    sessionStorage.removeItem('financial-quest-storage');
    window.location.reload();
};
