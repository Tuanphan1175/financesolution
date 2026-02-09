// components/AICoach.tsx
<<<<<<< Updated upstream
import React, { useEffect, useMemo, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Transaction, Asset, Liability, JourneyProgress, GoldenRule } from "../types";
import { SparklesIcon, ArrowUpIcon } from "./Icons";

// =========================
// TYPES
// =========================
type Role = "user" | "model";

interface Message {
  id: string;
  role: Role;
  text: string;
  ts: number;
}

export interface AICoachProps {
  transactions?: Transaction[];
  assets?: Asset[];
  liabilities?: Liability[];
  journeyProgress?: JourneyProgress;
  goldenRules?: GoldenRule[];
}

// =========================
// HELPERS
// =========================
const fmtMoney = (v: number) =>
  (Number.isFinite(v) ? Math.round(v) : 0).toLocaleString("vi-VN");

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

function buildFinancialContext(
  transactions: Transaction[],
  assets: Asset[],
  liabilities: Liability[],
  goldenRules: GoldenRule[]
) {
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

  // 6 jars (45/20/10/10/10/5) — đồng bộ nhãn
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
  lines.push(`- Thu nhập tháng: ${fmtMoney(incomeThisMonth)} đ`);
  lines.push(`- Chi tiêu tháng: ${fmtMoney(expenseThisMonth)} đ`);
  lines.push(`- Dòng tiền ròng (cashflow): ${fmtMoney(cashflowThisMonth)} đ`);
  lines.push("");
  lines.push("TÀI SẢN & NỢ:");
  lines.push(`- Tổng tài sản: ${fmtMoney(totalAssets)} đ`);
  lines.push(`- Tổng nợ: ${fmtMoney(totalLiabilities)} đ`);
  lines.push(`- Tài sản ròng: ${fmtMoney(netWorth)} đ`);
  lines.push(`- Nợ thẻ tín dụng: ${fmtMoney(ccDebt)} đ`);
  lines.push(`- Nợ vay/ thế chấp: ${fmtMoney(loanDebt)} đ`);
  lines.push("");
  lines.push(
    `KỶ LUẬT (Golden Rules): ${
      rulesTotal > 0 ? `${rulesOk}/${rulesTotal} (${rulesRate}%)` : "chưa có dữ liệu"
    }`
  );

  if (jars) {
    lines.push("");
    lines.push("GỢI Ý PHÂN BỔ 6 CHIẾC LỌ (theo thu nhập tháng hiện tại):");
    lines.push(`- 45% Nhu cầu: ${fmtMoney(jars.needs45)} đ`);
    lines.push(`- 20% Tự do tài chính: ${fmtMoney(jars.freedom20)} đ`);
    lines.push(`- 10% Giáo dục: ${fmtMoney(jars.edu10)} đ`);
    lines.push(`- 10% Hưởng thụ: ${fmtMoney(jars.play10)} đ`);
    lines.push(`- 10% Khẩn cấp: ${fmtMoney(jars.emergency10)} đ`);
    lines.push(`- 5% Cho đi: ${fmtMoney(jars.give5)} đ`);
  }

  return lines.join("\n");
}

