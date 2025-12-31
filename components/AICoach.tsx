import React, { useState, useEffect, useRef } from 'react';
// SỬA 1: Dùng đúng thư viện chuẩn của Google cho Web
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

    // --- 1. CALCULATE CONTEXT LOGIC ---
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
    NHIỆM VỤ: Giúp người dùng hiểu, kiểm soát và cải thiện tài chính mỗi ngày (5-10 phút).
    
    CẤU TRÚC TRẢ LỜI NGẮN GỌN (Dưới 200 từ):
    A. CHECK-IN: Hỏi thăm.
    B. PHÂN TÍCH: Dựa trên dữ liệu: ${financialContext}
    C. HÀNH ĐỘNG: Giao 1 việc nhỏ cụ thể.
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
            handleSendMessage("Xin chào Coach, tình hình tài chính của tôi hôm nay thế nào?");
        }
    }, []);

    const handleSendMessage = async (userText: string) => {
        if (!userText.trim()) return;

        const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // SỬA 2: Đã sửa lỗi chính tả trong Key (chữ í -> i)
            const API_KEY_DIRECT = "AIzaSyD2QvJkU4PYY-G-muQlic4DbhMu349-hyl"; 
            
            // SỬA 3: Khởi tạo bằng GoogleGenerativeAI (thư viện chuẩn)
            const genAI = new GoogleGenerativeAI(API_KEY_DIRECT);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: SYSTEM_PROMPT }],
                    },
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
                text: `Lỗi kết nối: ${error.message || "Vui lòng kiểm tra lại API Key."}`
            }]);
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
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 text-sm md:text-base shadow-sm whitespace-pre-wrap leading-relaxed ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-tl-none'}`}>
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
            </div>
        </div>
    );
};