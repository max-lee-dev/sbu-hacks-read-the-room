'use client';

import { Recorder } from './components/Recorder';
import { BottomNav } from './components/BottomNav';

export default function Home() {
  return (
    <div className=" mx-auto flex min-h-[100svh] max-w-[480px] flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <Recorder />
      </main>
      <BottomNav />
    </div>
  );
}
