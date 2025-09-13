import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { objective, audienceSummary } = await req.json();
    if (!objective) {
      return NextResponse.json({ ok: false, error: "Objective required" }, { status: 400 });
    }
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ ok: false, error: "OPENAI_API_KEY missing" }, { status: 500 });
    }

    const prompt = `
Generate 3 short, friendly marketing messages.
- Campaign objective: "${objective}"
- Audience: ${audienceSummary || "general"}
- Keep each under 25 words.
Return ONLY a JSON array of strings, no explanations.
    `;

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // safe, light model
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    const json = await resp.json();
    const raw = json?.choices?.[0]?.message?.content?.trim() || "[]";

    let suggestions;
    try {
      suggestions = JSON.parse(raw);
    } catch {
      // fallback: split by newlines
      suggestions = raw
        .split("\n")
        .map((s) => s.replace(/^\d+[\).\-\s]*/, "").trim())
        .filter((s) => s);
    }

    return NextResponse.json({ ok: true, suggestions });
  } catch (e) {
    console.error("AI suggest error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
