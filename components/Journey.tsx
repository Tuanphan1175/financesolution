
import React, { useMemo } from 'react';
import { Transaction, Asset, Liability } from '../types';
import { ShieldCheckIcon, TrendingUpIcon, ExclamationIcon, CheckCircleIcon, ChartPieIcon } from './Icons';

interface JourneyProps {
    assets: number;
    liabilities: number;
    emergencyFund: number;
    monthlyExpenses: number; // This prop is passed but we might recalculate more precisely inside
    transactions?: Transaction[]; // Added to access history for 3-month avg
}

interface LevelConfig {
    id: number;
    name: string;
    description: string;
    color: string;
    bg: string;
    textColor: string;
    criteria: string;
}

const LEVELS: LevelConfig[] = [
    { id: 7, name: 'Thịnh Vượng', description: 'Sống để cống hiến & tạo giá trị', color: 'bg-teal-500', bg: 'bg-teal-50', textColor: 'text-teal-700', criteria: 'Thụ động >> Chi tiêu' },
    { id: 6, name: 'Tự Do Tài Chính', description: 'Không phụ thuộc thu nhập chủ động', color: 'bg-emerald-500', bg: 'bg-emerald-50', textColor: 'text-emerald-700', criteria: 'Thụ động ≥ Chi tiêu' },
    { id: 5, name: 'Đầu Tư', description: 'Tiền bắt đầu sinh ra tiền', color: 'bg-blue-500', bg: 'bg-blue-50', textColor: 'text-blue-700', criteria: 'Có dòng tiền thụ động' },
    { id: 4, name: 'Tích Lũy', description: 'An tâm trước biến cố lớn', color: 'bg-indigo-500', bg: 'bg-indigo-50', textColor: 'text-indigo-700', criteria: 'Quỹ dự phòng ≥ 6 tháng' },
    { id: 3, name: 'Dư Dả', description: 'Bắt đầu có tiền để dành', color: 'bg-cyan-500', bg: 'bg-cyan-50', textColor: 'text-cyan-700', criteria: 'Dư dả ≥ 1 tháng' },
    { id: 2, name: 'Ổn Định', description: 'Đủ sống, nhưng chưa an toàn', color: 'bg-yellow-500', bg: 'bg-yellow-50', textColor: 'text-yellow-700', criteria: 'Thu ≥ Chi' },
    { id: 1, name: 'Sống Sót', description: 'Nguy cơ khủng hoảng cao', color: 'bg-red-500', bg: 'bg-red-50', textColor: 'text-red-700', criteria: 'Thu < Chi' },
];

