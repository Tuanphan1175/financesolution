import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
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

    // --- 1. CALCULATE CONTEXT LOGIC ---
    const calculateFinancialContext = () => {
        // Fix: Added goldenRules as the 4th argument to satisfy the calculatePyramidStatus signature
        const pyramidStatus = calculatePyramidStatus(transactions, assets, liabilities, goldenRules);
        const { currentLevel, metrics } = pyramidStatus;

        // Fix: Calculate totalAssets and totalLiabilities locally because they do not exist on the metrics object
        const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
        const totalLiabilities = liabilities.reduce((sum, l) => sum + l.amount, 0);

        // Journey Progress
        const completedDays = Object.keys(journeyProgress).length;
        // Find next incomplete task
        let nextTask = JOURNEY_30_DAYS[0];
        for(let i=1; i<=30; i++) {
             if(!journeyProgress[i]?.completed) {
                 nextTask = JOURNEY_30_DAYS.find(t => t.day === i) || JOURNEY_30_DAYS[0];
                 break;
             }
        }

        return `
        DỮ LIỆU TÀI CHÍNH NGƯỜI DÙNG:
        - Tầng Tháp Tài Chính: ${currentLevel.id} (${currentLevel.name})
        - Thu nhập TB (3 tháng): ${metrics.avgIncome.toLocaleString('vi-VN')} VND
        - Chi tiêu TB (3 tháng): ${metrics.avgExpense.toLocaleString('vi-VN')} VND
        - Quỹ dự phòng: ${metrics.emergencyFundMonths.toFixed(1)} tháng chi tiêu
        - Tổng tài sản: ${totalAssets.toLocaleString('vi-VN')} VND
        - Tổng nợ: ${totalLiabilities.toLocaleString('vi-VN')} VND
        - Hành trình 30 ngày: Đã hoàn thành ${completedDays} ngày.
        - Nhiệm vụ hôm nay (Ngày ${nextTask.day}): "${nextTask.title}" - ${nextTask.action}.
        `;
    };

    const financialContext = calculateFinancialContext();

    // --- 2. SYSTEM PROMPT ---
    const SYSTEM_PROMPT = `
    VAI TRÒ: Bạn là AI Financial Coach - Người đồng hành tài chính cá nhân.
    NHIỆM VỤ: Giúp người dùng hiểu, kiểm soát và cải thiện tài chính mỗi ngày (5-10 phút). Dẫn dắt họ lên tầng tiếp theo của Tháp Tài Chính. Tập trung vào thay đổi hành vi, KHÔNG dạy lý thuyết suông.
    
    TRIẾT LÝ:
    - Không phán xét, không gây áp lực, không khuyến nghị đầu tư rủi ro.
    - Ưu tiên: Thu > Chi, Quỹ dự phòng, Kỷ luật.
    - KHUYẾN KHÍCH CỤ THỂ: Hãy nhắc người dùng mục tiêu "Tự động chuyển 15% thu nhập vào quỹ dự phòng" nếu họ chưa có quỹ dự phòng đủ 3 tháng.
    - Tinh thần: Ấm áp, ngắn gọn, đời thường.
    
    CẤU TRÚC TRẢ LỜI BẮT BUỘC (Mỗi câu trả lời PHẢI có đủ 6 phần này, ngắn gọn dưới 200 từ):
    A. CHECK-IN: Hỏi cảm xúc/tình trạng hôm nay (1-2 câu).
    B. PHẢN CHIẾU: Nhắc lại tình trạng tài chính hiện tại dựa trên Context (1-2 câu).
    C. 1 VIỆC NHỎ: Giao 1 việc cụ thể làm trong 5-10 phút (ưu tiên nhiệm vụ trong Hành trình 30 ngày nếu chưa làm).
    D. 1 CÂU HỎI COACHING: Giúp người dùng tự nhận ra vấn đề.
    E. CAM KẾT: 1 câu ngắn để người dùng đọc theo/tự hứa.
    F. KHÍCH LỆ: 1 câu động viên chân thành.

    ${financialContext}
    
    LƯU Ý: Nếu người dùng hỏi về đầu tư phức tạp, hãy lái về nền tảng tài chính vững chắc trước. Luôn kết thúc bằng việc nhắc nhở họ hoàn thành nhiệm vụ ngày.
    `;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initial Greeting
    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            handleSendMessage("Xin chào Coach, tình hình tài chính của tôi hôm nay thế nào?");
        }
    }, []);

    const handleSendMessage = async (userText: string) => {
        if (!userText.trim()) return;

        // Optimistic Update
        const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Fix: Initializing GoogleGenAI inside handleSendMessage to ensure use of latest environment API Key
            // Sửa lỗi 1: Gọi đúng tên chìa khóa (VITE_GEMINI_API_KEY) và dùng đúng lệnh (import.meta.env)
      // SỬA: Lấy chìa khóa đúng chuẩn Vite và dùng Model Flash cho nhanh
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Chưa có API Key");
      
      const ai = new GoogleGenAI(apiKey);
      const model = ai.getGenerativeModel({ 
        model: "gemini-1.5-flash", 
        systemInstruction: SYSTEM_PROMPT 
      });

      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }],
        })),
      });

      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }],
        })),
      });

            // Send message and get response
            const result = await chat.sendMessage({ message: userText });
            const text = result.text; // Access text property directly as per @google/genai guidelines

            if (text) {
                const newAiMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: text };
                setMessages(prev => [...prev, newAiMsg]);
            }

        } catch (error) {
            console.error("AI Error:", error);
            const errorMsg: Message = { 
                id: (Date.now() + 1).toString(), 
                role: 'model', 
                text: "Xin lỗi, tôi đang gặp chút sự cố kết nối. Hãy kiểm tra lại API Key hoặc thử lại sau nhé! (Lưu ý: Bạn cần có API Key hợp lệ trong biến môi trường)" 
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-teal-500 p-4 flex items-center shadow-sm shrink-0">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                    <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">AI Financial Coach</h3>
                    <p className="text-white/80 text-xs">Người đồng hành tài chính cá nhân</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`
                            max-w-[85%] md:max-w-[70%] rounded-2xl p-4 text-sm md:text-base shadow-sm whitespace-pre-wrap leading-relaxed
                            ${msg.role === 'user' 
                                ? 'bg-primary-600 text-white rounded-tr-none' 
                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-tl-none'
                            }
                        `}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shrink-0">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700 dark:text-white"
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => handleSendMessage(input)}
                        disabled={isLoading || !input.trim()}
                        className="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowUpIcon className="h-6 w-6 transform rotate-90" />
                    </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">
                    AI Coach có thể đưa ra thông tin không chính xác. Hãy cân nhắc trước khi áp dụng.
                </p>
            </div>
        </div>
    );
};