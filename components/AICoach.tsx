import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Transaction, Asset, Liability, JourneyProgress, GoldenRule } from '../types';
import { SparklesIcon, ArrowUpIcon } from './Icons';
import { JOURNEY_30_DAYS } from '../constants';
import { calculatePyramidStatus } from '../lib/pyramidLogic';

interface AICoachProps {
    transactions: Transaction[];
    assets: Asset[];
    liabilities: Liability[];
    journeyProgress: JourneyProgress;
    goldenRules: GoldenRule[];
}

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

export const AICoach: React.FC<AICoachProps> = ({ transactions, assets, liabilities, journeyProgress, goldenRules }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    // --- 1. TÍNH TOÁN DỮ LIỆU TÀI CHÍNH ---
    const calculateFinancialContext = () => {
        const pyramidStatus = calculatePyramidStatus(transactions, assets, liabilities, goldenRules);
        const { currentLevel, metrics } = pyramidStatus;
        const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
        const totalLiabilities = liabilities.reduce((sum, l) => sum + l.amount, 0);
        
        // Tính dòng tiền (Cashflow)
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const cashflow = income - expense;

        return `
        DỮ LIỆU TÀI CHÍNH HIỆN TẠI:
        - Cấp độ tháp tài sản: ${currentLevel.name}
        - Tổng Tài sản: ${totalAssets.toLocaleString('vi-VN')} đ
        - Tổng Nợ: ${totalLiabilities.toLocaleString('vi-VN')} đ
        - Dòng tiền ròng (Cashflow): ${cashflow.toLocaleString('vi-VN')} đ
        - Thu nhập: ${income.toLocaleString('vi-VN')} đ
        - Chi tiêu: ${expense.toLocaleString('vi-VN')} đ
        `;
    };

    const financialContext = calculateFinancialContext();

    // --- 2. KHO KIẾN THỨC CHUYÊN GIA (TỪ FILE PDF CỦA DR. TUẤN) ---
    const SYSTEM_PROMPT = `
    BẠN LÀ AI FINANCIAL COACH ĐỘC QUYỀN CỦA DR. TUẤN.
    Nhiệm vụ: Tư vấn tài chính dựa trên dữ liệu người dùng và KHO KIẾN THỨC CHUYÊN GIA dưới đây.

    --- KHO KIẾN THỨC TỪ TÀI LIỆU CỦA DR. TUẤN ---

    **PHẦN 1: QUẢN LÝ TÀI CHÍNH CÁ NHÂN**
    1. **Quy tắc cốt tử:** "Không quan trọng bạn kiếm bao nhiêu, quan trọng bạn giữ được bao nhiêu."
    2. **Phương pháp 6 Chiếc Lọ (JARS):** Phân bổ thu nhập chuẩn:
       - 55% Nhu cầu thiết yếu (Ăn uống, sinh hoạt).
       - 10% Tiết kiệm dài hạn/Tự do tài chính (Pay yourself first).
       - 10% Giáo dục.
       - 10% Hưởng thụ (Play) - Cần tiêu hết để cân bằng não bộ.
       - 10% Quỹ dự phòng khẩn cấp.
       - 5% Cho đi.
    3. **Tư duy Dòng tiền:** Luôn ưu tiên dòng tiền dương (+). Kiểm soát chi phí nhỏ lẻ (Latte factor).

    **PHẦN 2: ĐẦU TƯ - NHÂN TIỀN & GIỮ TIỀN**
    1. **Tài sản vs Tiêu sản (Cực kỳ quan trọng):**
       - Tài sản: Những thứ bỏ tiền vào túi bạn (BĐS dòng tiền, Cổ phiếu giá trị, Vàng).
       - Tiêu sản: Những thứ lấy tiền ra khỏi túi bạn (Xe cộ, Điện thoại đời mới, Nợ tiêu dùng).
       - -> Lời khuyên: Mua Tài sản trước. Chỉ mua Tiêu sản bằng lãi sinh ra từ Tài sản.
    2. **Lãi kép & Tâm lý:**
       - Kiên trì là chìa khóa. Tránh bẫy làm giàu nhanh.
       - Kiểm soát cảm xúc: Không FOMO khi thị trường xanh, không hoảng loạn khi đỏ.
    3. **Nguyên tắc Giữ tiền:**
       - Không bỏ trứng một giỏ (Đa dạng hóa).
       - Không đầu tư vào lĩnh vực không hiểu rõ.

    **PHONG CÁCH TƯ VẤN:**
    - Nếu người dùng định mua Tiêu sản (Xe, điện thoại...) khi dòng tiền yếu -> CAN NGĂN QUYẾT LIỆT.
    - Luôn trích dẫn nguyên tắc (Ví dụ: "Theo nguyên tắc 6 chiếc lọ...", "Đây là tiêu sản vì...").
    - Ngắn gọn, súc tích, thực chiến.

    **DỮ LIỆU NGƯỜI DÙNG:**
    ${financialContext}
    `;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (userText: string) => {
        if (!userText.trim()) return;

        const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // --- QUAN TRỌNG: DÁN API KEY CỦA ANH VÀO DƯỚI ĐÂY ---
            const API_KEY_DIRECT = "DÁN_MÃ_KEY_CỦA_ANH_VÀO_CHỖ_NÀY"; 
            
            if (!API_KEY_DIRECT || API_KEY_DIRECT.includes("DÁN_MÃ")) {
                throw new Error("⚠️ Anh chưa dán API Key! Hãy sửa trong code components/AICoach.tsx");
            }

            const genAI = new GoogleGenerativeAI(API_KEY_DIRECT);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

            const chat = model.startChat({
                history: [
                    { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
                    ...messages.map(m => ({
                        role: m.role === 'user' ? 'user' : 'model',
                        parts: [{ text: m.text }],
                    }))
                ],
            });

            const result = await chat.sendMessage(userText);
            const response = result.response.text();

            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: response }]);
        } catch (error: any) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { 
                id: Date.now().toString(), 
                role: 'model', 
                text: `⚠️ Lỗi kết nối: ${error.message}. Anh hãy kiểm tra lại API Key nhé.`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-teal-500 p-4 flex items-center shadow-sm shrink-0">
                <SparklesIcon className="h-6 w-6 text-white mr-2" />
                <div>
                    <h3 className="text-white font-bold text-lg">AI Financial Coach</h3>
                    <p className="text-white/80 text-xs">Powered by Dr. Tuan's Knowledge</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        <p>Chào bạn, tôi là trợ lý tài chính của Dr. Tuấn.</p>
                        <p className="text-sm mt-2">Tôi có thể giúp gì cho dòng tiền của bạn hôm nay?</p>
                    </div>
                )}
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border dark:border-gray-600'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && <div className="text-gray-500 text-sm ml-4 animate-pulse">Đang phân tích dữ liệu...</div>}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
                        placeholder="Hỏi về đầu tư, chi tiêu, nợ..."
                        className="flex-1 border rounded-full px-4 py-2 focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        disabled={isLoading}
                    />
                    <button onClick={() => handleSendMessage(input)} disabled={isLoading} className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full transition-colors">
                        <ArrowUpIcon className="h-6 w-6 transform rotate-90" />
                    </button>
                </div>
            </div>
        </div>
    );
};