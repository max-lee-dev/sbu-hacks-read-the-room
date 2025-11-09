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
    <div className="rounded-lg border border-black bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-black" />
        <h2 className="text-lg font-bold text-black">Suggestions</h2>
      </div>
      <ul className="list-none">
        {suggestions.map((suggestion, idx) => (
          <li key={idx} className="mb-2 flex items-start gap-2 text-sm text-black">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-black bg-black text-xs font-bold text-white">
              {idx + 1}
            </span>
            <span className="flex-1 text-black">{suggestion.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

