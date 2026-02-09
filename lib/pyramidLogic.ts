
import type { Transaction, Asset, Liability, GoldenRule } from '../types';

export interface PyramidLevelConfig {
    id: number;
    name: string;
    description: string;
    criteria: string;
    color: string;
    bg: string;
    textColor: string;
    icon: string;
}

export const PYRAMID_LEVELS: PyramidLevelConfig[] = [
    { id: 7, name: 'Thịnh Vượng', description: 'Di sản & Cống hiến. Vượt qua nỗi sợ và kiểm soát lòng tham.', color: 'from-teal-400 to-emerald-600', bg: 'bg-teal-50', textColor: 'text-teal-700', criteria: 'Tài sản ròng lớn + 11/11 Kỷ luật vàng', icon: 'Sparkles' },
    { id: 6, name: 'Tự Do Tài Chính', description: 'Tiền đẻ ra tiền. Ngủ tiền vẫn về. Thụ động > Chi tiêu.', color: 'from-emerald-400 to-green-600', bg: 'bg-emerald-50', textColor: 'text-emerald-700', criteria: 'Thụ động ≥ 100% Chi tiêu', icon: 'Flag' },
    { id: 5, name: 'Độc Lập Tài Chính', description: 'Sở hữu hệ thống hoặc tài sản sinh dòng tiền ổn định.', color: 'from-blue-400 to-indigo-600', bg: 'bg-blue-50', textColor: 'text-blue-700', criteria: 'Thu nhập thụ động ≥ 50% Chi tiêu', icon: 'TrendingUp' },
    { id: 4, name: 'An Toàn', description: 'Dự phòng vững chãi. Đòn bẩy thông minh dưới 50%.', color: 'from-indigo-400 to-purple-600', bg: 'bg-indigo-50', textColor: 'text-indigo-700', criteria: 'Dự phòng ≥ 1 năm chi tiêu', icon: 'ShieldCheck' },
    { id: 3, name: 'Tích Lũy', description: 'Bắt đầu có thặng dư. Đầu tư vào NÀO (Trí tuệ).', color: 'from-cyan-400 to-blue-600', bg: 'bg-cyan-50', textColor: 'text-cyan-700', criteria: 'Dự phòng ≥ 3-6 tháng chi tiêu', icon: 'Collection' },
    { id: 2, name: 'Ổn Định', description: 'Làm việc trên chuẩn. Thu nhập > Chi tiêu thực tế.', color: 'from-yellow-400 to-orange-500', bg: 'bg-yellow-50', textColor: 'text-yellow-700', criteria: 'Cashflow Dương hàng tháng', icon: 'Scale' },
    { id: 1, name: 'Sống Sót', description: 'Làm đồng nào xào đồng nấy. Nô lệ cho đồng tiền.', color: 'from-red-400 to-pink-600', bg: 'bg-red-50', textColor: 'text-red-700', criteria: 'Thu nhập ≤ Chi tiêu / Nợ xấu cao', icon: 'Exclamation' },
];

export interface PyramidStatus {
    currentLevel: PyramidLevelConfig;
    metrics: {
        avgIncome: number;
        avgExpense: number;
        emergencyFundMonths: number;
        passiveIncome: number;
        netWorth: number;
        complianceScore: number;
    };
    reasons: string[];
    nextLevelConditions: string[];
    actions7d: string[];
}

let lastStatusCache: {
    signature: string;
    result: PyramidStatus;
} | null = null;

