import { create } from 'zustand';

interface JargonState {
    activeTermId: string | null;
    openDefinition: (termId: string) => void;
    closeDefinition: () => void;
}

export const useJargonStore = create<JargonState>((set) => ({
    activeTermId: null,
    openDefinition: (termId) => set({ activeTermId: termId }),
    closeDefinition: () => set({ activeTermId: null }),
}));
