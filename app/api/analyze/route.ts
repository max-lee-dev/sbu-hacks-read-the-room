import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisResult, RoomInsight } from '@/app/lib/types';
import { buildSystemPrompt } from '@/app/prompts/analyze_prompt';

type ReqBody = {
  recordingId: string;
  frames: Array<{ t: number; dataUrl: string }>;
  noiseLevel?: 'low' | 'medium' | 'high';
  model?: string;
};

const stripDataUrl = (dataUrl: string) => dataUrl.split(',')[1] || '';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ReqBody;
    const { recordingId, frames, noiseLevel, model } = body;

    if (!recordingId || !frames || frames.length === 0) {
      return NextResponse.json({ error: 'Missing recordingId or frames' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GOOGLE_API_KEY' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = model || process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    const parts: any[] = [
      { text: buildSystemPrompt(noiseLevel) },
      ...frames.map((f) => ({
        inlineData: {
          data: stripDataUrl(f.dataUrl),
          mimeType: 'image/jpeg',
        },
      })),
      {
        text: 'Return ONLY the JSON object matching the schema above. No markdown, no code blocks, no explanations.',
      },
    ];

    const geminiModel = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts }],
    });

    const responseText = result.response.text();
    let insights: RoomInsight;

    try {
      insights = JSON.parse(responseText) as RoomInsight;
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse analysis response', raw: responseText },
        { status: 500 }
      );
    }

    const analysisResult: AnalysisResult = {
      recordingId,
      model: modelName,
      createdAt: Date.now(),
      rawText: responseText,
      insights,
    };

    return NextResponse.json(analysisResult);
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error?.message || 'Analysis failed', details: error?.stack },
      { status: 500 }
    );
  }
}

