// lib/aiCoach.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Transaction, Asset, Liability, JourneyProgress, GoldenRule } from "../types";

// =========================
// TYPES
// =========================
export type AiCoachRole = "user" | "model";

export interface AiCoachMessage {
  role: AiCoachRole;
  text: string;
}

export interface AiCoachContextInput {
  transactions?: Transaction[];
  assets?: Asset[];
  liabilities?: Liability[];
  journeyProgress?: JourneyProgress;
  goldenRules?: GoldenRule[];
}

export interface AiCoachSendOptions {
  apiKey?: string; // default: import.meta.env.VITE_GEMINI_API_KEY
  model?: string; // default: "models/gemini-1.5-pro"
  maxOutputTokens?: number; // default: 700
  temperature?: number; // default: 0.6
  topP?: number; // default: 0.9
  maxRetries?: number; // default: 4
  initialBackoffMs?: number; // default: 900
  timeoutMs?: number; // default: 20000
  useDemoFallback?: boolean; // default: true
  systemStyle?: "default" | "strict";
}

export interface AiCoachSendInput {
  userText: string;
  history?: AiCoachMessage[];
  context?: AiCoachContextInput;
  systemStyle?: "default" | "strict";
  userLocale?: "vi-VN" | string;
}

export interface AiCoachSendResult {
  ok: boolean;
  text: string;
  usedDemo: boolean;
  meta: {
    model: string;
    retries: number;
    reason?: string;
  };
}

// =========================
// MONEY + DATE HELPERS
// =========================
const fmtMoney = (v: number, locale = "vi-VN") =>
  (Number.isFinite(v) ? Math.round(v) : 0).toLocaleString(locale);

function safeSum(nums: number[]) {
  return nums.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
}

function toShortDateISO(d: Date) {
  return d.toISOString().split("T")[0];
}

function monthRangeISO(now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { start: toShortDateISO(start), end: toShortDateISO(end) };
}

function isWithinISO(dateISO: string, startISO: string, endISO: string) {
  return dateISO >= startISO && dateISO < endISO;
}

