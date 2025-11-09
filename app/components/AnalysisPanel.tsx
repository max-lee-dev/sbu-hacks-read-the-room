'use client';

import { AnalysisResult } from '../lib/types';
import { MoodCard } from './MoodCard';
import { NoiseCard } from './NoiseCard';
import { SuggestionsCard } from './SuggestionsCard';
import { TranscriptionCard } from './TranscriptionCard';
import { VoiceSummaryCard } from './VoiceSummaryCard';

type Props = {
  result: AnalysisResult | null;
};

export const AnalysisPanel = ({ result }: Props) => {
  if (!result) return null;

  const { insights, summarized } = result;

  return (
    <div className="w-full border border-black bg-white p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
      <h2 className="mb-4 text-xl font-bold" style={{ color: '#FFFFFF' }}>Room Analysis</h2>

      {result.audio?.blobUrl && <VoiceSummaryCard audioUrl={result.audio.blobUrl} />}

      <MoodCard mood={summarized.mood || ''} />

      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="border border-gray-400 bg-gray-100 p-3" style={{ backgroundColor: '#353535', border: '1px solid #404040' }}>
          <div className="text-xs" style={{ color: '#808080' }}>People Count</div>
          <div className="mt-1 text-2xl font-bold" style={{ color: '#FFFFFF' }}>{insights.peopleCount}</div>
        </div>

        <NoiseCard noiseLevel={summarized.noiseLevel} />

        <div className="border border-gray-400 bg-gray-100 p-3" style={{ backgroundColor: '#353535', border: '1px solid #404040' }}>
          <div className="text-xs" style={{ color: '#808080' }}>Approachable</div>
          <div className="mt-1 text-2xl font-bold" style={{ color: '#FFFFFF' }}>{insights.recommendedTargets.length}</div>
        </div>
      </div>

      {insights.recommendedTargets && insights.recommendedTargets.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-bold" style={{ color: '#4CAF50' }}>Recommended to Approach</h3>
          <ul className="list-none">
            {insights.recommendedTargets.map((target, idx) => (
              <li key={idx} className="mb-1 text-sm" style={{ color: '#B0B0B0' }}>
                <span className="font-bold" style={{ color: '#FFFFFF' }}>Person {target.personId}</span>: {target.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {insights.doNotApproach && insights.doNotApproach.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-bold" style={{ color: '#EF5350' }}>Avoid Approaching</h3>
          <ul className="list-none">
            {insights.doNotApproach.map((target, idx) => (
              <li key={idx} className="mb-1 text-sm" style={{ color: '#B0B0B0' }}>
                <span className="font-bold" style={{ color: '#FFFFFF' }}>Person {target.personId}</span>: {target.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      <SuggestionsCard suggestions={summarized.suggestions || []} />

      <TranscriptionCard transcription={summarized.transcription || ''} />

      <div className="mt-4 border-t border-black pt-3" style={{ borderColor: '#404040' }}>
        <div className="text-xs" style={{ color: '#808080' }}>
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

