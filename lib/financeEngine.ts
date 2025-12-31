
import { FIN_PLAYBOOK, IncomeTier, JarKey, PyramidLevel } from "../knowledge/financialPlaybook";

export type Profile = {
  monthlyIncome: number;       // VNĐ
  monthlyEssentialCost: number;// VNĐ (tổng chi thiết yếu)
  emergencyFundBalance: number;// VNĐ
  debtPaymentMonthly: number;  // VNĐ
  hasHighInterestDebt: boolean;
  businessMode?: "PERSONAL" | "BUSINESS";
};

export type AllocationResult = {
  tier: IncomeTier;
  jars: { key: JarKey; label: string; pct: number; amount: number; note: string }[];
  level: PyramidLevel;
  diagnostics: string[];
  actions7d: string[];
  actions30d: string[];
};

export function detectIncomeTier(monthlyIncome: number): IncomeTier {
  if (monthlyIncome <= 42_000_000) return "UNDER_500M_YEAR";
  if (monthlyIncome <= 50_000_000) return "20M_MONTH";
  if (monthlyIncome <= 200_000_000) return "100M_MONTH";
  return "1B_MONTH";
}

function clampPct(p: number, min: number, max: number) {
  return Math.max(min, Math.min(max, p));
}

function chooseDefaultPct(tier: IncomeTier, key: JarKey): number {
  const row = FIN_PLAYBOOK.jars[tier].find(x => x.key === key);
  if (!row) return 0;
  if (tier === "UNDER_500M_YEAR" && key === "ESSENTIAL") return row.maxPct;
  if (row.minPct === row.maxPct) return row.minPct;
  return row.minPct;
}

export function computePyramidLevel(p: Profile): PyramidLevel {
  const essentialRatio = p.monthlyEssentialCost / Math.max(1, p.monthlyIncome);
  const emergencyMonths = p.emergencyFundBalance / Math.max(1, p.monthlyEssentialCost);

  if (p.hasHighInterestDebt) return "SURVIVAL";
  if (essentialRatio > 0.65) return "SURVIVAL";
  if (emergencyMonths < 1) return "STABILITY";
  if (emergencyMonths < 3) return "STABILITY";
  if (emergencyMonths >= 3 && emergencyMonths < 6) return "GROWTH";
  if (emergencyMonths >= 6) return "WEALTH";
  return "STABILITY";
}

export function buildAllocation(p: Profile): AllocationResult {
  const tier = detectIncomeTier(p.monthlyIncome);
  const level = computePyramidLevel(p);

  const diagnostics: string[] = [];
  const emergencyMonths = p.emergencyFundBalance / Math.max(1, p.monthlyEssentialCost);
  const essentialRatio = p.monthlyEssentialCost / Math.max(1, p.monthlyIncome);

  if (p.hasHighInterestDebt) diagnostics.push("Bạn đang có nợ lãi cao: ưu tiên trả nợ trước khi tăng rủi ro đầu tư.");
  if (essentialRatio > 0.55) diagnostics.push(`Chi thiết yếu đang cao (${Math.round(essentialRatio * 100)}%). Mục tiêu giảm dần về 40–55% tùy giai đoạn.`);
  diagnostics.push(`Quỹ dự phòng hiện ~ ${emergencyMonths.toFixed(1)} tháng chi thiết yếu.`);

  const baseJars = FIN_PLAYBOOK.jars[tier].map(j => ({
    key: j.key,
    label: j.label,
    pct: chooseDefaultPct(tier, j.key),
    note: j.note,
  }));

  const jars = baseJars.map(x => ({ ...x }));
  const get = (k: JarKey) => jars.find(j => j.key === k)!;

  if (emergencyMonths < 3) {
    const bump = 5;
    get("EMERGENCY").pct = clampPct(get("EMERGENCY").pct + bump, 10, 25);
    get("INVEST").pct = clampPct(get("INVEST").pct - 3, 5, 80);
    get("FUN").pct = clampPct(get("FUN").pct - 2, 0, 10);
    diagnostics.push("Chưa đủ dự phòng 3 tháng: tạm tăng quỹ dự phòng, giảm quỹ đầu tư/ăn chơi.");
  }

  if (p.hasHighInterestDebt) {
    const cut = 8;
    get("INVEST").pct = clampPct(get("INVEST").pct - 5, 0, 80);
    get("FUN").pct = clampPct(get("FUN").pct - 3, 0, 10);
    diagnostics.push("Có nợ lãi cao: tạm thời cắt bớt đầu tư/ăn chơi để tăng tốc trả nợ.");
  }

  let total = jars.reduce((s, j) => s + j.pct, 0);
  if (total !== 100) {
    const diff = 100 - total;
    get("ESSENTIAL").pct = clampPct(get("ESSENTIAL").pct + diff, 10, 70);
    total = jars.reduce((s, j) => s + j.pct, 0);
  }

  const computed = jars.map(j => ({
    ...j,
    amount: Math.round((p.monthlyIncome * j.pct) / 100),
  }));

  const actions7d = generate7DayActions(p, level);
  const actions30d = generate30DayActions(p, level);

  return { tier, jars: computed, level, diagnostics, actions7d, actions30d };
}

