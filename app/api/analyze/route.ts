import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisResult, RoomInsight } from '@/app/lib/types';

type ReqBody = {
  recordingId: string;
  frames: Array<{ t: number; dataUrl: string }>;
  noiseLevel?: 'low' | 'medium' | 'high';
  model?: string;
};

const stripDataUrl = (dataUrl: string) => dataUrl.split(',')[1] || '';

const buildSystemPrompt = (noise?: string) => `
You analyze short social video snippets for someone who needs help "reading the room" and understanding social dynamics.

Your goal is to provide practical, actionable guidance for someone with social awareness challenges. Focus on:

1. **People Count & Grouping**: Count all visible people and identify how they're grouped (pairs, small groups of 3-4, larger clusters, or individuals standing alone).

2. **Group Openness**: For each group, assess if they appear open to newcomers (open body language, facing outward, not in deep conversation) or closed (closed body language, intense conversation, facing inward).

3. **Approachable Individuals**: Identify people who appear approachable based on:
   - Relaxed, open body posture
   - Making eye contact or scanning the room (not buried in phone)
   - Standing alone or on the edge of a group
   - Not engaged in intense conversation
   - Appearing available or looking for interaction

4. **Energy Level**: Assess the overall energy of the room (low = quiet, calm; medium = normal social activity; high = loud, energetic, busy).

5. **Avoid Targets**: Identify people who should NOT be approached:
   - In deep, private conversation
   - Showing closed body language
   - Appearing stressed, angry, or upset
   - Clearly busy or focused on something

6. **Practical Suggestions**: Provide 3-6 concise, actionable suggestions like:
   - "Approach the person by the snacks who is looking around"
   - "The group near the window appears open and welcoming"
   - "Avoid the person in the corner who seems stressed"

${noise ? `Note: Ambient noise level appears to be ${noise}.` : ''}

Output ONLY valid JSON matching this exact schema (no markdown, no code blocks, no extra text):
{
  "peopleCount": number,
  "energyLevel": "low" | "medium" | "high",
  "noiseLevel": "low" | "medium" | "high" | null,
  "groups": [{"memberIds": string[], "openness": "open" | "closed" | "unknown"}],
  "recommendedTargets": [{"personId": string, "reason": string}],
  "doNotApproach": [{"personId": string, "reason": string}],
  "suggestions": string[]
}
`;

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
    const modelName = model || process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';

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