// =========================
// CONTEXT BUILDER
// =========================
export function buildFinancialContextText(
  input: AiCoachContextInput,
  locale: string = "vi-VN"
) {
  const transactions = input.transactions ?? [];
  const assets = input.assets ?? [];
  const liabilities = input.liabilities ?? [];
  const goldenRules = input.goldenRules ?? [];

  const now = new Date();
  const { start, end } = monthRangeISO(now);

  const txThisMonth = transactions.filter((t) => {
    const d = String((t as any).date || "");
    return d && isWithinISO(d, start, end);
  });

  const incomeThisMonth = safeSum(
    txThisMonth.filter((t) => t.type === "income").map((t) => t.amount)
  );
  const expenseThisMonth = safeSum(
    txThisMonth.filter((t) => t.type === "expense").map((t) => t.amount)
  );
  const cashflowThisMonth = incomeThisMonth - expenseThisMonth;

  const totalAssets = safeSum(assets.map((a) => a.value));
  const totalLiabilities = safeSum(liabilities.map((l) => l.amount));
  const netWorth = totalAssets - totalLiabilities;

  const ccDebt = safeSum(
    liabilities.filter((l) => (l as any).type === "credit_card").map((l) => l.amount)
  );
  const loanDebt = safeSum(
    liabilities
      .filter((l) => {
        const t = (l as any).type;
        return t === "loan" || t === "mortgage";
      })
      .map((l) => l.amount)
  );

  const rulesTotal = goldenRules.length;
  const rulesOk = goldenRules.filter((r) => (r as any).isCompliant).length;
  const rulesRate = rulesTotal > 0 ? Math.round((rulesOk / rulesTotal) * 100) : null;

  // 6 jars demo (có thể chỉnh sau)
  const jars =
    incomeThisMonth > 0
      ? {
          needs45: Math.round(incomeThisMonth * 0.45),
          freedom20: Math.round(incomeThisMonth * 0.2),
          edu10: Math.round(incomeThisMonth * 0.1),
          play10: Math.round(incomeThisMonth * 0.1),
          emergency10: Math.round(incomeThisMonth * 0.1),
          give5: Math.round(incomeThisMonth * 0.05),
        }
      : null;

  const lines: string[] = [];
  lines.push(`DỮ LIỆU TÀI CHÍNH (tháng ${now.getMonth() + 1}/${now.getFullYear()}):`);
  lines.push(`- Thu nhập tháng: ${fmtMoney(incomeThisMonth, locale)} đ`);
  lines.push(`- Chi tiêu tháng: ${fmtMoney(expenseThisMonth, locale)} đ`);
  lines.push(`- Dòng tiền ròng (cashflow): ${fmtMoney(cashflowThisMonth, locale)} đ`);
  lines.push("");
  lines.push("TÀI SẢN & NỢ:");
  lines.push(`- Tổng tài sản: ${fmtMoney(totalAssets, locale)} đ`);
  lines.push(`- Tổng nợ: ${fmtMoney(totalLiabilities, locale)} đ`);
  lines.push(`- Tài sản ròng: ${fmtMoney(netWorth, locale)} đ`);
  lines.push(`- Nợ thẻ tín dụng: ${fmtMoney(ccDebt, locale)} đ`);
  lines.push(`- Nợ vay/ thế chấp: ${fmtMoney(loanDebt, locale)} đ`);
  lines.push("");
  lines.push(
    `KỶ LUẬT (Golden Rules): ${
      rulesTotal > 0 ? `${rulesOk}/${rulesTotal} (${rulesRate}%)` : "chưa có dữ liệu"
    }`
  );

  if (jars) {
    lines.push("");
    lines.push("GỢI Ý PHÂN BỔ 6 CHIẾC LỌ (theo thu nhập tháng hiện tại):");
    lines.push(`- 45% Nhu cầu: ${fmtMoney(jars.needs45, locale)} đ`);
    lines.push(`- 20% Tự do tài chính: ${fmtMoney(jars.freedom20, locale)} đ`);
    lines.push(`- 10% Giáo dục: ${fmtMoney(jars.edu10, locale)} đ`);
    lines.push(`- 10% Hưởng thụ: ${fmtMoney(jars.play10, locale)} đ`);
    lines.push(`- 10% Khẩn cấp: ${fmtMoney(jars.emergency10, locale)} đ`);
    lines.push(`- 5% Cho đi: ${fmtMoney(jars.give5, locale)} đ`);
  }

  return lines.join("\n");
}

// =========================
// PROMPT BUILDER (systemInstruction)
// =========================
export function buildSystemPrompt(
  financialContextText: string,
  style: "default" | "strict" = "default"
) {
  const base: string[] = [];

  base.push("Bạn là AI Financial Coach – trợ lý tài chính cá nhân trong ứng dụng Tài Chính Thông Minh.");
  base.push("");
  base.push("Cách xưng hô (bắt buộc):");
  base.push("- Gọi người dùng là “bạn”");
  base.push("- Xưng là “tôi”");
  base.push("");
  base.push("Nguyên tắc tư vấn (bắt buộc):");
  base.push("1) Ưu tiên DÒNG TIỀN DƯƠNG. Nếu cashflow âm → giảm chi + tăng thu + chặn nợ xấu.");
  base.push("2) Phân biệt TÀI SẢN vs TIÊU SẢN:");
  base.push("   - Tài sản: tạo dòng tiền/ tăng giá trị dài hạn.");
  base.push("   - Tiêu sản: tiêu tiền, hao mòn, rủi ro nợ tiêu dùng.");
  base.push("3) Khung kỷ luật “6 chiếc lọ” là công cụ hướng dẫn; dùng con số thực tế theo thu nhập.");
  base.push("4) Không hứa hẹn làm giàu nhanh. Không khuyến nghị lĩnh vực người dùng không hiểu.");
  base.push("5) Kết thúc câu trả lời luôn có:");
  base.push("   - 1 câu chốt");
  base.push("   - 3 việc làm ngay trong 7 ngày");
  base.push("   - 1 câu hỏi ngược để chẩn đoán tiếp");
  base.push("");
  base.push("Phong cách:");
  base.push("- Chuyên nghiệp, trung lập, đáng tin cậy (giọng SaaS thương mại).");
  base.push("- Không giống bác sĩ hay người quen.");
  base.push("");

  if (style === "strict") {
    base.push("Bổ sung phong cách STRICT:");
    base.push("- Nếu bạn muốn mua TIÊU SẢN khi cashflow âm/yếu hoặc đang nợ thẻ: phản biện mạnh.");
    base.push("- Đưa giới hạn cụ thể (ví dụ: hoãn 30–90 ngày) + 2 phương án thay thế rẻ hơn.");
    base.push("");
  }

  base.push("Dữ liệu người dùng (để bạn dựa vào khi trả lời):");
  base.push(financialContextText);

  return base.join("\n").trim();
}

