'use client';

import { Recorder } from './components/Recorder';
import { BottomNav } from './components/BottomNav';

export default function Home() {
  return (
    <div className="relative mx-auto flex min-h-[100svh] max-w-[480px] flex-col font-sans" style={{ backgroundColor: '#000000' }}>
      <Recorder />
      <BottomNav />
    </div>
  );
}
