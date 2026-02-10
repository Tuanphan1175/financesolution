
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

export type Principle = {
  id: number;
  title: string;
  description: string;
  actionableTip: string;
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
  // =================================================================
  // 11 NGUYÊN TẮC VÀNG TRONG QUẢN LÝ TÀI CHÍNH (SUMMARY)
  // 1. Chỉ mua thứ mình CẦN, không mua thứ mình MUỐN.
  // 2. Tập trung vào TÀI SẢN, hạn chế TIÊU SẢN.
  // 3. Trả cho bản thân trước (Pay yourself first).
  // 4. Tiết kiệm trước, chi tiêu sau.
  // 5. Thu nhập > Chi tiêu (Làm việc trên chuẩn, sống dưới chuẩn).
  // 6. Luôn có quỹ dự phòng (6-12 tháng).
  // 7. Dùng đòn bẩy thông minh (Nợ tốt vs Nợ xấu).
  // 8. Để tiền sinh ra tiền (Lãi kép).
  // 9. Đa dạng hóa nhưng không giàn trải.
  // 10. Học trước khi đầu tư (Kiến thức đến đâu tiền đến đó).
  // 11. Tách bạch tiền cá nhân và kinh doanh.
  // =================================================================
  principles: [
    {
      id: 1,
      title: "Chỉ mua thứ mình cần, không mua thứ mình muốn",
      description: "Phân biệt rõ nhu cầu thiết yếu và ham muốn nhất thời. Ham muốn chỉ mang lại cảm xúc ngắn hạn.",
      actionableTip: "Trước khi mua món đồ > 1 triệu, hãy chờ 24h. Niệm thần chú: 'Mình có thực sự CẦN nó không?'",
    },
    {
      id: 2,
      title: "Tập trung vào tài sản, hạn chế tiêu sản",
      description: "Tài sản càng để càng tăng giá hoặc đẻ ra tiền. Tiêu sản mua về là mất giá và tốn thêm chi phí nuôi.",
      actionableTip: "Đầu tư vào Trí tuệ & Sức khỏe là tài sản vô giá. Xe cộ đi chơi là tiêu sản.",
    },
    {
      id: 3,
      title: "Trả cho bản thân trước",
      description: "Khi có thu nhập, người đầu tiên được nhận tiền là 'Quỹ tự do tài chính' của bạn, không phải chủ nợ hay hóa đơn.",
      actionableTip: "Trích ngay 10% thu nhập vào tài khoản đầu tư riêng biệt ngay khi nhận lương.",
    },
    {
      id: 4,
      title: "Tiết kiệm trước, chi tiêu sau",
      description: "Không phải tiêu dư rồi mới tiết kiệm. Công thức chuẩn: Thu nhập - Tiết kiệm = Chi tiêu.",
      actionableTip: "Tự động hóa việc chuyển tiền sang tài khoản tiết kiệm.",
    },
    {
      id: 5,
      title: "Thu nhập > Chi tiêu (Luật sống còn)",
      description: "Tư duy: 'Làm việc trên chuẩn, sống dưới chuẩn'. Nỗ lực kiếm nhiều hơn nhu cầu.",
      actionableTip: "Dành 90% thời gian sống dưới mức khả năng, nhưng 10% hãy tự thưởng sang trọng để nuôi dưỡng động lực.",
    },
    {
      id: 6,
      title: "Luôn có quỹ dự phòng",
      description: "Chiếc phao cứu sinh khi biến cố xảy ra (thất nghiệp, ốm đau, dịch bệnh).",
      actionableTip: "Tích lũy đủ 6-12 tháng chi phí sinh hoạt. Với doanh nghiệp là 1-2 năm.",
    },
    {
      id: 7,
      title: "Dùng đòn bẩy thông minh (Nợ tốt vs Nợ xấu)",
      description: "Nợ tốt giúp mua tài sản sinh lời > lãi vay. Nợ xấu là vay tiêu xài.",
      actionableTip: "Vay mua BĐS dòng tiền là tốt. Vay mua điện thoại là xấu. Tỷ lệ vay an toàn < 50%.",
    },
    {
      id: 8,
      title: "Để tiền sinh ra tiền (Lãi kép)",
      description: "Đừng để tiền chết. Hãy biến tiền thành nô lệ làm việc cho mình qua đầu tư.",
      actionableTip: "Tái đầu tư toàn bộ lãi. Đừng ăn vào vốn lẫn lãi.",
    },
    {
      id: 9,
      title: "Đa dạng hóa không giàn trải",
      description: "Không bỏ trứng vào một giỏ, nhưng cũng không rải thóc nơi mình không hiểu.",
      actionableTip: "Chỉ đầu tư vào lĩnh vực mình có kiến thức sâu. Không ủy thác mù quáng.",
    },
    {
      id: 10,
      title: "Học trước khi đầu tư",
      description: "Kiến thức đến đâu tiền đến đó. Mất tiền cho học phí rẻ hơn mất tiền cho thị trường.",
      actionableTip: "Công thức: Xem 20, Chọn 10, Quyết 3, Chốt 1.",
    },
    {
      id: 11,
      title: "Tách bạch tiền cá nhân và kinh doanh",
      description: "Sự minh bạch là nền tảng quản trị. Lẫn lộn sẽ dẫn đến 'ăn vào vốn'.",
      actionableTip: "Mở 2 tài khoản ngân hàng riêng biệt. Tự trả lương cho mình dù là chủ.",
    },
  ] as Principle[],
} as const;
