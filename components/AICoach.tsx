import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai"; // Thư viện chuẩn
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

        const completedDays = Object.keys(journeyProgress).length;
        let nextTask = JOURNEY_30_DAYS[0];
        for(let i=1; i<=30; i++) {
             if(!journeyProgress[i]?.completed) {
                 nextTask = JOURNEY_30_DAYS.find(t => t.day === i) || JOURNEY_30_DAYS[0];
                 break;
             }
        }

        return `
        DỮ LIỆU TÀI CHÍNH:
        - Cấp độ: ${currentLevel.name}
        - Thu nhập TB: ${metrics.avgIncome.toLocaleString('vi-VN')} đ
        - Chi tiêu TB: ${metrics.avgExpense.toLocaleString('vi-VN')} đ
        - Tài sản: ${totalAssets.toLocaleString('vi-VN')} đ
        - Nợ: ${totalLiabilities.toLocaleString('vi-VN')} đ
        - Hành trình 30 ngày: Ngày ${nextTask.day} - ${nextTask.title}.
        `;
    };

    const financialContext = calculateFinancialContext();

    // --- 2. CÂU LỆNH HỆ THỐNG ---
    const SYSTEM_PROMPT = `
    Bạn là AI Financial Coach. Nhiệm vụ: Giúp người dùng quản lý tài chính cá nhân.
    Phong cách: Ngắn gọn, súc tích, thực tế, ân cần.
    Dữ liệu người dùng: ${financialContext}
    Hãy trả lời ngắn (dưới 150 từ), tập trung vào hành động cụ thể.
    `;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            handleSendMessage("Chào Coach, tình hình tôi thế nào?");
        }
    }, []);

    const handleSendMessage = async (userText: string) => {
        if (!userText.trim()) return;

        const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // --- QUAN TRỌNG: DÁN CHÌA KHÓA MỚI VÀO DƯỚI ĐÂY ---
            const API_KEY_DIRECT = "DÁN_MÃ_KEAIzaSyD2QvJkU4PYY-G-muQLic4DbhMu349-hyIY_MỚI_CỦA_ANH_VÀO_CHỖ_NÀY"; 
            
            if (API_KEY_DIRECT.includes("AIzaSyD2QvJkU4PYY-G-muQLic4DbhMu349-hyI")) {
                throw new Error("Anh chưa dán API Key mới vào code!");
            }

            const genAI = new GoogleGenerativeAI(API_KEY_DIRECT);
            
            // SỬA DÙNG MODEL MỚI NHẤT: GEMINI 2.0 FLASH
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
                text: `⚠️ Lỗi: ${error.message}\n(Anh hãy kiểm tra kỹ lại API Key nhé)`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-primary-600 to-teal-500 p-4 flex items-center shadow-sm shrink-0">
                <SparklesIcon className="h-6 w-6 text-white mr-2" />
                <h3 className="text-white font-bold text-lg">AI Financial Coach (Gemini 2.0)</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && <div className="text-gray-500 text-sm ml-4 animate-pulse">AI đang suy nghĩ...</div>}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
                        placeholder="Hỏi về tài chính..."
                        className="flex-1 border rounded-full px-4 py-2 focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        disabled={isLoading}
                    />
                    <button onClick={() => handleSendMessage(input)} disabled={isLoading} className="bg-primary-600 text-white p-2 rounded-full">
                        <ArrowUpIcon className="h-6 w-6 transform rotate-90" />
                    </button>
                </div>
            </div>
        </div>
    );
};