// =========================
// DEMO FALLBACK (bạn – tôi)
// =========================
export function buildDemoReply(financialContextText: string, userText: string) {
  const lines: string[] = [];
  lines.push(`Tôi đã nhận được câu hỏi của bạn: "${userText}"`);
  lines.push("");
  lines.push("Chốt 1 câu:");
  lines.push("- Ưu tiên đưa dòng tiền về dương và khóa các khoản “tiêu sản” trước khi nghĩ đến tối ưu đầu tư.");
  lines.push("");
  lines.push("3 việc làm ngay trong 7 ngày:");
  lines.push("1) Ghi lại 10 khoản chi nhỏ lẻ gần nhất → cắt 2 khoản không tạo giá trị (Latte factor).");
  lines.push("2) Trích trước 10% thu nhập để tích lũy (pay yourself first), dù số tiền nhỏ.");
  lines.push("3) Nếu có nợ lãi cao: lập kế hoạch trả nợ theo lãi suất (cao → thấp) hoặc theo “tuyết lăn” (nhỏ → lớn).");
  lines.push("");
  lines.push("Câu hỏi ngược để chẩn đoán tiếp:");
  lines.push("- Mục tiêu 90 ngày tới của bạn là: tăng thu nhập hay giảm chi + trả nợ?");
  lines.push("");
  lines.push("Dữ liệu tôi đang dựa vào:");
  lines.push(financialContextText);
  return lines.join("\n");
}

// =========================
// ERROR + RETRY HELPERS
// =========================
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function isQuota429(err: unknown) {
  const msg = (err instanceof Error ? err.message : String(err ?? "")).toLowerCase();
  return (
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("resource_exhausted") ||
    msg.includes("too many requests")
  );
}

function isAuthError(err: unknown) {
  const msg = (err instanceof Error ? err.message : String(err ?? "")).toLowerCase();
  return msg.includes("api key") || msg.includes("permission") || msg.includes("unauthorized");
}

