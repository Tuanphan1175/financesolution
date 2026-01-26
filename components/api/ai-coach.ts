// api/ai-coach.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Role = "user" | "model";
type Msg = { role: Role; text: string };

type Body = {
  userText: string;
  systemPrompt: string;
  history?: Msg[];
  model?: string; // optional override
};

function bad(res: VercelResponse, code: number, msg: string) {
  return res.status(code).json({ ok: false, error: msg });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return bad(res, 405, "Method not allowed");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim().length < 10) return bad(res, 500, "Missing GEMINI_API_KEY");

  let body: Body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body as Body);
  } catch {
    return bad(res, 400, "Invalid JSON body");
  }

  const userText = String(body.userText ?? "").trim();
  const systemPrompt = String(body.systemPrompt ?? "").trim();
  const history = Array.isArray(body.history) ? body.history : [];

  if (!userText) return bad(res, 400, "Missing userText");
  if (!systemPrompt) return bad(res, 400, "Missing systemPrompt");

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelName = body.model?.trim() || "models/gemini-1.5-pro";
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
      generationConfig: {
        maxOutputTokens: 700,
        temperature: 0.6,
        topP: 0.9,
      },
    });

    const geminiHistory = history
      .filter((m) => (m?.role === "user" || m?.role === "model") && typeof m.text === "string")
      .map((m) => ({ role: m.role as "user" | "model", parts: [{ text: m.text }] }));

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(userText);
    const text = result.response.text()?.trim() || "";

    return res.status(200).json({ ok: true, text });
  } catch (e: any) {
    const msg = e?.message ? String(e.message) : "Unknown error";
    return res.status(500).json({ ok: false, error: msg });
  }
}
