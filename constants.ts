
import { Category, Transaction, Budget, Asset, Liability, GoldenRule, JourneyTask } from './types';

export const CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Lương', type: 'income', icon: 'Briefcase', color: '#10b981' },
  { id: 'cat-2', name: 'Tạp hóa', type: 'expense', icon: 'ShoppingCart', color: '#ef4444' },
  { id: 'cat-3', name: 'Tiền thuê nhà', type: 'expense', icon: 'Home', color: '#f97316' },
  { id: 'cat-4', name: 'Đi lại', type: 'expense', icon: 'Bus', color: '#3b82f6' },
  { id: 'cat-5', name: 'Giải trí', type: 'expense', icon: 'Ticket', color: '#8b5cf6' },
  { id: 'cat-6', name: 'Làm tự do', type: 'income', icon: 'Pencil', color: '#14b8a6' },
  { id: 'cat-7', name: 'Tiện ích', type: 'expense', icon: 'LightningBolt', color: '#f59e0b' },
  { id: 'cat-8', name: 'Sức khỏe', type: 'expense', icon: 'Heart', color: '#ec4899' },
  { id: 'cat-9', name: 'Kinh doanh', type: 'income', icon: 'ChartPie', color: '#6366f1' },
];

// Helper to generate date relative to today
const getRelativeDate = (monthsAgo: number, day: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() - monthsAgo);
    d.setDate(day);
    return d.toISOString().split('T')[0];
};

export const TRANSACTIONS: Transaction[] = [
  // Current Month (Month 0)
  { id: 'trans-1', categoryId: 'cat-1', amount: 25000000, description: 'Lương tháng này', type: 'income', date: getRelativeDate(0, 5), paymentMethod: 'bank_transfer', accountType: 'personal', classification: 'need' },
  { id: 'trans-2', categoryId: 'cat-3', amount: 5000000, description: 'Tiền nhà tháng này', type: 'expense', date: getRelativeDate(0, 1), paymentMethod: 'bank_transfer', accountType: 'personal', classification: 'need' },
  { id: 'trans-3', categoryId: 'cat-2', amount: 3000000, description: 'Ăn uống', type: 'expense', date: getRelativeDate(0, 10), paymentMethod: 'credit_card', accountType: 'personal', classification: 'need' },
  { id: 'trans-4', categoryId: 'cat-5', amount: 1500000, description: 'Mua sắm & Giải trí', type: 'expense', date: getRelativeDate(0, 15), paymentMethod: 'credit_card', accountType: 'personal', classification: 'want' },
  
  // Last Month (Month 1)
  { id: 'trans-5', categoryId: 'cat-1', amount: 25000000, description: 'Lương tháng trước', type: 'income', date: getRelativeDate(1, 5), paymentMethod: 'bank_transfer', accountType: 'personal', classification: 'need' },
  { id: 'trans-6', categoryId: 'cat-3', amount: 5000000, description: 'Tiền nhà tháng trước', type: 'expense', date: getRelativeDate(1, 1), paymentMethod: 'bank_transfer', accountType: 'personal', classification: 'need' },
  { id: 'trans-7', categoryId: 'cat-2', amount: 3500000, description: 'Ăn uống', type: 'expense', date: getRelativeDate(1, 12), paymentMethod: 'credit_card', accountType: 'personal', classification: 'need' },
  { id: 'trans-8', categoryId: 'cat-5', amount: 2000000, description: 'Du lịch ngắn', type: 'expense', date: getRelativeDate(1, 20), paymentMethod: 'credit_card', accountType: 'personal', classification: 'want' },

  // 2 Months Ago (Month 2)
  { id: 'trans-9', categoryId: 'cat-1', amount: 25000000, description: 'Lương 2 tháng trước', type: 'income', date: getRelativeDate(2, 5), paymentMethod: 'bank_transfer', accountType: 'personal', classification: 'need' },
  { id: 'trans-10', categoryId: 'cat-3', amount: 5000000, description: 'Tiền nhà 2 tháng trước', type: 'expense', date: getRelativeDate(2, 1), paymentMethod: 'bank_transfer', accountType: 'personal', classification: 'need' },
  { id: 'trans-11', categoryId: 'cat-2', amount: 3200000, description: 'Ăn uống', type: 'expense', date: getRelativeDate(2, 10), paymentMethod: 'credit_card', accountType: 'personal', classification: 'need' },
  { id: 'trans-12', categoryId: 'cat-7', amount: 1200000, description: 'Điện nước', type: 'expense', date: getRelativeDate(2, 28), paymentMethod: 'bank_transfer', accountType: 'personal', classification: 'need' },
];