function buildSystemPrompt(financialContext: string) {
  return `
Bạn là AI Financial Coach – trợ lý tài chính cá nhân trong ứng dụng Tài Chính Thông Minh.

Cách xưng hô (bắt buộc):
- Gọi người dùng là “bạn”
- Xưng là “tôi”

Nguyên tắc tư vấn (bắt buộc):
1) Ưu tiên DÒNG TIỀN DƯƠNG. Nếu cashflow âm → giảm chi + tăng thu + chặn nợ xấu.
2) Phân biệt TÀI SẢN vs TIÊU SẢN:
   - Tài sản: tạo dòng tiền/ tăng giá trị dài hạn.
   - Tiêu sản: tiêu tiền, hao mòn, rủi ro nợ tiêu dùng.
   → Nếu bạn muốn mua tiêu sản khi dòng tiền yếu: phản biện rõ ràng và đưa phương án thay thế.
3) “6 chiếc lọ” là khung kỷ luật: hướng dẫn áp dụng theo thu nhập thực tế.
4) Không hứa hẹn làm giàu nhanh. Không khuyến nghị lĩnh vực bạn không hiểu.
5) Kết thúc câu trả lời luôn có:
   - 1 câu chốt
   - 3 việc làm ngay trong 7 ngày
   - 1 câu hỏi ngược để chẩn đoán tiếp
6) Phong cách:
- Chuyên nghiệp, trung lập, đáng tin cậy (phù hợp app thương mại)
- Không giống bác sĩ hay người quen.
=======
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  Transaction,
  Asset,
  Liability,
  JourneyProgress,
  GoldenRule,
} from '../types';
import { SparklesIcon, ArrowUpIcon } from './Icons';
import { calculatePyramidStatus } from '../lib/pyramidLogic';

interface AICoachProps {
  transactions: Transaction[];
  assets: Asset[];
  liabilities: Liability[];
  journeyProgress: JourneyProgress;
  goldenRules: GoldenRule[];
  isPremium: boolean;
  setIsPricingModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const DEFAULT_GREETING: Message = {
  id: 'greeting',
  role: 'model',
  text:
    'Chào bạn, tôi là AI Financial Coach của Dr. Tuấn.\n' +
    'Bạn muốn tôi giúp phần nào trước: (1) Dòng tiền, (2) Nợ, (3) Ngân sách, hay (4) Kế hoạch tăng tài sản?',
};

function safeVND(n: number): string {
  try {
    return (Number.isFinite(n) ? n : 0).toLocaleString('vi-VN');
  } catch {
    return String(n);
  }
}

function getGeminiApiKey(): string {
  // Ưu tiên ENV của Vite
  const envKey = (import.meta as any)?.env?.VITE_GEMINI_API_KEY as string | undefined;
  if (envKey && envKey.trim()) return envKey.trim();

  // Fallback: localStorage (không bắt buộc)
  const lsKey = localStorage.getItem('smartfinance_gemini_api_key');
  if (lsKey && lsKey.trim()) return lsKey.trim();

  return '';
}

export const AICoach: React.FC<AICoachProps> = ({
  transactions,
  assets,
  liabilities,
  journeyProgress,
  goldenRules,
  isPremium,
  setIsPricingModalOpen,
}) => {
  const [messages, setMessages] = useState<Message[]>([DEFAULT_GREETING]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- 1) TÍNH CONTEXT TÀI CHÍNH ---
  const financialContext = useMemo(() => {
    const pyramidStatus = calculatePyramidStatus(
      transactions,
      assets,
      liabilities,
      goldenRules
    );

    const { currentLevel, metrics } = pyramidStatus;

    const totalAssets = assets.reduce((sum, a) => sum + (a.amount ?? 0), 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + (l.amount ?? 0), 0);
    const netWorth = totalAssets - totalLiabilities;

    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount ?? 0), 0);

    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount ?? 0), 0);

    const cashflow = income - expense;

    const completed = journeyProgress?.completedTaskIds?.length ?? 0;
    const day = journeyProgress?.currentDay ?? 0;

    return `
DỮ LIỆU TÀI CHÍNH HIỆN TẠI (tóm tắt):
- Cấp độ tháp tài sản: ${currentLevel?.name ?? 'Chưa xác định'}
- Tổng Tài sản: ${safeVND(totalAssets)} đ
- Tổng Nợ: ${safeVND(totalLiabilities)} đ
- Tài sản ròng (Net Worth): ${safeVND(netWorth)} đ
- Thu nhập: ${safeVND(income)} đ
- Chi tiêu: ${safeVND(expense)} đ
- Dòng tiền ròng (Cashflow): ${safeVND(cashflow)} đ

- Journey: Ngày hiện tại: ${day}; Nhiệm vụ đã hoàn thành: ${completed}
- Metrics (nếu có): ${JSON.stringify(metrics ?? {}, null, 0)}
`.trim();
  }, [transactions, assets, liabilities, goldenRules, journeyProgress]);

  // --- 2) SYSTEM PROMPT ---
  const SYSTEM_PROMPT = useMemo(() => {
    return `
BẠN LÀ AI FINANCIAL COACH ĐỘC QUYỀN CỦA DR. TUẤN.
Nhiệm vụ: Tư vấn tài chính dựa trên dữ liệu người dùng và KHO KIẾN THỨC CHUYÊN GIA dưới đây.

--- KHO KIẾN THỨC TỪ TÀI LIỆU CỦA DR. TUẤN ---

PHẦN 1: QUẢN LÝ TÀI CHÍNH CÁ NHÂN
1) Quy tắc cốt tử: "Không quan trọng bạn kiếm bao nhiêu, quan trọng bạn giữ được bao nhiêu."
2) Phương pháp 6 Chiếc Lọ (JARS) gợi ý:
   - 55% Nhu cầu thiết yếu
   - 10% Tiết kiệm dài hạn (Pay yourself first)
   - 10% Giáo dục
   - 10% Hưởng thụ (Play) - nên tiêu hết để cân bằng
   - 10% Quỹ dự phòng khẩn cấp
   - 5% Cho đi
