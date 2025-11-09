'use server';

import { NextResponse } from 'next/server';

// Keep a stable ID for this server process lifetime; changes on server restart
const globalAny = globalThis as any;
const serverInstanceId: string =
  globalAny.__rrServerInstanceId ||
  (globalAny.__rrServerInstanceId = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`);

export async function GET() {
  return NextResponse.json({ instanceId: serverInstanceId });
}