export const Journey: React.FC<JourneyProps> = ({ assets, emergencyFund, transactions = [] }) => {
    // 1. Calculate Metrics (Avg 3 Months)
    const metrics = useMemo(() => {
        const now = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);

        const recentTrans = transactions.filter(t => new Date(t.date) >= threeMonthsAgo);
        
        const totalIncome = recentTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = recentTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        
        // Count distinct months to average correctly (simplified)
        const monthsCount = 3; 

        const avgMonthlyIncome = totalIncome / monthsCount;
        const avgMonthlyExpense = totalExpense / monthsCount;
        
        // Passive Income: Assume 'business' income or specific category 'cat-9' (Business) or investment assets yield
        // For demo: Let's assume income from AccountType 'business' is "Passive-ish" or separate it. 
        // Better: Filter income transactions where category implies investment/business.
        const passiveIncomeTrans = recentTrans.filter(t => t.type === 'income' && (t.accountType === 'business')); 
        const avgPassiveIncome = passiveIncomeTrans.reduce((sum, t) => sum + t.amount, 0) / monthsCount;

        const emergencyMonths = avgMonthlyExpense > 0 ? emergencyFund / avgMonthlyExpense : 0;

        return {
            avgIncome: avgMonthlyIncome,
            avgExpense: avgMonthlyExpense,
            emergencyFundMonths: emergencyMonths,
            passiveIncome: avgPassiveIncome
        };
    }, [transactions, emergencyFund]);

    // 2. Determine Level based on Logic
    const currentLevelId = useMemo(() => {
        const { avgIncome, avgExpense, emergencyFundMonths, passiveIncome } = metrics;
        
        if (avgIncome <= avgExpense) return 1;
        if (avgIncome > avgExpense && emergencyFundMonths < 1) return 2;
        if (avgIncome > avgExpense && emergencyFundMonths >= 1 && emergencyFundMonths < 6) return 3;
        if (emergencyFundMonths >= 6 && passiveIncome === 0) return 4;
        if (passiveIncome > 0 && passiveIncome < avgExpense) return 5;
        if (passiveIncome >= avgExpense) return 6;
        return 7; // Fallback or logic for > 2x expense
    }, [metrics]);

    const currentLevel = LEVELS.find(l => l.id === currentLevelId) || LEVELS[6];

    // 3. Level-Specific Content
    const getNextLevelConditions = (level: number) => {
        switch(level) {
            case 1: return ["Cắt giảm chi tiêu để Thu > Chi", "Thanh lý đồ đạc không dùng"];
            case 2: return ["Xây dựng quỹ dự phòng tối thiểu 1 tháng", "Không vay mượn tiêu dùng"];
            case 3: return ["Nâng quỹ dự phòng lên 6 tháng", "Bắt đầu tìm hiểu đầu tư an toàn"];
            case 4: return ["Tạo dòng tiền thụ động đầu tiên (lãi gửi, cổ tức)", "Đa dạng hóa tài sản"];
            case 5: return ["Gia tăng thu nhập thụ động ≥ Chi phí sinh hoạt", "Tối ưu thuế"];
            default: return ["Duy trì và phát triển di sản"];
        }
    };

    const getActions = (level: number) => {
        switch(level) {
            case 1: return [
                "Ghi lại 100% chi tiêu, kể cả ly trà đá, trong 7 ngày tới.",
                "Cắt giảm ngay 500k từ các khoản chi không thiết yếu (cafe, ăn ngoài).",
                "Tìm kiếm và ứng tuyển 1 công việc làm thêm hoặc bán 3 món đồ cũ."
            ];
            case 2: return [
                "Tự động chuyển 15% thu nhập vào quỹ dự phòng trong 7 ngày tới.",
                "Hủy 1 gói đăng ký định kỳ không sử dụng thường xuyên (Netflix, Spotify, Gym...).",
                "Trả hết toàn bộ dư nợ thẻ tín dụng hoặc nợ lãi cao trong tuần này."
            ];
            case 3: return [
                "Mở sổ tiết kiệm online kỳ hạn ngắn (1-3 tháng) cho khoản dự phòng mới.",
                "Tính toán chính xác số tiền cần cho 6 tháng sinh hoạt phí an toàn.",
                "Đọc 30 phút mỗi ngày về quỹ mở hoặc ETF để chuẩn bị đầu tư."
            ];
            case 4: return [
                "Mở tài khoản chứng khoán và tìm hiểu cách đặt lệnh đầu tiên.",
                "Đầu tư thử nghiệm 1 triệu đồng vào chứng chỉ quỹ hoặc cổ phiếu blue-chip.",
                "Mua bảo hiểm sức khỏe hoặc nhân thọ để bảo vệ trụ cột gia đình."
            ];
            case 5: return [
                "Thiết lập lệnh đầu tư tự động hàng tháng (DCA) vào ngày nhận lương.",
                "Tái cơ cấu danh mục để đạt lợi suất trung bình > 10%/năm.",
                "Nghiên cứu thêm 1 kênh tài sản mới (Bất động sản dòng tiền, Kinh doanh online)."
            ];
            default: return ["Tối ưu hóa thuế cho các khoản đầu tư.", "Lập di chúc hoặc kế hoạch thừa kế tài sản.", "Tham gia vào các hoạt động từ thiện hoặc quỹ xã hội."];
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: The Pyramid */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md min-h-[600px]">
                <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white uppercase tracking-wider">Tháp Tài Chính</h3>
                <div className="flex flex-col-reverse w-full items-center gap-1">
                    {LEVELS.map((level) => {
                        const isActive = level.id === currentLevelId;
                        const isPassed = level.id < currentLevelId;
                        
                        // Dynamic width logic
                        const widthClass = `w-[${30 + (8 - level.id) * 10}%]`; 
                        // Tailwind arbitrary values don't interpolate well with dynamic strings in JIT unless hardcoded.
                        // Using style for width to create pyramid shape
                        const widthStyle = { width: `${100 - (level.id * 8)}%`, minWidth: '180px' };

                        return (
                            <div 
                                key={level.id}
                                style={widthStyle}
                                className={`
                                    relative p-3 text-center rounded-lg transition-all duration-500 flex flex-col items-center justify-center
                                    ${isActive 
                                        ? `${level.color} text-white shadow-xl scale-110 z-10 font-bold border-2 border-white ring-2 ring-offset-2 ring-teal-400` 
                                        : isPassed 
                                            ? `${level.bg} ${level.textColor} opacity-60 grayscale-[50%]` 
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                                    }
                                `}
                            >
                                <span className="text-sm md:text-base whitespace-nowrap">{level.id}. {level.name}</span>
                                {isActive && <span className="text-[10px] opacity-90 font-normal mt-0.5">{level.criteria}</span>}
                                
                                {isActive && (
                                    <div className="absolute -right-16 md:-right-24 top-1/2 transform -translate-y-1/2 flex items-center">
                                        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white text-xs py-1 px-2 rounded shadow border border-gray-200 dark:border-gray-700 whitespace-nowrap">
                                            Bạn ở đây 👈
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="mt-8 text-center text-sm text-gray-500 italic">
                    "Không quan trọng bạn đang ở đâu, quan trọng là bạn đang đi lên."
                </div>
            </div>

            {/* Right Column: Details & Actions */}
            <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Current Status Card */}
                <div className={`${currentLevel.bg} border border-opacity-20 border-current p-6 rounded-xl shadow-sm`}>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className={`p-3 rounded-full ${currentLevel.color} text-white`}>
                           <TrendingUpIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm uppercase font-semibold">Tầng hiện tại</p>
                            <h2 className={`text-3xl font-bold ${currentLevel.textColor}`}>{currentLevelId}. {currentLevel.name}</h2>
                            <p className={`text-sm ${currentLevel.textColor} opacity-80`}>{currentLevel.description}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 bg-opacity-60 rounded-lg p-4 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase">TB Thu nhập (3 tháng)</p>
                            <p className="font-semibold text-gray-800 dark:text-white">{metrics.avgIncome.toLocaleString('vi-VN')} ₫</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase">TB Chi tiêu (3 tháng)</p>
                            <p className="font-semibold text-gray-800 dark:text-white">{metrics.avgExpense.toLocaleString('vi-VN')} ₫</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Quỹ dự phòng</p>
                            <p className={`font-semibold ${metrics.emergencyFundMonths < 3 ? 'text-red-500' : 'text-green-500'}`}>
                                {metrics.emergencyFundMonths.toFixed(1)} tháng
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Thu nhập thụ động</p>
                            <p className="font-semibold text-gray-800 dark:text-white">{metrics.passiveIncome.toLocaleString('vi-VN')} ₫</p>
                        </div>
                    </div>
                </div>

                {/* 2. Why am I here? */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                        <ExclamationIcon className="h-5 w-5 text-orange-500 mr-2" />
                        Vì sao bạn đang ở tầng này?
                    </h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                        {metrics.avgIncome <= metrics.avgExpense && (
                            <li className="flex items-start"><span className="mr-2 text-red-500">•</span>Thu nhập trung bình thấp hơn hoặc bằng chi tiêu. Bạn đang chi tiêu vượt quá khả năng.</li>
                        )}
                        {metrics.avgIncome > metrics.avgExpense && metrics.emergencyFundMonths < 1 && (
                            <li className="flex items-start"><span className="mr-2 text-yellow-500">•</span>Đã có dư dả hàng tháng, nhưng chưa có Quỹ dự phòng đủ 1 tháng sinh hoạt. Rất rủi ro nếu ốm đau/mất việc.</li>
                        )}
                        {metrics.avgIncome > metrics.avgExpense && metrics.emergencyFundMonths >= 1 && metrics.emergencyFundMonths < 6 && (
                            <li className="flex items-start"><span className="mr-2 text-blue-500">•</span>Quỹ dự phòng đang ở mức {metrics.emergencyFundMonths.toFixed(1)} tháng. Cần tích lũy thêm để đạt chuẩn an toàn (6 tháng).</li>
                        )}
                        {metrics.emergencyFundMonths >= 6 && metrics.passiveIncome === 0 && (
                            <li className="flex items-start"><span className="mr-2 text-indigo-500">•</span>Tài chính đã an toàn, nhưng chưa có dòng tiền đầu tư sinh lời (Thu nhập thụ động = 0).</li>
                        )}
                        <li className="flex items-start italic opacity-75 mt-2">
                             *Dữ liệu được tính dựa trên trung bình 3 tháng gần nhất.
                        </li>
                    </ul>
                </div>

                {/* 3. Next Steps & Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Conditions */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                        <h3 className="text-base font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                            <ChartPieIcon className="h-5 w-5 text-primary-500 mr-2" />
                            Điều kiện lên tầng {currentLevelId + 1}
                        </h3>
                        <ul className="space-y-3">
                            {getNextLevelConditions(currentLevelId).map((cond, idx) => (
                                <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                                    <div className="min-w-[20px] h-5 border-2 border-gray-300 rounded mr-2 mt-0.5"></div>
                                    <span>{cond}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 7-Day Actions */}
                    <div className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl shadow-md border border-primary-100 dark:border-gray-600">
                        <h3 className="text-base font-bold text-primary-700 dark:text-primary-400 mb-3 flex items-center">
                            <ShieldCheckIcon className="h-5 w-5 mr-2" />
                            Hành động 7 ngày tới
                        </h3>
                        <ul className="space-y-3">
                            {getActions(currentLevelId).map((action, idx) => (
                                <li key={idx} className="flex items-start text-sm text-gray-700 dark:text-gray-200">
                                    <CheckCircleIcon className="h-5 w-5 text-primary-500 mr-2 mt-0.5 shrink-0" />
                                    <span>{action}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};