export const BUDGETS: Budget[] = [
  { id: 'bud-1', categoryId: 'cat-2', amount: 2500000, spent: 1350000, startDate: '2023-10-01', endDate: '2023-10-31' },
  { id: 'bud-2', categoryId: 'cat-5', amount: 1000000, spent: 525000, startDate: '2023-10-01', endDate: '2023-10-31' },
  { id: 'bud-3', categoryId: 'cat-4', amount: 500000, spent: 250000, startDate: '2023-10-01', endDate: '2023-10-31' },
];

export const ASSETS: Asset[] = [
  { id: 'asset-1', name: 'Tiền mặt & Ngân hàng', value: 15000000, type: 'cash' },
  { id: 'asset-2', name: 'Sổ tiết kiệm', value: 50000000, type: 'investment' },
  { id: 'asset-3', name: 'Xe máy', value: 45000000, type: 'vehicle' },
];

export const LIABILITIES: Liability[] = [
  { id: 'lia-1', name: 'Thẻ tín dụng', amount: 5000000, type: 'credit_card' },
  { id: 'lia-2', name: 'Vay mua laptop', amount: 10000000, type: 'loan' },
];

export const GOLDEN_RULES_SEED: GoldenRule[] = [
  { id: 'rule-1', title: 'Kiếm nhiều hơn tiêu', description: 'Tổng thu nhập phải lớn hơn tổng chi phí hàng tháng.', isCompliant: true, scoreWeight: 15 },
  { id: 'rule-2', title: 'Quỹ dự phòng khẩn cấp', description: 'Có ít nhất 3-6 tháng chi phí sinh hoạt trong quỹ dự phòng.', isCompliant: false, scoreWeight: 15 },
  { id: 'rule-3', title: 'Tách biệt tài chính', description: 'Không trộn lẫn tiền cá nhân và tiền kinh doanh.', isCompliant: true, scoreWeight: 10 },
  { id: 'rule-4', title: 'Không nợ xấu', description: 'Không có khoản nợ lãi suất cao (trên 10%/năm) cho tiêu dùng.', isCompliant: true, scoreWeight: 10 },
  { id: 'rule-5', title: 'Bảo vệ rủi ro', description: 'Có bảo hiểm y tế và bảo hiểm nhân thọ (nếu là trụ cột).', isCompliant: false, scoreWeight: 5 },
  { id: 'rule-6', title: 'Tiết kiệm trước, chi tiêu sau', description: 'Dành ít nhất 10-20% thu nhập để tiết kiệm/đầu tư ngay khi nhận lương.', isCompliant: true, scoreWeight: 10 },
  { id: 'rule-7', title: 'Đa dạng nguồn thu', description: 'Không phụ thuộc vào một nguồn thu nhập duy nhất.', isCompliant: false, scoreWeight: 10 },
  { id: 'rule-8', title: 'Hiểu rõ dòng tiền', description: 'Ghi chép và phân loại chi tiêu rõ ràng (Need vs Want).', isCompliant: true, scoreWeight: 10 },
  { id: 'rule-9', title: 'Liên tục học hỏi', description: 'Đầu tư cho bản thân ít nhất 5% thu nhập mỗi tháng.', isCompliant: false, scoreWeight: 5 },
  { id: 'rule-10', title: 'Mục tiêu tài chính rõ ràng', description: 'Có mục tiêu tài chính cụ thể cho 1 năm, 3 năm, 5 năm.', isCompliant: true, scoreWeight: 5 },
  { id: 'rule-11', title: 'Sống dưới mức khả năng', description: 'Không nâng cao mức sống ngay khi thu nhập tăng (Lifestyle Inflation).', isCompliant: true, scoreWeight: 5 },
];

