import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisResult, RoomInsight, SummarizedInsight } from '@/app/lib/types';
import { buildSystemPrompt } from '@/app/prompts/analyze_prompt';
import { buildSummarizePrompt } from '@/app/prompts/summarize_prompt';

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

    // Pass 1: Extract structured data
    const pass1Result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts }],
    });

    const pass1Text = pass1Result.response.text();
    let pass1Insights: RoomInsight;

    try {
      pass1Insights = JSON.parse(pass1Text) as RoomInsight;
    } catch (parseError) {
      console.error('Failed to parse Pass 1 Gemini response:', pass1Text);
      return NextResponse.json(
        { error: 'Failed to parse analysis response', raw: pass1Text },
        { status: 500 }
      );
    }

    // Pass 2: Summarize to UI-ready format
    const summarizeParts = [
      { text: buildSummarizePrompt(pass1Text) },
      {
        text: 'Return ONLY the JSON object matching the schema above. No markdown, no code blocks, no explanations.',
      },
    ];

    const pass2Result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts: summarizeParts }],
    });

    const pass2Text = pass2Result.response.text();
    let summarizedInsights: SummarizedInsight;

    try {
      summarizedInsights = JSON.parse(pass2Text) as SummarizedInsight;

      // Ensure noiseLevel is included - fallback to pass1 if missing or undefined
      if (summarizedInsights.noiseLevel === undefined && pass1Insights.noiseLevel !== undefined) {
        summarizedInsights.noiseLevel = pass1Insights.noiseLevel;
      }
    } catch (parseError) {
      console.error('Failed to parse Pass 2 Gemini response:', pass2Text);
      return NextResponse.json(
        { error: 'Failed to parse summarization response', raw: pass2Text },
        { status: 500 }
      );
    }

    // Call maistro endpoint with the setting
    let rules = '';
    try {
      const maistroResponse = await fetch(`${req.nextUrl.origin}/api/maistro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          params: [
            { name: 'setting', value: pass1Insights.setting },
          ],
        }),
      });

      if (maistroResponse.ok) {
        const maistroText = await maistroResponse.text();
        // Try to parse as JSON first
        try {
          const maistroData = JSON.parse(maistroText);
          // Extract the rules string from the response
          if (typeof maistroData === 'string') {
            rules = maistroData;
          } else if (maistroData?.answer) {
            rules = maistroData.answer;
          } else if (maistroData?.response) {
            rules = maistroData.response;
          } else if (typeof maistroData === 'object') {
            // Try to find a string value in the response
            const stringValue = Object.values(maistroData).find(
              (val) => typeof val === 'string'
            ) as string | undefined;
            if (stringValue) {
              rules = stringValue;
            } else {
              rules = maistroText;
            }
          } else {
            rules = maistroText;
          }
        } catch {
          // If not JSON, use the raw text
          rules = maistroText || '';
        }
      } else {
        const errorText = await maistroResponse.text();
        console.error('Maistro API error:', errorText);
        // Continue without rules if maistro fails
      }
    } catch (maistroError) {
      console.error('Failed to call maistro endpoint:', maistroError);
      // Continue without rules if maistro fails
    }

    const analysisResult: AnalysisResult = {
      recordingId,
      model: modelName,
      createdAt: Date.now(),
      rawText: pass1Text,
      insights: pass1Insights,
      summarized: summarizedInsights,
      rules,
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