export function calculatePyramidStatus(
    transactions: Transaction[], 
    assets: Asset[], 
    liabilities: Liability[],
    goldenRules: GoldenRule[]
): PyramidStatus {
    const tSum = transactions.reduce((s, t) => s + (t.amount || 0), 0);
    const aSum = assets.reduce((s, a) => s + (a.value || 0), 0);
    const lSum = liabilities.reduce((s, l) => s + (l.amount || 0), 0);
    const rSig = goldenRules.filter(r => r.isCompliant).map(r => r.id).sort().join(',');
    
    const signature = `t:${transactions.length}-${tSum}|a:${assets.length}-${aSum}|l:${liabilities.length}-${lSum}|r:${rSig}`;
    
    if (lastStatusCache && lastStatusCache.signature === signature) {
        return lastStatusCache.result;
    }

    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    const threeMonthsAgoTime = threeMonthsAgo.getTime();

    let totalIncome = 0;
    let totalExpense = 0;
    let totalPassiveIncome = 0;
    const activeMonths = new Set<string>();

    for (let i = 0; i < transactions.length; i++) {
        const t = transactions[i];
        const tTime = new Date(t.date).getTime();
        if (tTime >= threeMonthsAgoTime) {
            activeMonths.add(t.date.substring(0, 7));
            if (t.type === 'income') {
                totalIncome += t.amount;
                if (t.categoryId === 'cat-9' || t.isAsset) {
                    totalPassiveIncome += t.amount;
                }
            } else {
                totalExpense += t.amount;
            }
        }
    }
    
    const monthCount = activeMonths.size || 1;
    const avgIncome = totalIncome / monthCount;
    const avgExpense = totalExpense / monthCount;
    const passiveIncome = totalPassiveIncome / monthCount;

    const totalAssetsVal = assets.reduce((s, a) => s + a.value, 0);
    const totalLiabilitiesVal = liabilities.reduce((s, l) => s + l.amount, 0);
    const liquidAssets = assets
        .filter(a => a.type === 'cash' || a.type === 'investment')
        .reduce((sum, a) => sum + a.value, 0);
    
    const emergencyFundMonths = avgExpense > 0 ? liquidAssets / avgExpense : 0;
    const complianceCount = goldenRules.filter(r => r.isCompliant).length;
    const complianceScore = Math.round((complianceCount / goldenRules.length) * 100);

    let levelId = 1;
    if (avgIncome > avgExpense) {
        levelId = 2;
        if (emergencyFundMonths >= 3) {
            levelId = 3;
            if (emergencyFundMonths >= 12 && complianceScore >= 70) {
                levelId = 4;
                if (passiveIncome > 0 && passiveIncome >= (avgExpense * 0.5)) {
                    levelId = 5;
                    if (passiveIncome >= avgExpense) {
                        levelId = 6;
                        if (totalAssetsVal - totalLiabilitiesVal > 5000000000 && complianceScore >= 90) {
                            levelId = 7;
                        }
                    }
                }
            }
        }
    }

    const currentLevel = PYRAMID_LEVELS.find(l => l.id === levelId) || PYRAMID_LEVELS[0];

    const reasons: string[] = [];
    if (avgIncome <= avgExpense) reasons.push("Bẫy Sống Sót: Thu nhập hiện chưa đuổi kịp chi phí sinh hoạt trung bình.");
    if (emergencyFundMonths < 6) reasons.push("Nền móng yếu: Quỹ dự phòng lỏng (chưa đạt 6 tháng). Dễ gục ngã trước biến cố.");
    if (complianceScore < 75) reasons.push("Thiếu Kỷ Luật: Điểm tuân thủ 11 Nguyên tắc vàng thấp. Cần nghiêm khắc hơn với bản thân.");
    if (passiveIncome === 0 && levelId >= 2) reasons.push("Nô lệ lao động: Tiền chưa làm việc thay cho sức người. Ngừng làm là ngừng thu nhập.");

    const result: PyramidStatus = {
        currentLevel,
        metrics: {
            avgIncome,
            avgExpense,
            emergencyFundMonths,
            passiveIncome,
            netWorth: totalAssetsVal - totalLiabilitiesVal,
            complianceScore
        },
        reasons: reasons.length > 0 ? reasons : ["Tài chính của bạn đang chuyển dịch đúng lộ trình thăng hạng của Lead Up."],
        nextLevelConditions: getNextLevelConditions(levelId),
        actions7d: getActions(levelId)
    };

    lastStatusCache = { signature, result };
    return result;
}