function withTimeout<T>(p: Promise<T>, timeoutMs: number) {
  if (!timeoutMs || timeoutMs <= 0) return p;
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Request timeout")), timeoutMs);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

// =========================
// MAIN API
// =========================
export async function aiCoachSend(
  input: AiCoachSendInput,
  opts: AiCoachSendOptions = {}
): Promise<AiCoachSendResult> {
  const {
    userText,
    history = [],
    context = {},
    systemStyle = opts.systemStyle ?? "default",
    userLocale = "vi-VN",
  } = input;

  const apiKey = opts.apiKey ?? (import.meta as any).env?.VITE_GEMINI_API_KEY;
  const modelName = opts.model ?? "models/gemini-1.5-pro";

  const maxOutputTokens = Number.isFinite(opts.maxOutputTokens) ? (opts.maxOutputTokens as number) : 700;
  const temperature = Number.isFinite(opts.temperature) ? (opts.temperature as number) : 0.6;
  const topP = Number.isFinite(opts.topP) ? (opts.topP as number) : 0.9;

  const maxRetries = Number.isFinite(opts.maxRetries) ? (opts.maxRetries as number) : 4;
  const initialBackoffMs = Number.isFinite(opts.initialBackoffMs) ? (opts.initialBackoffMs as number) : 900;
  const timeoutMs = Number.isFinite(opts.timeoutMs) ? (opts.timeoutMs as number) : 20000;

  const useDemoFallback = opts.useDemoFallback !== false;

  const financialContextText = buildFinancialContextText(context, userLocale);
  const systemPrompt = buildSystemPrompt(financialContextText, systemStyle);

  // Missing key => Demo
  const hasKey = Boolean(apiKey && String(apiKey).trim().length > 10);
  if (!hasKey) {
    return {
      ok: true,
      text: buildDemoReply(financialContextText, userText),
      usedDemo: true,
      meta: { model: modelName, retries: 0, reason: "missing_api_key" },
    };
  }

  // Normalize history for Gemini (user/model)
  const safeHistory = Array.isArray(history) ? history : [];
  const geminiHistory = safeHistory
    .filter((m): m is AiCoachMessage => {
      return (
        !!m &&
        (m.role === "user" || m.role === "model") &&
        typeof m.text === "string" &&
        m.text.trim().length > 0
      );
    })
    .map((m) => ({
      role: m.role as "user" | "model",
      parts: [{ text: m.text }],
    }));

  let attempt = 0;
  let backoff = initialBackoffMs;

  while (attempt <= maxRetries) {
    try {
      const genAI = new GoogleGenerativeAI(String(apiKey));

      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { maxOutputTokens, temperature, topP },
        // Quan trọng: systemInstruction đúng chuẩn, không nhét vào history
        systemInstruction: systemPrompt,
      });

      const chat = model.startChat({ history: geminiHistory });

      const result = await withTimeout(chat.sendMessage(userText), timeoutMs);
      const text = result.response.text()?.trim();

      if (!text) {
        return {
          ok: true,
          text: "Tôi chưa nhận được nội dung trả lời. Bạn thử hỏi lại ngắn gọn hơn giúp tôi.",
          usedDemo: false,
          meta: { model: modelName, retries: attempt, reason: "empty_response" },
        };
      }

      return {
        ok: true,
        text,
        usedDemo: false,
        meta: { model: modelName, retries: attempt },
      };
    } catch (err) {
      const quota = isQuota429(err);

      if (isAuthError(err)) {
        if (useDemoFallback) {
          return {
            ok: true,
            text:
              "Tôi không gọi được AI do API key/quyền truy cập chưa đúng. Tạm thời tôi trả lời theo chế độ Demo.\n\n" +
              buildDemoReply(financialContextText, userText),
            usedDemo: true,
            meta: { model: modelName, retries: attempt, reason: "auth_error" },
          };
        }
        return {
          ok: false,
          text: "API key/quyền truy cập chưa đúng. Kiểm tra VITE_GEMINI_API_KEY.",
          usedDemo: false,
          meta: { model: modelName, retries: attempt, reason: "auth_error" },
        };
      }

      if (quota && attempt < maxRetries) {
        await sleep(backoff);
        backoff = Math.min(backoff * 2, 8000);
        attempt += 1;
        continue;
      }

      if (useDemoFallback) {
        const reason = quota ? "quota_429" : "runtime_error";
        return {
          ok: true,
          text:
            (quota
              ? "Hiện đang bị giới hạn quota (429). Tôi chuyển sang chế độ Demo để vẫn tư vấn được.\n\n"
              : "Tôi gặp lỗi khi gọi AI. Tôi chuyển sang chế độ Demo để vẫn tư vấn được.\n\n") +
            buildDemoReply(financialContextText, userText),
          usedDemo: true,
          meta: { model: modelName, retries: attempt, reason },
        };
      }

      return {
        ok: false,
        text: err instanceof Error ? err.message : String(err),
        usedDemo: false,
        meta: { model: modelName, retries: attempt, reason: quota ? "quota_429" : "runtime_error" },
      };
    }
  }

  return {
    ok: false,
    text: "Unknown error",
    usedDemo: false,
    meta: { model: modelName, retries: maxRetries, reason: "unknown" },
  };
}
