'use client';

import { Recorder } from './components/Recorder';
import { BottomNav } from './components/BottomNav';

export default function Home() {
  return (
    <div className="mx-auto flex min-h-[100svh] max-w-[480px] flex-col bg-zinc-50 font-sans dark:bg-black">
      <header className="w-full px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold">Room Reader</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Point your camera at the room, tap Start to record, then Analyze to get social awareness
          guidance.
        </p>
      </header>
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <Recorder />
      </main>
      <BottomNav />
    </div>
  );
}
