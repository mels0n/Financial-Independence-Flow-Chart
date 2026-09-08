import { create } from 'zustand';

interface ProposalState {
    /** The monthly amount the on-screen recommendation proposes, before the player commits it. */
    proposedAmount: number | null;
    setProposedAmount: (value: number | null) => void;
}

/**
 * Ephemeral UI state: the RecommendationBlock currently on screen publishes its
 * monthly amount here so the Quest Log's budget bar can show the decision being
 * made as a striped "this step" segment. Never persisted.
 */
export const useProposalStore = create<ProposalState>((set) => ({
    proposedAmount: null,
    setProposedAmount: (value) => set({ proposedAmount: value }),
}));
