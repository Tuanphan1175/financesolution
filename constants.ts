import type {
  Category,
  Transaction,
  Budget,
  Asset,
  Liability,
  GoldenRule,
  JourneyTask,
  TaskPillar,
  JourneyDay,
} from './types';

export const CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Lương', type: 'income', icon: 'Briefcase', color: '#10b981', defaultClassification: 'need' },
  { id: 'cat-2', name: 'Tạp hóa', type: 'expense', icon: 'ShoppingCart', color: '#ef4444', defaultClassification: 'need' },
  { id: 'cat-3', name: 'Tiền thuê nhà', type: 'expense', icon: 'Home', color: '#f97316', defaultClassification: 'need' },
  { id: 'cat-4', name: 'Đi lại', type: 'expense', icon: 'Bus', color: '#3b82f6', defaultClassification: 'need' },
  { id: 'cat-5', name: 'Giải trí', type: 'expense', icon: 'Ticket', color: '#8b5cf6', defaultClassification: 'want' },
  { id: 'cat-6', name: 'Làm tự do', type: 'income', icon: 'Pencil', color: '#14b8a6', defaultClassification: 'need' },
  { id: 'cat-7', name: 'Tiện ích', type: 'expense', icon: 'LightningBolt', color: '#f59e0b', defaultClassification: 'need' },
  { id: 'cat-8', name: 'Sức khỏe', type: 'expense', icon: 'Heart', color: '#ec4899', defaultClassification: 'need' },
  { id: 'cat-9', name: 'Kinh doanh', type: 'income', icon: 'ChartPie', color: '#6366f1', defaultClassification: 'need' },
];

export const TRANSACTIONS: Transaction[] = [];

export const BUDGETS: Budget[] = [];

export const ASSETS: Asset[] = [];

export const LIABILITIES: Liability[] = [];

export const GOLDEN_RULES_SEED: GoldenRule[] = [
  { id: 'rule-1', title: 'Chỉ mua thứ mình CẦN, không mua thứ mình MUỐN', description: 'Luôn niệm thần chú này trước khi rút ví. Phân biệt rõ nhu cầu sống còn và ham muốn nhất thời.', isCompliant: false, scoreWeight: 15 },
  { id: 'rule-2', title: 'Tập trung vào Tài sản, hạn chế Tiêu sản', description: 'Tài sản đẻ ra tiền hoặc tăng giá theo thời gian. Tiêu sản chỉ làm hao hụt dòng tiền.', isCompliant: false, scoreWeight: 10 },
  { id: 'rule-3', title: 'Trả lương cho bản thân trước', description: 'Trích ngay một khoản cố định cho mình ngay khi có thu nhập về tài khoản.', isCompliant: false, scoreWeight: 10 },
  { id: 'rule-4', title: 'Tiết kiệm trước, chi tiêu sau', description: 'Cất tiền tiết kiệm/dự phòng ngay lập tức, phần còn lại mới được phép chi dùng.', isCompliant: false, scoreWeight: 15 },
  { id: 'rule-5', title: 'Làm việc TRÊN chuẩn - Sống DƯỚI chuẩn', description: 'Cống hiến 100-200% sức lao động nhưng chỉ tiêu dùng ở mức 40-55% khả năng.', isCompliant: false, scoreWeight: 10 },
  { id: 'rule-6', title: 'Sống chết cũng phải có Quỹ Dự Phòng', description: 'Dự phòng tối thiểu 6 tháng đến 1 năm chi tiêu để đối phó biến cố bất ngờ.', isCompliant: false, scoreWeight: 10 },
  { id: 'rule-7', title: 'Dùng đòn bẩy thông minh (Nợ tốt)', description: 'Chỉ vay khi tạo ra dòng tiền dương hoặc tăng giá vốn chắc chắn. Vay không quá 50-70%.', isCompliant: false, scoreWeight: 5 },
  { id: 'rule-8', title: 'Tái đầu tư lợi nhuận', description: 'Không tiêu vào tiền lãi. Dùng lợi nhuận để tiếp tục quay vòng tạo ra lãi kép.', isCompliant: false, scoreWeight: 5 },
  { id: 'rule-9', title: 'Không bao giờ "All-in" (Tất tay)', description: 'Chia trứng vào nhiều giỏ. Luôn để lại một lối đi lùi cho bản thân.', isCompliant: false, scoreWeight: 10 },
  { id: 'rule-10', title: 'Ưu tiên Pháp lý hàng đầu', description: 'Không đầu tư vào thứ mập mờ pháp lý. Sai một ly đi một dặm tiền mặt.', isCompliant: false, scoreWeight: 5 },
  { id: 'rule-11', title: 'Đầu tư vào NÀO trước (ROI cao nhất)', description: 'Học tập phát triển bản thân là khoản đầu tư sinh lời bền vững và vô hạn nhất.', isCompliant: false, scoreWeight: 5 },
];