export const JOURNEY_30_DAYS: JourneyTask[] = [
    // TUẦN 1
    { day: 1, week: 1, title: 'Nhật ký toàn phần', description: 'Hôm nay, bạn hãy ghi lại 100% các khoản chi tiêu, dù nhỏ nhất (gửi xe, trà đá).', action: 'Ghi lại mọi giao dịch trong ngày', coachMessage: 'Đừng phán xét, chỉ cần quan sát xem tiền của bạn đang đi đâu.' },
    { day: 2, week: 1, title: 'Need vs Want', description: 'Xem lại các khoản chi hôm qua. Khoản nào là "CẦN" (sống còn), khoản nào là "MUỐN" (cảm xúc)?', action: 'Phân loại các khoản chi hôm qua', coachMessage: 'Nhận diện là bước đầu của sự thay đổi.' },
    { day: 3, week: 1, title: 'Khoản chi bất ngờ', description: 'Tìm ra một khoản chi khiến bạn giật mình trong tháng qua.', action: 'Xác định 1 khoản chi lãng phí nhất', coachMessage: 'Đôi khi chúng ta chi tiêu trong vô thức. Hãy tỉnh thức.' },
    { day: 4, week: 1, title: 'Tổng hợp 3 ngày', description: 'Cộng dồn chi tiêu 3 ngày qua. Con số này nhân lên 10 sẽ là chi tiêu cả tháng.', action: 'Tính tổng chi tiêu 3 ngày', coachMessage: 'Con số không biết nói dối.' },
    { day: 5, week: 1, title: 'Thói quen xấu', description: 'Bạn có hay mua sắm khi buồn? Hay khao đãi bạn bè quá trớn?', action: 'Gọi tên 1 thói quen xấu về tiền', coachMessage: 'Biết mình biết ta, trăm trận trăm thắng.' },
    { day: 6, week: 1, title: '24h Tĩnh Lặng', description: 'Cam kết không mua bất cứ thứ gì ngoài nhu cầu cơ bản (ăn uống, đi lại) trong 24h.', action: 'Không tiêu tiền cho "WANT" hôm nay', coachMessage: 'Cảm nhận sự bình yên khi không phải rút ví.' },
    { day: 7, week: 1, title: 'Tuyên ngôn tài chính', description: 'Viết ra 3 câu trả lời: "Tôi muốn tiền phục vụ tôi như thế nào?"', action: 'Viết xuống mục đích của tiền bạc', coachMessage: 'Tiền là công cụ, bạn là người chủ.' },

    // TUẦN 2
    { day: 8, week: 2, title: 'Giới hạn danh mục', description: 'Chọn 1 danh mục (ví dụ: Ăn ngoài) và đặt giới hạn tiền tối đa cho tuần này.', action: 'Đặt hạn mức cho 1 danh mục', coachMessage: 'Kỷ luật nhỏ tạo nên tự do lớn.' },
    { day: 9, week: 2, title: 'Cắt giảm 1 khoản', description: 'Chọn 1 khoản "MUỐN" bạn định mua và hủy bỏ nó.', action: 'Hủy bỏ 1 ý định mua sắm', coachMessage: 'Bạn vừa "kiếm" được tiền từ việc không tiêu nó.' },
    { day: 10, week: 2, title: 'Ngân sách tuần', description: 'Lập ngân sách đơn giản cho 7 ngày tới (Ăn uống, Di chuyển, Khác).', action: 'Viết ra ngân sách tuần này', coachMessage: 'Bản đồ giúp bạn không bị lạc đường.' },
    { day: 11, week: 2, title: 'Trả cho mình trước', description: 'Chuyển ngay 5-10% thu nhập (hoặc bất kỳ số tiền nào) vào quỹ tiết kiệm.', action: 'Thực hiện 1 giao dịch tiết kiệm', coachMessage: 'Hãy coi tiết kiệm là hóa đơn quan trọng nhất phải trả.' },
    { day: 12, week: 2, title: 'Kiểm tra giữa kỳ', description: 'So sánh tổng Thu và tổng Chi trong 7 ngày gần nhất.', action: 'Xem báo cáo Thu - Chi 7 ngày', coachMessage: 'Dương hay Âm? Hãy nhìn thẳng vào sự thật.' },
    { day: 13, week: 2, title: 'Điều chỉnh', description: 'Nếu ngày 12 bị âm, hãy tìm ngay cách cắt giảm cho ngày mai.', action: 'Điều chỉnh kế hoạch chi tiêu', coachMessage: 'Linh hoạt là chìa khóa của quản lý tài chính.' },
    { day: 14, week: 2, title: 'No Spend Day', description: 'Một ngày hoàn toàn không chi tiêu gì cả (chuẩn bị đồ ăn từ nhà).', action: 'Hoàn thành thử thách 0 đồng', coachMessage: 'Bạn mạnh mẽ hơn những cám dỗ mua sắm.' },

    // TUẦN 3
    { day: 15, week: 3, title: 'Khởi tạo Quỹ dự phòng', description: 'Mở một tài khoản hoặc heo đất riêng cho Quỹ dự phòng. Bỏ vào đó 100k cũng được.', action: 'Tạo nơi chứa Quỹ dự phòng', coachMessage: 'Hành trình ngàn dặm bắt đầu từ bước chân đầu tiên.' },
    { day: 16, week: 3, title: 'Mục tiêu an toàn', description: 'Tính xem 3 tháng sinh hoạt phí của bạn là bao nhiêu?', action: 'Tính con số mục tiêu Quỹ dự phòng', coachMessage: 'Đây là con số của sự bình an.' },
    { day: 17, week: 3, title: 'Tự động hóa', description: 'Cài đặt lịch chuyển tiền tự động vào tiết kiệm (nếu app ngân hàng hỗ trợ).', action: 'Cài đặt tiết kiệm tự động', coachMessage: 'Đừng dựa vào ý chí, hãy dựa vào hệ thống.' },
    { day: 18, week: 3, title: 'Đối mặt với nợ', description: 'Ghi lại tất cả các khoản nợ (nếu có). Ghi rõ lãi suất và hạn trả.', action: 'Liệt kê danh sách nợ', coachMessage: 'Ánh sáng sẽ xua tan nỗi sợ hãi bóng tối.' },
    { day: 19, week: 3, title: 'Kế hoạch diệt nợ', description: 'Chọn khoản nợ nhỏ nhất hoặc lãi cao nhất để ưu tiên trả trước.', action: 'Lên kế hoạch trả 1 khoản nợ', coachMessage: 'Mỗi đồng nợ trả được là một bước gần hơn đến tự do.' },
    { day: 20, week: 3, title: 'Tổng kết 20 ngày', description: 'Nhìn lại tài sản ròng của bạn hiện tại.', action: 'Xem module Tài Sản Ròng', coachMessage: 'Bạn đang giàu lên hay nghèo đi? Hãy điều chỉnh.' },
    { day: 21, week: 3, title: 'Ghi nhận bản thân', description: 'Viết ra 3 điều bạn đã làm tốt hơn về tài chính so với 3 tuần trước.', action: 'Viết 3 điểm tích cực', coachMessage: 'Hãy tự hào vì bạn đã nỗ lực.' },

    // TUẦN 4
    { day: 22, week: 4, title: 'Duy trì Thu > Chi', description: 'Kiểm tra lại xem tuần này bạn có tiêu ít hơn số tiền kiếm được không?', action: 'Đảm bảo Cashflow dương', coachMessage: 'Đây là nguyên tắc vàng số 1.' },
    { day: 23, week: 4, title: 'Thói quen tiết kiệm', description: 'Bạn đã tiết kiệm được bao nhiêu ngày liên tục rồi?', action: 'Bỏ thêm tiền vào lợn/tài khoản', coachMessage: 'Sự đều đặn quan trọng hơn số tiền lớn.' },
    { day: 24, week: 4, title: 'Rà soát "WANT"', description: 'Xem lại danh sách mong muốn. Có món nào bạn không còn thích nữa không?', action: 'Xóa bỏ những mong muốn lỗi thời', coachMessage: 'Sở thích thay đổi, đừng để tiền kẹt vào quá khứ.' },
    { day: 25, week: 4, title: 'Mục tiêu 90 ngày', description: 'Bạn muốn đạt được gì trong 3 tháng tới? (Trả hết nợ X, hay có Y tiền tiết kiệm).', action: 'Viết mục tiêu 3 tháng tới', coachMessage: 'Mục tiêu rõ ràng tạo ra con đường rõ ràng.' },
    { day: 26, week: 4, title: 'Hình dung', description: 'Tưởng tượng bạn đang ở tầng tiếp theo của Tháp Tài Chính. Cảm giác đó thế nào?', action: 'Dành 5 phút hình dung sự thành công', coachMessage: 'Tư duy định hình thực tại.' },
    { day: 27, week: 4, title: 'Cam kết', description: 'Viết một bản cam kết với chính mình về việc giữ kỷ luật tài chính.', action: 'Viết cam kết tài chính', coachMessage: 'Lời hứa với bản thân là lời hứa thiêng liêng nhất.' },
    { day: 28, week: 4, title: 'Review Quỹ dự phòng', description: 'Quỹ dự phòng của bạn đã tăng lên bao nhiêu so với ngày 15?', action: 'Cập nhật số dư Quỹ dự phòng', coachMessage: 'Sự an tâm đang lớn dần lên.' },
    { day: 29, week: 4, title: 'So sánh', description: 'So sánh tư duy tài chính của bạn ngày hôm nay với Ngày 1.', action: 'Viết cảm nhận thay đổi', coachMessage: 'Bạn đã khác xưa rất nhiều.' },
    { day: 30, week: 4, title: 'Tốt nghiệp', description: 'Đánh giá xem bạn đã đủ điều kiện lên tầng tiếp theo của Tháp Tài Chính chưa?', action: 'Kiểm tra Tháp Tài Chính', coachMessage: 'Chúc mừng! Hãy sẵn sàng cho hành trình tiếp theo.' },
];
