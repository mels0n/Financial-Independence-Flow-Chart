'use client';

import { useJargonStore } from '../model/store';
import { glossaryTerms } from '@entities/glossary-term/model/data';

interface Props {
    text: string;
}

export function TermHighlighter({ text }: Props) {
    const { openDefinition } = useJargonStore();

    // Sort terms by length (descending) to avoid partial matches (e.g., matching "IRA" inside "Traditional IRA")
    // Ideally this should be more robust (boundary checks), but sufficient for now.
    const terms = Object.keys(glossaryTerms).sort((a, b) => b.length - a.length);

    // Regex to match any of the terms, case-insensitive, word boundaries
    const pattern = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi');

    const parts = text.split(pattern);

    return (
        <span>
            {parts.map((part, i) => {
                // Check if this part matches a term (case-insensitive check against keys)
                const matchedKey = terms.find(t => t.toLowerCase() === part.toLowerCase());

                if (matchedKey) {
                    return (
                        <button
                            key={i}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent node drag/selection if possible
                                openDefinition(matchedKey);
                            }}
                            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-help px-0.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                            title="Click for definition"
                        >
                            {part}
                        </button>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
}
