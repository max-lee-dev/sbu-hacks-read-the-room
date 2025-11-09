'use client';

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
      <h2 className="mb-3 text-lg font-bold text-black">Suggestions</h2>
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

