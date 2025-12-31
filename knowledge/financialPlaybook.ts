
export type IncomeTier = "UNDER_500M_YEAR" | "20M_MONTH" | "100M_MONTH" | "1B_MONTH";

export type JarKey =
  | "ESSENTIAL"
  | "EDUCATION"
  | "EMERGENCY"
  | "INVEST"
  | "FUN"
  | "GIVE";

export type JarAllocation = {
  key: JarKey;
  label: string;
  minPct: number;
  maxPct: number;
  note: string;
};

export type PyramidLevel =
  | "SURVIVAL"       // Sống sót - Thu nhập <= Chi tiêu
  | "STABILITY"      // Ổn định - Có thặng dư nhỏ
  | "GROWTH"         // Tích lũy - Dự phòng 3-6 tháng
  | "WEALTH"         // An toàn/Tự do - Dự phòng > 1 năm, có thụ động
  | "LEGACY";        // Thịnh vượng - Di sản cho đời sau

export type InvestmentLadderStep = {
  step: number;
  title: string;
  description: string;
  suitability: string;
  redFlags: string[];
};

export const FIN_PLAYBOOK = {
  jars: {
    UNDER_500M_YEAR: [
      { key: "ESSENTIAL", label: "Quỹ Thiết yếu", minPct: 10, maxPct: 55, note: "Chi phí sống, gia đình (Coach Tuấn Dr: mục tiêu <55%)." },
      { key: "EDUCATION", label: "Quỹ Giáo dục", minPct: 10, maxPct: 20, note: "Học để tăng ROI bản thân (Quan trọng nhất)." },
      { key: "EMERGENCY", label: "Quỹ Dự phòng", minPct: 10, maxPct: 20, note: "Sống chết cũng phải có quỹ này." },
      { key: "INVEST", label: "Quỹ Đầu tư", minPct: 5, maxPct: 80, note: "Nhân tiền (Chỉ khi đã có dự phòng vững)." },
      { key: "FUN", label: "Quỹ Ăn chơi", minPct: 5, maxPct: 10, note: "Sống trên chuẩn 10% để lấy động lực." },
      { key: "GIVE", label: "Quỹ Cho đi", minPct: 1, maxPct: 10, note: "Gieo hạt để nhận phước báu." },
    ] as JarAllocation[],
    "20M_MONTH": [
      { key: "ESSENTIAL", label: "Quỹ Thiết yếu", minPct: 50, maxPct: 55, note: "Cố gắng sống dưới mức khả năng." },
      { key: "EDUCATION", label: "Quỹ Giáo dục", minPct: 15, maxPct: 15, note: "Học kỹ năng tạo tiền nhanh (Sale/AI)." },
      { key: "EMERGENCY", label: "Quỹ Dự phòng", minPct: 10, maxPct: 10, note: "Xây quỹ 6 tháng chi phí." },
      { key: "INVEST", label: "Quỹ Đầu tư", minPct: 15, maxPct: 15, note: "ETF, Vàng hoặc tích sản chứng khoán." },
      { key: "FUN", label: "Quỹ Ăn chơi", minPct: 5, maxPct: 5, note: "Tự thưởng có kỷ luật." },
      { key: "GIVE", label: "Quỹ Cho đi", minPct: 5, maxPct: 5, note: "Cho đi là còn mãi." },
    ] as JarAllocation[],
    "100M_MONTH": [
      { key: "ESSENTIAL", label: "Quỹ Thiết yếu", minPct: 40, maxPct: 40, note: "Giữ phong cách sống ổn định." },
      { key: "EDUCATION", label: "Quỹ Giáo dục", minPct: 10, maxPct: 10, note: "Cố vấn, Coaching cao cấp." },
      { key: "EMERGENCY", label: "Quỹ Dự phòng", minPct: 10, maxPct: 10, note: "Quỹ dự phòng 1-2 năm." },
      { key: "INVEST", label: "Quỹ Đầu tư", minPct: 30, maxPct: 30, note: "Bất động sản ven đô, dòng tiền." },
      { key: "FUN", label: "Quỹ Ăn chơi", minPct: 5, maxPct: 5, note: "Tận hưởng chất lượng cao." },
      { key: "GIVE", label: "Quỹ Cho đi", minPct: 5, maxPct: 5, note: "Từ thiện có chiến lược." },
    ] as JarAllocation[],
    "1B_MONTH": [
      { key: "ESSENTIAL", label: "Quỹ Thiết yếu", minPct: 20, maxPct: 20, note: "Tối ưu hóa thuế và vận hành." },
      { key: "EDUCATION", label: "Quỹ Giáo dục", minPct: 10, maxPct: 10, note: "Chiến lược vĩ mô, di sản." },
      { key: "EMERGENCY", label: "Quỹ Dự phòng", minPct: 10, maxPct: 10, note: "Dự phòng 5 năm (Theo chuẩn Coach Tuấn Dr)." },
      { key: "INVEST", label: "Quỹ Đầu tư", minPct: 50, maxPct: 50, note: "Sở hữu hệ thống/doanh nghiệp triệu đô." },
      { key: "FUN", label: "Quỹ Ăn chơi", minPct: 5, maxPct: 5, note: "Trải nghiệm thế giới." },
      { key: "GIVE", label: "Quỹ Cho đi", minPct: 5, maxPct: 5, note: "Phụng sự cộng đồng toàn cầu." },
    ] as JarAllocation[],
  },
  investmentLadder: [
    {
      step: 1,
      title: "Gửi tiết kiệm, Vàng, Đô la",
      description: "Mục đích chính là giữ tiền và chống lạm phát. Không giàu từ đây nhưng giúp an tâm.",
      suitability: "Người mới, đang xây móng tài chính.",
      redFlags: ["Hứa lãi suất cao bất thường", "Gửi nơi không uy tín"],
    },
    {
      step: 2,
      title: "Đầu tư thụ động ETF (VN30, VN100, Diamond)",
      description: "Thị trường làm việc thay bạn. Kỷ luật tích sản mỗi tháng (VD: 10 triệu/tháng sau 30 năm có 28 tỷ).",
      suitability: "Người bận rộn, muốn giàu bền vững nhờ lãi kép.",
      redFlags: ["Rút vốn trước hạn", "Dừng kỷ luật giữa chừng"],
    },
    {
      step: 3,
      title: "Cổ phiếu giá trị (Vinamilk, FPT...)",
      description: "Sở hữu một phần doanh nghiệp tốt, ăn cổ tức và lãi vốn dài hạn.",
      suitability: "Đã có kiến thức phân tích cơ bản.",
      redFlags: ["Đầu cơ theo tin đồn", "Dùng margin quá tay"],
    },
    {
      step: 4,
      title: "Bất động sản ven đô (Bán kính 30-50km)",
      description: "Nơi có quy hoạch, Metro, hoặc gần các tập đoàn lớn (Vin). Ưu tiên đất thổ cư có sổ, tạo dòng tiền cho thuê.",
      suitability: "Có vốn lớn, hiểu pháp lý, tầm nhìn 5-10 năm.",
      redFlags: ["Đất không sổ", "Vay quá 70%", "Không có dòng tiền"],
    },
    {
      step: 5,
      title: "Đầu tư vào bản thân & ROI thương hiệu",
      description: "Kỹ năng, tư duy, xây kênh Video ngắn. Đây là khoản đầu tư sinh lợi cao nhất (ROI cao nhất).",
      suitability: "Mọi cấp độ, đặc biệt là người muốn bứt phá thu nhập.",
      redFlags: ["Học không thực hành", "Thiếu kiên trì (không đủ 30 ngày)"],
    },
    {
      step: 6,
      title: "Sản phẩm số & Hệ thống bán hàng",
      description: "Làm 1 lần bán n lần (App, Khóa học, Ebook). Chi phí biên gần bằng 0.",
      suitability: "Chuyên gia, người có sức ảnh hưởng, chủ doanh nghiệp.",
      redFlags: ["Sản phẩm kém chất lượng", "Thiếu hệ thống vận hành tự động"],
    },
    {
      step: 7,
      title: "Sở hữu Doanh nghiệp & Hệ sinh thái",
      description: "Nhân bản đội ngũ, dùng đòn bẩy con người và tài chính để giải phóng lãnh đạo.",
      suitability: "Leader có tầm nhìn di sản.",
      redFlags: ["Tài chính mập mờ", "Thiếu sự minh bạch với cộng sự"],
    },
  ] as InvestmentLadderStep[],
} as const;