3) Tư duy dòng tiền: ưu tiên dòng tiền dương (+). Kiểm soát chi phí nhỏ lẻ (Latte factor).

PHẦN 2: ĐẦU TƯ - NHÂN TIỀN & GIỮ TIỀN
1) Tài sản vs Tiêu sản:
   - Tài sản: tạo tiền về túi bạn
   - Tiêu sản: rút tiền khỏi túi bạn
   -> Mua tài sản trước. Tiêu sản nên mua bằng lãi từ tài sản.
2) Lãi kép & tâm lý: kiên trì, tránh bẫy làm giàu nhanh, kiểm soát FOMO/hoảng loạn.
3) Giữ tiền: đa dạng hóa, không đầu tư thứ không hiểu.

PHONG CÁCH TƯ VẤN
- Nếu người dùng định mua tiêu sản khi dòng tiền yếu: CẢNH BÁO RÕ RÀNG.
- Luôn trích dẫn nguyên tắc (6 chiếc lọ, tài sản/tiêu sản, dòng tiền…).
- Ngắn gọn, súc tích, thực chiến.
- Không hù dọa, không phán xét. Đưa checklist hành động.
>>>>>>> Stashed changes

DỮ LIỆU NGƯỜI DÙNG:
${financialContext}
`.trim();
<<<<<<< Updated upstream
}

function buildDemoReply(financialContext: string, userText: string) {
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
  lines.push(financialContext);
  return lines.join("\n");
}

function friendlyErrorMessage(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err ?? "Unknown error");
  const lower = msg.toLowerCase();

  if (
    lower.includes("429") ||
    lower.includes("quota") ||
    lower.includes("resource_exhausted") ||
    lower.includes("too many requests")
  ) {
    return "Hiện hệ thống đang bị giới hạn quota (429). Tôi chuyển sang chế độ Demo để vẫn tư vấn được.";
  }
  if (lower.includes("api key") || lower.includes("permission") || lower.includes("unauthorized")) {
    return "Tôi không gọi được AI vì API key/quyền truy cập chưa đúng. Bạn kiểm tra VITE_GEMINI_API_KEY trong môi trường triển khai.";
  }
  if (lower.includes("404") || lower.includes("not found") || lower.includes("models/")) {
    return "Model AI hiện không khả dụng (404). Bạn kiểm tra tên model đang dùng và phiên bản API.";
  }
  return `Lỗi kết nối AI: ${msg}`;
}

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// =========================
// COMPONENT
// =========================
export const AICoach: React.FC<AICoachProps> = ({
  transactions = [],
  assets = [],
  liabilities = [],
  journeyProgress = {},
  goldenRules = [],
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const didInit = useRef(false);

  const financialContext = useMemo(
    () => buildFinancialContext(transactions, assets, liabilities, goldenRules),
    [transactions, assets, liabilities, goldenRules]
  );

  const SYSTEM_PROMPT = useMemo(() => buildSystemPrompt(financialContext), [financialContext]);

  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;
  const hasKey = Boolean(apiKey && String(apiKey).trim().length > 10);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const hello: Message = {
      id: makeId("m"),
      role: "model",
      ts: Date.now(),
      text:
        "Chào bạn. Tôi là AI Financial Coach.\n\n" +
        "Bạn có thể hỏi về: dòng tiền, kỷ luật chi tiêu, trả nợ, tích lũy, hoặc chiến lược tài sản.\n" +
        "Tôi sẽ trả lời theo hướng thực chiến và kèm bước hành động.",
    };
    setMessages([hello]);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  async function callGemini(userText: string, history: Message[]) {
    if (!hasKey) return buildDemoReply(financialContext, userText);

    const genAI = new GoogleGenerativeAI(String(apiKey));

    // Model đúng chuẩn để tránh 404
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-pro",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        maxOutputTokens: 700,
        temperature: 0.6,
        topP: 0.9,
      },
    });

    const geminiHistory = history
      .filter((m) => m.role === "user" || m.role === "model")
      .map((m) => ({
        role: (m.role === "user" ? "user" : "model") as const,
        parts: [{ text: m.text }],
      }));

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(userText);

    const text = result.response.text()?.trim();
    return text || "Tôi chưa nhận được nội dung trả lời. Bạn thử hỏi lại ngắn gọn hơn giúp tôi.";
  }

  async function handleSend() {
    const userText = input.trim();
    if (!userText || isLoading) return;

    const userMsg: Message = { id: makeId("u"), role: "user", text: userText, ts: Date.now() };

    // đảm bảo history truyền vào callGemini là bản mới nhất
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const nextHistory = [...messages, userMsg];
      const reply = await callGemini(userText, nextHistory);

      const modelMsg: Message = { id: makeId("a"), role: "model", text: reply, ts: Date.now() };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      const note = friendlyErrorMessage(err);
      const fallback = buildDemoReply(financialContext, userText);

      const modelMsg: Message = {
        id: makeId("e"),
        role: "model",
        ts: Date.now(),
        text: `${note}\n\n-----\nDEMO COACH (fallback):\n${fallback}`,
      };
      setMessages((prev) => [...prev, modelMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  const headerSub = hasKey ? "Gemini đang hoạt động" : "Demo mode (chưa có API key)";

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] min-h-[600px] rounded-3xl border border-slate-800 bg-slate-950/40 overflow-hidden shadow-premium">
      {/* HEADER */}
      <div className="shrink-0 px-6 py-4 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-luxury-gold/90 flex items-center justify-center">
            <SparklesIcon className="h-6 w-6 text-black" />
          </div>
          <div className="min-w-0">
            <div className="text-white font-black tracking-tight text-lg truncate">
              AI Financial Coach
            </div>
            <div className="text-slate-400 text-xs">{headerSub}</div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
        {/* quick context card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-slate-200 text-sm whitespace-pre-wrap">
          <div className="text-slate-400 text-[11px] font-black uppercase tracking-[0.25em] mb-2">
            Context (tự động)
          </div>
          {financialContext}
          {Object.keys(journeyProgress || {}).length > 0 ? (
            <div className="mt-3 text-slate-500 text-xs">
              Ghi chú: Có dữ liệu hành trình thói quen; nếu bạn muốn, tôi có thể nhắc “việc nhỏ mỗi ngày” theo mục tiêu.
            </div>
          ) : null}
        </div>

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={[
                "max-w-[88%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed",
                m.role === "user"
                  ? "bg-luxury-gold text-black font-semibold"
                  : "bg-slate-900/70 border border-slate-800 text-slate-100",
              ].join(" ")}
            >
              {m.text}
=======
  }, [financialContext]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const appendMessage = (role: Message['role'], text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}_${Math.random().toString(16).slice(2)}`, role, text },
    ]);
  };

  const handleSendMessage = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || isLoading) return;

    // Gating Premium (tránh gọi API nếu chưa Premium)
    if (!isPremium) {
      appendMessage('user', trimmed);
      appendMessage(
        'model',
        'Tính năng AI Coach đang thuộc gói Premium.\nBạn bấm “Nâng cấp” để mở khóa, hoặc bật Dev Toggle VIP để thử.'
      );
      setInput('');
      setIsPricingModalOpen(true);
      return;
    }

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      appendMessage('user', trimmed);
      appendMessage(
        'model',
        'Thiếu API Key cho Gemini.\n' +
          'Cách làm nhanh:\n' +
          '1) Tạo file .env.local ở root\n' +
          '2) Thêm: VITE_GEMINI_API_KEY=YOUR_KEY\n' +
          '3) Restart dev server.\n' +
          'Hoặc lưu vào localStorage key: smartfinance_gemini_api_key'
      );
      setInput('');
      return;
    }

    appendMessage('user', trimmed);
    setInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const history = [
        { role: 'user' as const, parts: [{ text: SYSTEM_PROMPT }] },
        ...messages
          .filter((m) => m.id !== 'greeting') // greeting là UI thôi, không cần đưa vào context
          .map((m) => ({
            role: m.role,
            parts: [{ text: m.text }],
          })),
      ];

      const chat = model.startChat({ history });

      const result = await chat.sendMessage(trimmed);
      const response = result.response.text();

      appendMessage('model', response || 'Tôi chưa nhận được phản hồi rõ ràng. Bạn hỏi lại giúp tôi nhé.');
    } catch (err: any) {
      const msg =
        (err?.message as string) ||
        'Lỗi không xác định khi gọi AI. Bạn kiểm tra lại API Key và kết nối mạng.';
      appendMessage('model', `Lỗi kết nối AI: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-teal-500 p-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center">
          <SparklesIcon className="h-6 w-6 text-white mr-2" />
          <div>
            <h3 className="text-white font-bold text-lg">AI Financial Coach</h3>
            <p className="text-white/80 text-xs">Powered by Dr. Tuấn Knowledge</p>
          </div>
        </div>

        {!isPremium && (
          <button
            onClick={() => setIsPricingModalOpen(true)}
            className="text-[11px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors"
          >
            Nâng cấp
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
        {/* Context teaser */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-3">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-2">
            Snapshot
          </div>
          <pre className="text-[12px] leading-5 text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
            {financialContext}
          </pre>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border dark:border-gray-600'
              }`}
            >
              {msg.text}
>>>>>>> Stashed changes
            </div>
          </div>
        ))}

