'use client';

import { Lightbulb } from 'lucide-react';

type Suggestion = {
  text: string;
  frame: number | null;
};

type Props = {
  suggestions: Suggestion[];
};

export const SuggestionsCard = ({ suggestions }: Props) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="rounded-lg border border-black bg-white p-4 shadow-sm" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040' }}>
      <div className="mb-3 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-black" style={{ color: '#FFFFFF' }} />
        <h2 className="text-lg font-bold text-black" style={{ color: '#FFFFFF' }}>Suggestions</h2>
      </div>
      <ul className="list-none">
        {suggestions.map((suggestion, idx) => (
          <li key={idx} className="mb-2 flex items-start gap-2 text-sm text-black" style={{ color: '#B0B0B0' }}>
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-black bg-black text-xs font-bold text-white" style={{ backgroundColor: '#FFB380', borderColor: '#FFB380', color: '#1A1A1A' }}>
              {idx + 1}
            </span>
            <span className="flex-1 text-black" style={{ color: '#B0B0B0' }}>{suggestion.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

