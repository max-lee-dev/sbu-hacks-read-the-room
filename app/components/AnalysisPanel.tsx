'use client';

import { AnalysisResult } from '../lib/types';

type Props = {
  result: AnalysisResult | null;
};

export const AnalysisPanel = ({ result }: Props) => {
  if (!result) return null;

  const { insights } = result;

  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-xl font-semibold">Room Analysis</h2>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">People Count</div>
          <div className="mt-1 text-2xl font-bold">{insights.peopleCount}</div>
        </div>

        <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Energy Level</div>
          <div className="mt-1 text-2xl font-bold capitalize">{insights.energyLevel}</div>
        </div>

        {insights.noiseLevel && (
          <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Noise Level</div>
            <div className="mt-1 text-2xl font-bold capitalize">{insights.noiseLevel}</div>
          </div>
        )}

        <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Approachable</div>
          <div className="mt-1 text-2xl font-bold">{insights.recommendedTargets.length}</div>
        </div>
      </div>

      {insights.groups && insights.groups.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold">Groups ({insights.groups.length})</h3>
          <ul className="space-y-1.5">
            {insights.groups.slice(0, 5).map((group, idx) => (
              <li key={idx} className="text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">{group.memberIds.length} people</span> —{' '}
                <span className="capitalize">{group.openness}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {insights.recommendedTargets && insights.recommendedTargets.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-400">
            Recommended to Approach
          </h3>
          <ul className="space-y-1.5">
            {insights.recommendedTargets.map((target, idx) => (
              <li key={idx} className="text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">Person {target.personId}</span>: {target.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {insights.doNotApproach && insights.doNotApproach.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold text-red-700 dark:text-red-400">
            Avoid Approaching
          </h3>
          <ul className="space-y-1.5">
            {insights.doNotApproach.map((target, idx) => (
              <li key={idx} className="text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">Person {target.personId}</span>: {target.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {insights.suggestions && insights.suggestions.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold">Suggestions</h3>
          <ul className="list-disc space-y-1.5 pl-5">
            {insights.suggestions.map((suggestion, idx) => (
              <li key={idx} className="text-sm text-zinc-700 dark:text-zinc-300">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 border-t border-zinc-200 pt-3 dark:border-zinc-800">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          Model: {result.model} •{' '}
          {new Date(result.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};