function getNextLevelConditions(level: number): string[] {
    switch(level) {
        case 1: return ["Cắt bỏ hoàn toàn 3 khoản chi 'Muốn' lãng phí nhất", "Duy trì ghi chép chi tiêu 100% không sót một đồng"];
        case 2: return ["Tích lũy Quỹ dự phòng đạt mốc 6 tháng chi tiêu", "Trích lương cho bản thân tối thiểu 10% mỗi tháng"];
        case 3: return ["Nâng quỹ dự phòng lên đúng 12 tháng (1 năm)", "Đầu tư tối thiểu 1 khóa học nâng cấp kỹ năng ROI cao"];
        case 4: return ["Tạo ra ít nhất 1 nguồn thu nhập thụ động (ETF/Sản phẩm số)", "Duy trì lối sống dưới chuẩn 90% thời gian"];
        case 5: return ["Đưa thu nhập thụ động phủ kín 100% chi phí sống", "Xây dựng hệ thống vận hành doanh nghiệp tự động"];
        case 6: return ["Lập quỹ tín thác và kế hoạch thừa kế di sản", "Đạt điểm tuân thủ kỷ luật vàng tuyệt đối 100%"];
        default: return ["Duy trì tâm sáng, trí sáng và cống hiến cho cộng đồng"];
    }
}

function getActions(level: number): string[] {
    switch(level) {
        case 1: return [
            "Cắt bỏ ngay 3 khoản chi 'rò rỉ' (ăn vặt, trà sữa, app rác) để giữ lại ít nhất 500k trong 7 ngày tới.",
            "Hủy toàn bộ các subscription (Netflix, Spotify, App rác) không dùng quá 2 lần/tháng ngay lập tức.",
            "Thực hiện 24h 'No-Spend Challenge' - Không chi một đồng nào vào ngày thứ Tư tới."
        ];
        case 2: return [
            "Tự động chuyển 10% thu nhập vào quỹ dự phòng trong 7 ngày tới ngay khi tiền về.",
            "Liệt kê và bán 3 món tiêu sản (đồ cũ, máy móc không dùng) để thu hồi ít nhất 1 triệu đồng thặng dư.",
            "Ghi chép 100% chi tiêu hàng ngày vào ứng dụng, không bỏ sót dù chỉ 2.000đ gửi xe."
        ];
        case 3: return [
            "Nâng quỹ tích lũy dự phòng lên mức 20% thu nhập thặng dư trong đợt lương tuần này.",
            "Dành 2 giờ tối thứ Bảy nghiên cứu danh mục ETF (VN30/VN100) để bắt đầu chiến dịch tích sản.",
            "Đầu tư ít nhất 500k vào một cuốn sách hoặc khóa học kỹ năng 'tạo tiền nhanh' ngay hôm nay."
        ];
        case 4: return [
            "Rà soát toàn bộ các khoản nợ và ưu tiên trả dứt điểm khoản nợ có lãi suất cao nhất trong 7 ngày tới.",
            "Thiết lập hoặc nâng cấp gói bảo vệ tài sản (Bảo hiểm) nếu quỹ dự phòng đã đạt mốc 12 tháng.",
            "Dành 1 buổi chiều cuối tuần đi khảo sát thực tế 2 bất động sản dòng tiền tiềm năng."
        ];
        case 5: return [
            "Xây dựng quy trình tự động hóa cho 1 mảng công việc kinh doanh để giải phóng 5 giờ/tuần cho bản thân.",
            "Chuyển 30% thặng dư tháng này vào các tài sản sinh dòng tiền (Cổ phiếu cổ tức/BĐS cho thuê).",
            "Phác thảo Outline cho 1 sản phẩm số (Ebook/Khóa học) dựa trên thế mạnh chuyên môn của bạn."
        ];
        case 6: return [
            "Tái đầu tư 100% lợi nhuận thu về từ các kênh đầu tư hiện có để tận dụng tối đa lãi kép tuần này.",
            "Đặt lịch hẹn với cố vấn luật pháp để soạn thảo bản nháp kế hoạch tín thác di sản gia tộc.",
            "Tối ưu hóa cấu trúc thuế cho các dòng tiền kinh doanh hiện tại để tăng ít nhất 5% lợi nhuận ròng."
        ];
        default: return [
            "Trích 5% lợi nhuận ròng tuần này vào quỹ phụng sự cộng đồng hoặc thiện nguyện chiến lược.",
            "Dành 2 giờ Mentor trực tiếp cho một cá nhân tiềm năng trong cộng đồng để truyền thụ tư duy thịnh vượng.",
            "Hoàn thiện bản nháp cuối cùng của kế hoạch Di sản 100 năm cho thế hệ kế cận."
        ];
    }
}
