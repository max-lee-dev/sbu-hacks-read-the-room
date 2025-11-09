export const runtime = "edge";

type NameValueParam = {
  name: string;
  value: string;
};

export type MaistroRequestBody = {
  agent?: string;
  params?: NameValueParam[];
  options?: Record<string, unknown>;
  inputs?: Record<string, unknown>;
};

const NS_API_BASE = process.env.NS_API_BASE;
const NS_API_KEY = process.env.NS_API_KEY;

const buildUpstreamPayload = (incoming: MaistroRequestBody) => {
  // If caller provided params directly, pass through (still allow agent/options).
  if (Array.isArray(incoming?.params) && incoming.params.length > 0) {
    return {
      agent: incoming.agent ?? "custom-seek",
      params: incoming.params,
      ...(incoming.options ? { options: incoming.options } : {}),
      ...(incoming.inputs ? { inputs: incoming.inputs } : {}),
    };
  }

  return {
    agent: incoming.agent ?? "custom-seek",
    params: [],
    ...(incoming.options ? { options: incoming.options } : {}),
    ...(incoming.inputs ? { inputs: incoming.inputs } : {}),
  };
};

const tryParseJsonLoose = (text: string) => {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    const lastBrace = Math.max(text.lastIndexOf("}"), text.lastIndexOf("]"));
    if (lastBrace >= 0) {
      const sliced = text.slice(0, lastBrace + 1);
      try {
        return JSON.parse(sliced);
      } catch {
        return null;
      }
    }
    return null;
  }
};

export async function POST(req: Request) {
  if (!NS_API_BASE || !NS_API_KEY) {
    return new Response(
      JSON.stringify({
        error: "Missing required environment variables: NS_API_BASE and/or NS_API_KEY",
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  let body: MaistroRequestBody | null = null;
  try {
    body = (await req.json()) as MaistroRequestBody;
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  if (!body) {
    return new Response(
      JSON.stringify({ error: "Missing request body" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  const upstreamPayload = buildUpstreamPayload(body);

  const upstreamRes = await fetch(`${NS_API_BASE}/maistro`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      apikey: NS_API_KEY,
    },
    body: JSON.stringify(upstreamPayload),
  });

  const rawText = await upstreamRes.text();
  const parsed = tryParseJsonLoose(rawText);

  if (!upstreamRes.ok) {
    return new Response(
      JSON.stringify({
        error: "NeuralSeek mAIstro upstream error",
        status: upstreamRes.status,
        details: parsed ?? rawText ?? "Upstream error with empty body",
      }),
      { status: upstreamRes.status, headers: { "content-type": "application/json" } }
    );
  }

  if (parsed !== null) {
    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(rawText, {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

