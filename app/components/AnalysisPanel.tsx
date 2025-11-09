'use client';

import { AnalysisResult } from '../lib/types';

type Props = {
  result: AnalysisResult | null;
};

export const AnalysisPanel = ({ result }: Props) => {
  if (!result) return null;

  const { insights, summarized } = result;

  return (
    <div className="w-full border border-black bg-white p-4">
      <h2 className="mb-4 text-xl font-bold">Room Analysis</h2>

      {summarized.mood && (
        <div className="mb-4 border border-gray-400 bg-gray-100 p-3">
          <div className="text-sm">{summarized.mood}</div>
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="border border-gray-400 bg-gray-100 p-3">
          <div className="text-xs">People Count</div>
          <div className="mt-1 text-2xl font-bold">{insights.peopleCount}</div>
        </div>

        {summarized.noiseLevel && (
          <div className="border border-gray-400 bg-gray-100 p-3">
            <div className="text-xs">Noise Level</div>
            <div className="mt-1 text-2xl font-bold">{summarized.noiseLevel}</div>
          </div>
        )}

        <div className="border border-gray-400 bg-gray-100 p-3">
          <div className="text-xs">Approachable</div>
          <div className="mt-1 text-2xl font-bold">{insights.recommendedTargets.length}</div>
        </div>
      </div>

      {insights.recommendedTargets && insights.recommendedTargets.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-bold">Recommended to Approach</h3>
          <ul className="list-none">
            {insights.recommendedTargets.map((target, idx) => (
              <li key={idx} className="mb-1 text-sm">
                <span className="font-bold">Person {target.personId}</span>: {target.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {insights.doNotApproach && insights.doNotApproach.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-bold">Avoid Approaching</h3>
          <ul className="list-none">
            {insights.doNotApproach.map((target, idx) => (
              <li key={idx} className="mb-1 text-sm">
                <span className="font-bold">Person {target.personId}</span>: {target.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {summarized.suggestions && summarized.suggestions.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-bold">Suggestions</h3>
          <ul className="list-disc pl-5">
            {summarized.suggestions.map((suggestion, idx) => (
              <li key={idx} className="mb-1 text-sm">
                {suggestion.text}
                {suggestion.frame !== null && (
                  <span className="ml-2 text-xs">(frame {suggestion.frame})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {summarized.transcription && (
        <div className="mb-4 border border-gray-400 bg-gray-100 p-3">
          <h3 className="mb-2 text-sm font-bold">Summary</h3>
          <p className="text-sm">{summarized.transcription}</p>
        </div>
      )}

      <div className="mt-4 border-t border-black pt-3">
        <div className="text-xs">
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

