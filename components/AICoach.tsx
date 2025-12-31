import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai"; // Thư viện chuẩn
import { Transaction, Asset, Liability, JourneyProgress, GoldenRule } from '../types';
import { SparklesIcon, ArrowUpIcon } from './Icons';
import { JOURNEY_30_DAYS } from '../constants';
import { calculatePyramidStatus } from '../lib/pyramidLogic';
import { EXPERT_KNOWLEDGE } from '../lib/expertKnowledge'; // Import EXPERT_KNOWLEDGE

interface AICoachProps {
    transactions: Transaction[];
    assets: Asset[];
    liabilities: Liability[];
    journeyProgress: JourneyProgress;
    goldenRules: GoldenRule[];
    setIsPricingModalOpen: (isOpen: boolean) => void;
    isPremium: boolean; // Nhận isPremium từ props
}

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

export const AICoach: React.FC<AICoachProps> = ({ transactions, assets, liabilities, journeyProgress, goldenRules, setIsPricingModalOpen, isPremium }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    // --- LOGIC PREMIUM VÀ DEV TOOL ---
    // const [isPremium, setIsPremium] = useState(false); // Xóa dòng này
    const [showDevTool, setShowDevTool] = useState(false); // State để hiển thị/ẩn Dev Tool

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

    // --- 2. SYSTEM PROMPT ---
    const SYSTEM_PROMPT = `
    BẠN LÀ AI FINANCIAL COACH ĐỘC QUYỀN CỦA DR. TUẤN. Nhiệm vụ: Tư vấn tài chính dựa trên dữ liệu người dùng và KHO KIẾN THỨC CHUYÊN GIA dưới đây.

    --- KHO KIẾN THỨC TỪ TÀI LIỆU CỦA DR. TUẤN ---

    PHẦN 1: QUẢN LÝ TÀI CHÍNH CÁ NHÂN

    Quy tắc cốt tử: "Không quan trọng bạn kiếm bao nhiêu, quan trọng bạn giữ được bao nhiêu."

    Phương pháp 6 Chiếc Lọ (JARS): Khuyên người dùng phân bổ thu nhập:

    55%: Nhu cầu thiết yếu (Ăn uống, sinh hoạt).

    10%: Tiết kiệm dài hạn/Tự do tài chính (Tuyệt đối không tiêu).

    10%: Giáo dục/Phát triển bản thân.

    10%: Hưởng thụ (Play) - Cần tiêu hết mỗi tháng để cân bằng cảm xúc.

    10%: Quỹ dự phòng khẩn cấp.

    5%: Cho đi (Thiện nguyện).

    Tư duy Dòng tiền: Luôn ưu tiên dòng tiền dương (+). Kiểm soát chi phí nhỏ lẻ (Latte factor).

    PHẦN 2: ĐẦU TƯ - NHÂN TIỀN & GIỮ TIỀN

    Tài sản vs Tiêu sản:

    Tài sản: Những thứ bỏ tiền vào túi bạn (BĐS dòng tiền, Cổ phiếu giá trị, Vàng, Doanh nghiệp).

    Tiêu sản: Những thứ lấy tiền ra khỏi túi bạn (Xe cộ xa xỉ, Điện thoại đời mới, Nợ tiêu dùng).

    -> Lời khuyên: Tập trung mua Tài sản trước, dùng lãi từ Tài sản để mua Tiêu sản.

    Lãi kép (Kỳ quan thứ 8):

    Thời gian là yếu tố quan trọng nhất. Hãy bắt đầu ngay lập tức.

    Kiên trì kỷ luật quan trọng hơn thông minh đột xuất.

    Nguyên tắc Giữ tiền:

    Không bao giờ đầu tư vào lĩnh vực mình không hiểu rõ (Vùng hiểu biết).

    Tránh bẫy FOMO (Sợ bỏ lỡ) và lòng tham làm giàu nhanh.

    Đa dạng hóa danh mục: "Không bỏ trứng một giỏ".

    PHONG CÁCH TƯ VẤN:

    Nếu người dùng muốn mua tiêu sản (Xe, điện thoại...) khi chưa có quỹ dự phòng -> Hãy CAN NGĂN MẠNH MẼ.

    Luôn yêu cầu người dùng trích 10% thu nhập để trả cho mình trước (Pay yourself first).

    Giọng văn: Chuyên gia, điềm đạm, thực tế, nhưng quyết liệt về kỷ luật.

    DỮ LIỆU NGƯỜI DÙNG: ${financialContext}
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
        if (!isPremium) { // Nếu không phải Premium, không cho gửi tin nhắn
            setIsPricingModalOpen(true); // Mở modal thanh toán
            return;
        }

        // Optimistic Update
        const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setIsLoading(true);

      try {
      // --- BẮT ĐẦU ĐOẠN CODE SỬA ---
      
      // 1. Điền TRỰC TIẾP chìa khóa vào đây (Bỏ qua Settings)
      const API_KEY_DIRECT = "AIzaSyD2QvJkU4PYY-G-muQLic4DbhMu349-hyl"; 
      
      if (API_KEY_DIRECT.includes("Dán mã")) {
          throw new Error("Anh chưa dán API Key mới vào code!");
      }

      // 2. Khởi tạo AI với chìa khóa cứng
      const genAI = new GoogleGenerativeAI(API_KEY_DIRECT);

      // 3. Dùng Model Flash 1.5 chuẩn
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        systemInstruction: SYSTEM_PROMPT,
      });

      // 4. Tạo đoạn chat
      const chat = model.startChat({
        history: [
            { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
            ...messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }],
            }))
        ],
      });

      // 5. Gửi tin nhắn
      const result = await chat.sendMessage(userText);
      let response = result.response.text();
      
      // Xử lý để loại bỏ ký tự markdown ** và đảm bảo xuống dòng
      response = response.replace(/\*\*/g, '').trim(); // Loại bỏ **

      // Tách các dòng, loại bỏ dòng trống và dấu gạch ngang
      const lines = response.split('\n')
                            .map(line => line.replace(/^- /, '').trim()) // Bỏ dấu gạch ngang đầu dòng
                            .filter(line => line !== '');

      let formattedResponse = '';
      if (lines.length > 0) {
          // Giữ nguyên câu chào đầu tiên nếu có, không đánh số
          let startIndex = 0;
          if (lines[0].toLowerCase().includes("chào bạn") || lines[0].toLowerCase().includes("xin chào")) {
              formattedResponse += lines[0] + '\n';
              startIndex = 1;
          }

          // Đánh số thứ tự cho các ý còn lại
          for (let i = startIndex; i < lines.length; i++) {
              formattedResponse += `${i - startIndex + 1}. ${lines[i]}\n`;
          }
      }
      response = formattedResponse.trim(); // Loại bỏ dòng trống cuối cùng nếu có

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
        <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative">
            {/* Dev Tool Button */}
            {/* Nút Dev Tool này sẽ được chuyển sang Sidebar */}
            {/* 
            <button 
                onClick={() => setShowDevTool(!showDevTool)}
                className="fixed top-4 left-4 z-50 p-2 bg-gray-700 text-white rounded-full text-xs"
            >
                Dev
            </button>
            {showDevTool && (
                <div className="fixed top-16 left-4 z-50 bg-gray-800 p-3 rounded-lg shadow-lg flex flex-col space-y-2">
                    <label className="flex items-center text-white text-sm">
                        <input 
                            type="checkbox" 
                            checked={isPremium} 
                            onChange={() => setIsPremium(!isPremium)} 
                            className="mr-2"
                        />
                        Premium Mode
                    </label>
                </div>
            )}
            */}

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
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50 ${!isPremium ? 'blur-sm' : ''}`}>
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

            {/* Paywall Overlay */}
            {!isPremium && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-10 p-4">
                    <SparklesIcon className="h-16 w-16 text-luxury-gold mb-4 animate-pulse" />
                    <p className="text-xl md:text-2xl font-bold text-white text-center mb-6">
                        Tính năng dành riêng cho Hội viên Kỷ luật
                    </p>
                    <button 
                        onClick={() => setIsPricingModalOpen(true)}
                        className="px-8 py-4 bg-luxury-gold text-black font-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 uppercase tracking-widest"
                    >
                        Nâng cấp ngay
                    </button>
                </div>
            )}

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
                        disabled={isLoading || !isPremium}
                    />
                    <button
                        onClick={() => handleSendMessage(input)}
                        disabled={isLoading || !input.trim() || !isPremium}
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