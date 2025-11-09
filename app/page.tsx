'use client';

import { Recorder } from './components/Recorder';
import { BottomNav } from './components/BottomNav';

export default function Home() {
  return (
    <div className="mx-auto flex min-h-[100svh] max-w-[480px] flex-col bg-white">
      <header className="w-full border-b border-black p-4">
        <h1 className="text-xl font-bold">Room Reader</h1>
        <p className="mt-2 text-sm">
          Point your camera at the room, tap Start to record, then Analyze to get social awareness
          guidance.
        </p>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <Recorder />
      </main>

      <BottomNav />
    </div>
  );
}