<<<<<<< Updated upstream
        {isLoading ? (
          <div className="text-slate-400 text-sm animate-pulse">
            Đang phân tích dữ liệu và lập khuyến nghị...
          </div>
        ) : null}
      </div>

      {/* INPUT */}
      <div className="shrink-0 px-5 py-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder='Ví dụ: "Tháng này chi vượt, nên cắt gì trước?"'
            className="flex-1 rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-luxury-gold/40"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="h-12 w-12 rounded-2xl bg-luxury-gold text-black flex items-center justify-center disabled:opacity-40"
            aria-label="Gửi"
          >
            <ArrowUpIcon className="h-6 w-6 rotate-90" />
          </button>
        </div>

        {!hasKey ? (
          <div className="mt-3 text-xs text-slate-500">
            Gợi ý: đặt <b>VITE_GEMINI_API_KEY</b> trong Environment Variables (Vercel) để bật AI thật.
          </div>
        ) : null}
=======
        {isLoading && (
          <div className="text-gray-500 text-sm ml-2 animate-pulse">
            Đang phân tích dữ liệu...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage(input);
            }}
            placeholder="Hỏi về đầu tư, chi tiêu, nợ, ngân sách..."
            className="flex-1 border rounded-full px-4 py-2 focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage(input)}
            disabled={isLoading}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white p-2 rounded-full transition-colors"
            title="Gửi"
          >
            <ArrowUpIcon className="h-6 w-6 transform rotate-90" />
          </button>
        </div>

        {!isPremium && (
          <div className="mt-2 text-[12px] text-gray-500 dark:text-gray-400">
            AI Coach đang khóa theo gói. Bấm “Nâng cấp” để mở.
          </div>
        )}
>>>>>>> Stashed changes
      </div>
    </div>
  );
};
