'use client';

type Props = {
  transcription: string;
};

export const TranscriptionCard = ({ transcription }: Props) => {
  if (!transcription) return null;

  return (
    <div className="rounded-lg border border-black bg-white p-4">
      <h2 className="mb-2 text-lg font-bold text-black">Transcription</h2>
      <p className="text-sm text-black">{transcription}</p>
    </div>
  );
};