export const JOURNEY_30_DAYS: JourneyTask[] = [
    { day: 1, week: 1, title: 'Nhật ký Tỉnh thức', description: 'Ghi chép 100% chi tiêu dù chỉ là 5k gửi xe. Đừng phán xét, chỉ quan sát dòng tiền.', action: 'Ghi mọi giao dịch phát sinh hôm nay', coachMessage: 'Việc nhỏ phản ánh con người lớn. Hãy kỷ luật ngay từ bước đầu.', pillar: 'expense' },
    { day: 2, week: 1, title: 'Thanh lọc Tiêu sản', description: 'Liệt kê 3 món đồ bạn đã mua nhưng không dùng quá 2 lần trong tháng qua.', action: 'Xác định 3 tiêu sản đang có', coachMessage: 'Mỗi đồng tiền ngu là một bài học đắt giá.', pillar: 'expense' },
    { day: 3, week: 1, title: 'Thần chú CẦN vs MUỐN', description: 'Trước khi mua bất cứ thứ gì hôm nay, hãy dừng lại 30s và hỏi: Đây là thứ mình CẦN hay MUỐN?', action: 'Từ chối 1 khoản chi theo cảm xúc', coachMessage: 'Kiểm soát lòng tham bắt đầu từ việc kiểm soát ví tiền.', pillar: 'mindset' },
    { day: 4, week: 1, title: 'Đối mặt sự thật', description: 'Tính tổng nợ và tổng tài sản hiện có. Ghi rõ con số thực tế, không né tránh.', action: 'Cập nhật module Tài sản ròng', coachMessage: 'Ánh sáng tri thức sẽ xua tan bóng tối của sự mơ hồ.', pillar: 'mindset' },
    { day: 5, week: 1, title: 'Lập Quỹ dự phòng', description: 'Mở một tài khoản riêng (hoặc heo đất). Bỏ vào đó số tiền đầu tiên dù chỉ là 100k.', action: 'Khởi tạo nơi chứa Quỹ dự phòng', coachMessage: 'Quỹ dự phòng là chiếc phao cứu sinh khi trời giông bão.', pillar: 'protection' },
    { day: 6, week: 1, title: '24h No-Spend', description: 'Thử thách 1 ngày không tiêu tiền cho bất cứ việc gì ngoài ăn uống cơ bản tại nhà.', action: 'Hoàn thành 24h không chi tiêu "Want"', coachMessage: 'Cảm nhận sự tự chủ khi không bị lệ thuộc vào mua sắm.', pillar: 'expense' },
    { day: 7, week: 1, title: 'Tuyên ngôn Tài chính', description: 'Viết xuống cam kết: Tôi làm chủ đồng tiền, không để tiền làm chủ tôi.', action: 'Viết và đọc to bản cam kết kỷ luật', coachMessage: 'Tư duy định hình thực tại. Bạn xứng đáng giàu có.', pillar: 'mindset' },
    { day: 8, week: 2, title: 'Làm việc TRÊN chuẩn', description: 'Hôm nay hãy nỗ lực làm việc hiệu suất gấp đôi bình thường (đăng nhiều bài hơn, gọi nhiều khách hơn).', action: 'Hoàn thành công việc vượt mục tiêu 20%', coachMessage: 'Thu nhập tỉ lệ thuận với giá trị bạn trao đi.', pillar: 'income' },
    { day: 9, week: 2, title: 'Sống DƯỚI chuẩn', description: 'Review lại thực đơn tuần. Tìm cách nấu ăn tại nhà thay vì ăn ngoài để tối ưu chi phí.', action: 'Cắt giảm chi phí ăn uống 20%', coachMessage: 'Ăn chắc mặc bền để kiến tạo tương lai thịnh vượng.', pillar: 'expense' },
    { day: 10, week: 2, title: 'Học cách Nhân tiền', description: 'Dành 30 phút tìm hiểu về ETF (VN30/VN100) hoặc lãi suất kép.', action: 'Đọc tài liệu về đầu tư thụ động', coachMessage: 'Đừng để tiền ngủ yên, hãy bắt nó làm việc cho bạn.', pillar: 'investment' },
    { day: 11, week: 2, title: 'Kiểm tra Pháp lý', description: 'Rà soát lại giấy tờ của 1 khoản đầu tư hoặc góp vốn hiện có.', action: 'Đảm bảo tính pháp lý của tài sản', coachMessage: 'An toàn vốn quan trọng hơn lợi nhuận ảo.', pillar: 'protection' },
    { day: 12, week: 2, title: 'Tách bạch dòng tiền', description: 'Đảm bảo tiền cá nhân và tiền kinh doanh nằm ở 2 tài khoản khác nhau.', action: 'Chuyển đổi sang hệ thống 2 tài khoản', coachMessage: 'Minh bạch tài chính là gốc rễ của sự bền vững.', pillar: 'mindset' },
    { day: 13, week: 2, title: 'Loại bỏ rò rỉ', description: 'Hủy 1 dịch vụ đăng ký tháng mà bạn hiếm khi sử dụng (Netflix, App, Gym...).', action: 'Hủy 1 gói cước không cần thiết', coachMessage: 'Lỗ nhỏ làm đắm thuyền to.', pillar: 'expense' },
    { day: 14, week: 2, title: 'Tổng kết chặng 1', description: 'So sánh chi tiêu tuần 2 so với tuần 1. Bạn đã tiết kiệm được bao nhiêu?', action: 'Tính con số thặng dư 2 tuần qua', coachMessage: 'Mọi nỗ lực đều được đền đáp bằng những con số.', pillar: 'mindset' },
    { day: 15, week: 3, title: 'Đầu tư cho Não', description: 'Mua 1 cuốn sách tài chính hoặc đăng ký 1 khóa học kỹ năng ROI cao.', action: 'Trích quỹ giáo dục để nâng cấp bản thân', coachMessage: 'Trí tuệ là tài sản duy nhất không ai lấy mất được.', pillar: 'investment' },
    { day: 16, week: 3, title: 'Quy tắc 6 Chiếc Lọ', description: 'Chia thu nhập tháng này vào đúng tỷ lệ các quỹ (Thiết yếu, Đầu tư, Dự phòng...).', action: 'Phân bổ tiền vào các hũ thực tế', coachMessage: 'Kỷ luật là tự do.', pillar: 'mindset' },
    { day: 17, week: 3, title: 'Xây dựng Thương hiệu', description: 'Đăng 1 video hoặc bài viết chia sẻ kiến thức chuyên môn lên mạng xã hội.', action: 'Thực hiện 1 hành động xây thương hiệu', coachMessage: 'Uy tín cá nhân chính là thỏi nam châm hút tiền.', pillar: 'income' },
    { day: 18, week: 3, title: 'Dọn dẹp nợ xấu', description: 'Lên kế hoạch trả dứt điểm khoản nợ có lãi suất cao nhất.', action: 'Thực hiện 1 khoản trả nợ thêm', coachMessage: 'Giải phóng bản thân khỏi xiềng xích của nợ nần.', pillar: 'protection' },
    { day: 19, week: 3, title: 'Quan sát người giàu', description: 'Dành 1 tiếng tại sảnh khách sạn 5 sao. Quan sát cách họ hành động và giao tiếp.', action: 'Trải nghiệm sống trên chuẩn 10%', coachMessage: 'Mở rộng vùng an toàn để thấy thế giới rộng lớn.', pillar: 'mindset' },
    { day: 20, week: 3, title: 'Lập kế hoạch 90 ngày', description: 'Viết mục tiêu tài chính cụ thể cho 3 tháng tới (VD: Đạt 50tr dự phòng).', action: 'Viết xuống mục tiêu con số cụ thể', coachMessage: 'Mục tiêu rõ ràng là 50% chiến thắng.', pillar: 'mindset' },
    { day: 21, week: 3, title: 'Tái đầu tư nhỏ', description: 'Lấy tiền lãi từ tiết kiệm hoặc kinh doanh để mua thêm chứng chỉ quỹ/vàng.', action: 'Thực hiện lệnh tái đầu tư đầu tiên', coachMessage: 'Bắt đầu nuôi dưỡng kỳ quan lãi kép.', pillar: 'investment' },
    { day: 22, week: 4, title: 'Hệ thống hóa', description: 'Quy trình hóa 1 việc bạn làm hàng ngày để có thể chuyển giao cho người khác.', action: 'Viết quy trình 1 công việc hiện tại', coachMessage: 'Muốn giàu phải biết nhân bản sức lao động.', pillar: 'income' },
    { day: 23, week: 4, title: 'Nghiên cứu ven đô', description: 'Tìm hiểu giá đất tại các khu vực cách trung tâm 30-50km có tuyến Metro.', action: 'Lập danh sách 3 khu vực tiềm năng', coachMessage: 'Tầm nhìn xa kiến tạo tài sản lớn.', pillar: 'investment' },
    { day: 24, week: 4, title: 'Sản phẩm số', description: 'Phác thảo ý tưởng cho 1 sản phẩm số (Ebook/Khóa học) dựa trên thế mạnh của bạn.', action: 'Viết outline sản phẩm số đầu tiên', coachMessage: 'Kiếm tiền ngay cả khi đang ngủ.', pillar: 'income' },
    { day: 25, week: 4, title: 'Kiểm toán tuần cuối', description: 'Review lại toàn bộ chi tiêu tuần 4. Đảm bảo tỷ lệ CẦN < 55%.', action: 'Đối chiếu số liệu với kế hoạch hũ', coachMessage: 'Số liệu không biết nói dối.', pillar: 'mindset' },
    { day: 26, week: 4, title: 'Gieo hạt tài chính', description: 'Trích Quỹ Cho Đi để giúp đỡ một người hoặc quỹ từ thiện bạn tin tưởng.', action: 'Thực hiện 1 hành động cho đi', coachMessage: 'Biết ơn để nhận lại nhiều hơn.', pillar: 'mindset' },
    { day: 27, week: 4, title: 'Kế hoạch di sản', description: 'Suy nghĩ về giá trị bạn muốn để lại cho con cháu (Kiến thức hay Tài sản?).', action: 'Viết 1 trang nhật ký về di sản', coachMessage: 'Sống vì sứ mệnh lớn hơn bản thân.', pillar: 'mindset' },
    { day: 28, week: 4, title: 'Thủ thuật đàm phán', description: 'Thử đàm phán giảm giá một món đồ hoặc tăng lương hôm nay.', action: 'Thực hiện 1 cuộc thương lượng tiền bạc', coachMessage: 'Mọi thứ đều có thể thương lượng nếu bạn có giá trị.', pillar: 'income' },
    { day: 29, week: 4, title: 'Lễ tổng kết', description: 'Nhìn lại 29 ngày qua. Bạn tự hào nhất về sự thay đổi nào ở bản thân?', action: 'Viết 3 thành công lớn nhất tháng qua', coachMessage: 'Bạn đã khác xưa rất nhiều. Hãy tự tin tiến bước.', pillar: 'mindset' },
    { day: 30, week: 4, title: 'Tốt nghiệp & Tăng tốc', description: 'Thiết lập mục tiêu cho 30 ngày tiếp theo với cấp độ tháp cao hơn.', action: 'Lập kế hoạch tài chính tháng tới', coachMessage: 'Chào mừng bạn đến với thế giới của những người làm chủ tài chính!', pillar: 'mindset' },
];