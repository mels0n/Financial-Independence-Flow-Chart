'use client';

import { useJargonStore } from '@features/jargon-buster/model/store';
import { glossaryTerms } from '@entities/glossary-term/model/data';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export function DefinitionModal() {
    const { activeTermId, closeDefinition } = useJargonStore();

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeDefinition();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [closeDefinition]);

    if (!activeTermId) return null;

    const term = glossaryTerms[activeTermId];
    if (!term) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex justify-between items-start p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white pr-4">
                        {term.title}
                    </h3>
                    <button
                        onClick={closeDefinition}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                        {term.definition}
                    </p>
                </div>
            </div>
        </div>
    );
}
