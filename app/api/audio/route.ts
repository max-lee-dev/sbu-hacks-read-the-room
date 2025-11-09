import { NextRequest } from 'next/server';

type ReqBody = {
  text: string;
  voiceId?: string;
  model?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ReqBody;
    const { text, voiceId, model } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Missing or invalid text' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing ELEVENLABS_API_KEY' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const vid = voiceId || process.env.ELEVENLABS_VOICE_ID;
    if (!vid) {
      return new Response(
        JSON.stringify({
          error: 'Missing voiceId (provide in request body or set ELEVENLABS_VOICE_ID environment variable)',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const ttsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${vid}/stream?optimize_streaming_latency=3`;

    const ttsRes = await fetch(ttsUrl, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: model || process.env.ELEVENLABS_MODEL_ID || 'eleven_turbo_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!ttsRes.ok) {
      const errorText = await ttsRes.text().catch(() => 'Unknown error');
      console.error('ElevenLabs API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'TTS generation failed', details: errorText }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!ttsRes.body) {
      return new Response(JSON.stringify({ error: 'No audio stream received' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(ttsRes.body, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    console.error('Audio generation error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Audio generation failed' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