function generate7DayActions(p: Profile, level: PyramidLevel): string[] {
  if (level === "SURVIVAL") {
    return [
      "Cắt bỏ ngay 3 khoản chi 'rò rỉ' (ăn vặt, trà sữa, app rác) để giữ lại ít nhất 500k trong 7 ngày tới.",
      "Hủy toàn bộ các subscription (Netflix, Spotify, App rác) không dùng quá 2 lần/tháng ngay hôm nay.",
      "Thực hiện 24h 'No-Spend Challenge' - Không chi một đồng nào vào ngày thứ Tư tới."
    ];
  }

  if (level === "STABILITY") {
    return [
      "Tự động chuyển 10% thu nhập vào quỹ dự phòng trong 7 ngày tới ngay khi tiền về.",
      "Liệt kê và bán 3 món tiêu sản (đồ cũ, máy móc không dùng) để thu hồi ít nhất 1 triệu đồng thặng dư.",
      "Ghi chép 100% chi tiêu hàng ngày vào ứng dụng, không bỏ sót dù chỉ 2.000đ gửi xe."
    ];
  }

  if (level === "GROWTH") {
    return [
      "Nâng quỹ tích lũy dự phòng lên mức 20% thu nhập thặng dư trong đợt lương tuần này.",
      "Dành 2 giờ tối thứ Bảy nghiên cứu danh mục ETF (VN30/VN100) để bắt đầu chiến dịch tích sản.",
      "Đầu tư ít nhất 500k vào một cuốn sách hoặc khóa học kỹ năng 'tạo tiền nhanh' ngay hôm nay."
    ];
  }

  if (level === "WEALTH") {
    return [
      "Rà soát toàn bộ danh mục đầu tư: Tái phân bổ tài sản theo tỷ lệ rủi ro/an toàn ngay trong tuần này.",
      "Tìm hiểu và phân tích 2 mã cổ phiếu trả cổ tức cao (>8%) để gia tăng dòng tiền thụ động.",
      "Tái đầu tư 100% lợi nhuận thu về từ các kênh đầu tư hiện có trong 7 ngày tới để tận dụng lãi kép."
    ];
  }

  return [
    "Thiết lập hệ thống email marketing hoặc quy trình tự động cho 1 công việc kinh doanh của bạn tuần này.",
    "Dành 2 giờ cố vấn tài chính cho một cá nhân tiềm năng ở cấp độ thấp hơn trong cộng đồng của bạn.",
    "Trích 5% lợi nhuận ròng tuần này vào quỹ thiện nguyện mục tiêu giáo dục mà bạn tin tưởng."
  ];
}

function generate30DayActions(p: Profile, level: PyramidLevel): string[] {
  const list: string[] = [];
  list.push("Hoàn thành báo cáo tỉnh thức 30 ngày: Tổng thu, tổng chi, thặng dư và điểm kỷ luật.");

  if (level === "SURVIVAL") {
    list.push("Mục tiêu: Đưa chi phí thiết yếu về mức ≤ 55% thu nhập tổng.");
    list.push("Trả dứt điểm ít nhất 1 khoản nợ nhỏ (chiến thuật Snowball) trong tháng này.");
    return list;
  }

  if (level === "STABILITY") {
    list.push("Mục tiêu: Quỹ dự phòng đạt mốc 3 tháng chi tiêu thiết yếu.");
    list.push("Tạo thêm ít nhất 2.000.000đ thu nhập từ một nguồn phụ (freelance/bán hàng).");
    return list;
  }

  if (level === "GROWTH") {
    list.push("Mục tiêu: Quỹ dự phòng đạt 6 tháng; hoàn thành 1 chứng chỉ kỹ năng chuyên môn.");
    list.push("Xây dựng thói quen DCA (đầu tư định kỳ) ổn định trong suốt 4 tuần liên tiếp.");
    return list;
  }

  if (level === "WEALTH") {
    list.push("Mục tiêu: Thu nhập thụ động phủ kín ít nhất 50% chi phí sống thiết yếu.");
    list.push("Hoàn thiện hợp đồng bảo vệ tài sản và kế hoạch dự phòng rủi ro dài hạn.");
    return list;
  }

  list.push("Mục tiêu: Đạt tự do tài chính (thụ động ≥ 100% chi tiêu) và hoàn thiện kế hoạch di sản.");
  return list;
}
