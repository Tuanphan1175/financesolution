
import React, { useState } from 'react';
import { BriefcaseIcon, TrendingUpIcon, CollectionIcon, SparklesIcon, ScaleIcon, CashIcon, ShieldCheckIcon, ExclamationIcon } from './Icons';

interface IncomeLevel {
    level: number;
    title: string;
    range: string;
    description: string;
    trap: string;
    tasks: string[];
    metric: string;
    color: string;
}

const levels: IncomeLevel[] = [
    { 
        level: 1, 
        title: 'Bẫy Sống Sót', 
        range: '< 10 triệu/tháng', 
        description: 'Làm bao nhiêu xào bấy nhiêu. Bạn đang là nô lệ của hóa đơn.',
        trap: 'Bẫy thời gian: Đổi sức lao động lấy tiền lẻ.',
        tasks: [
            'Học một kỹ năng tạo tiền nhanh (Bán hàng, Content, AI).',
            'Cắt bỏ 100% chi phí "Muốn" lãng phí.',
            'Thực hiện thử thách 30 ngày ghi chép tỉnh thức.'
        ], 
        metric: 'Số giờ làm việc/thu nhập thấp.',
        color: 'from-red-500 to-rose-600'
    },
    { 
        level: 2, 
        title: 'Lao Động Trên Chuẩn', 
        range: '10 - 25 triệu/tháng', 
        description: 'Bắt đầu có thặng dư nhỏ. Làm việc nỗ lực hơn mặt bằng chung.',
        trap: 'Bẫy ổn định: Thấy đủ và ngừng học tập.',
        tasks: [
            'Làm việc trên chuẩn (Over-deliver) trong mọi dự án.',
            'Trích ngay 10% thu nhập cho Quỹ Giáo Dục (Đầu tư vào Não).',
            'Xây dựng 1 nguồn thu nhập phụ từ thế mạnh hiện có.'
        ], 
        metric: 'Thặng dư dòng tiền > 10%.',
        color: 'from-orange-500 to-amber-600'
    },
    { 
        level: 3, 
        title: 'Chuyên Gia / High-Skill', 
        range: '25 - 60 triệu/tháng', 
        description: 'Sở hữu kỹ năng hiếm, ROI cá nhân cao. Bạn là người giải quyết vấn đề.',
        trap: 'Bẫy tự doanh: Tự mình làm hết mọi việc, không dám tin tưởng người khác.',
        tasks: [
            'Xây dựng thương hiệu cá nhân đa kênh (Video ngắn).',
            'Đóng gói kiến thức thành sản phẩm số (Ebook/Khóa học).',
            'Học cách đàm phán dựa trên giá trị thay vì thời gian.'
        ], 
        metric: 'Giá trị giờ làm việc (Hourly Rate).',
        color: 'from-yellow-500 to-luxury-gold'
    },
    { 
        level: 4, 
        title: 'Chủ Doanh Nghiệp Nhỏ', 
        range: '60 - 150 triệu/tháng', 
        description: 'Có đội ngũ hỗ trợ. Bắt đầu dùng đòn bẩy con người.',
        trap: 'Bẫy quản lý: Bận rộn xử lý sự vụ, thiếu tầm nhìn chiến lược.',
        tasks: [
            'Quy trình hóa 80% các công việc lặp lại.',
            'Tuyển dụng và đào tạo nhân sự thay thế vị trí thực thi của mình.',
            'Tập trung vào 20% khách hàng mang lại 80% lợi nhuận.'
        ], 
        metric: 'Thời gian tự do/Tổng thu nhập.',
        color: 'from-emerald-500 to-teal-600'
    },
    { 
        level: 5, 
        title: 'Chủ Hệ Thống / Doanh Nhân', 
        range: '150 - 500 triệu/tháng', 
        description: 'Hệ thống vận hành tự động. Tiền về ngay cả khi bạn đang ngủ.',
        trap: 'Bẫy quy mô: Mở rộng quá nhanh khi chưa vững nền tảng văn hóa.',
        tasks: [
            'Xây dựng văn hóa và hệ giá trị cốt lõi cho doanh nghiệp.',
            'Thiết lập các chỉ số đo lường (KPI/OKR) tự động.',
            'Tái đầu tư 50% lợi nhuận vào các tài sản sinh dòng tiền.'
        ], 
        metric: 'EBITDA và Tốc độ tăng trưởng hệ thống.',
        color: 'from-blue-500 to-indigo-600'
    },
    { 
        level: 6, 
        title: 'Nhà Đầu Tư Chiến Lược', 
        range: '500 triệu - 2 tỷ/tháng', 
        description: 'Dùng tiền đẻ ra tiền. Đòn bẩy tài chính và mối quan hệ.',
        trap: 'Lòng tham: All-in vào các kèo rủi ro cao do quá tự tin.',
        tasks: [
            'Phân bổ tài sản vào BĐS dòng tiền và cổ phiếu tăng trưởng.',
            'Đầu tư vào các Startup tiềm năng (Angel Investor).',
            'Tối ưu hóa thuế và cấu trúc pháp lý tài sản.'
        ], 
        metric: 'Thu nhập thụ động / Tổng chi tiêu.',
        color: 'from-purple-500 to-fuchsia-600'
    },
    { 
        level: 7, 
        title: 'Huyền Thoại / Di Sản', 
        range: '> 2 tỷ/tháng', 
        description: 'Sống vì sứ mệnh. Phụng sự cộng đồng và để lại giá trị cho đời.',
        trap: 'Cái tôi (Ego): Nghĩ mình đã biết tất cả.',
        tasks: [
            'Thành lập quỹ thiện nguyện hoặc tín thác di sản.',
            'Viết sách và truyền cảm hứng cho thế hệ kế cận.',
            'Cố vấn (Mentoring) cho các lãnh đạo cấp cao khác.'
        ], 
        metric: 'Số lượng cuộc đời bạn đã thay đổi.',
        color: 'from-teal-400 to-emerald-600'
    },
];

export const IncomeLadder: React.FC = () => {
    const [selectedLevelId, setSelectedLevelId] = useState(1);
    const currentLevel = levels.find(l => l.level === selectedLevelId)!;

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-luxury-obsidian to-slate-900 p-10 rounded-[3rem] shadow-premium border border-luxury-gold/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000">
                    <TrendingUpIcon className="w-64 h-64 text-luxury-gold" />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-10 bg-luxury-gold"></div>
                        <span className="text-[10px] font-black uppercase text-luxury-gold tracking-[0.4em]">Financial Growth Strategy</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic mb-6">7 Cấp Độ Kiếm Tiền</h2>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                        Bản đồ lộ trình từ người làm công đến huyền thoại. Hãy xác định vị trí thực tế của mình để bắt đầu chiến lược "thăng hạng" đột phá. Thu nhập của bạn tỉ lệ thuận với giá trị và đòn bẩy bạn tạo ra.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Vertical Navigation Ladder */}
                <div className="lg:col-span-4 space-y-3">
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] mb-6 ml-4">The Ladder Hierarchy</p>
                    <div className="flex flex-col-reverse space-y-reverse space-y-3">
                        {levels.map((lvl) => (
                            <button
                                key={lvl.level}
                                onClick={() => setSelectedLevelId(lvl.level)}
                                className={`
                                    w-full text-left p-5 rounded-2xl flex items-center justify-between transition-all duration-500 border group
                                    ${selectedLevelId === lvl.level
                                        ? `bg-gradient-to-r ${lvl.color} border-white/20 text-white shadow-luxury scale-[1.02] z-10`
                                        : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700 hover:bg-slate-900'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm border ${selectedLevelId === lvl.level ? 'bg-white/20 border-white/40' : 'bg-black/20 border-slate-700'}`}>
                                        {lvl.level}
                                    </div>
                                    <span className="font-black uppercase tracking-widest text-[11px]">{lvl.title}</span>
                                </div>
                                <span className={`font-mono text-[10px] ${selectedLevelId === lvl.level ? 'text-white/80' : 'text-slate-600'}`}>{lvl.range}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Level Detail Panel */}
                <div className="lg:col-span-8">
                    <div className="bg-slate-900/90 p-10 rounded-[3rem] shadow-premium border border-slate-800 h-full flex flex-col">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                            <div className="flex items-center gap-6">
                                <div className={`p-5 rounded-[2rem] bg-gradient-to-br ${currentLevel.color} shadow-glow`}>
                                    <BriefcaseIcon className="h-10 w-10 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-black uppercase text-luxury-gold tracking-[0.2em]">Level {currentLevel.level} Strategic View</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">{currentLevel.title}</h3>
                                </div>
                            </div>
                            <div className="bg-black/40 px-8 py-4 rounded-3xl border border-slate-800 flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Mục tiêu thu nhập</span>
                                <span className={`text-xl font-black font-mono tracking-tighter bg-gradient-to-r ${currentLevel.color} bg-clip-text text-transparent`}>{currentLevel.range}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            {/* Description & Trap */}
                            <div className="space-y-6">
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 group hover:border-white/10 transition-all">
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-3 flex items-center">
                                        <SparklesIcon className="w-4 h-4 mr-2 text-luxury-gold" />
                                        Bản chất giai đoạn
                                    </h4>
                                    <p className="text-slate-300 text-sm leading-relaxed font-medium italic">
                                        "{currentLevel.description}"
                                    </p>
                                </div>
                                <div className="bg-rose-500/5 p-6 rounded-3xl border border-rose-500/10 group hover:border-rose-500/20 transition-all">
                                    <h4 className="text-[10px] font-black uppercase text-rose-400 tracking-[0.3em] mb-3 flex items-center">
                                        <ExclamationIcon className="w-4 h-4 mr-2" />
                                        Cạm bẫy (The Trap)
                                    </h4>
                                    <p className="text-slate-300 text-sm leading-relaxed font-medium">
                                        {currentLevel.trap}
                                    </p>
                                </div>
                            </div>

                            {/* Key Metric Card */}
                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] border border-slate-700 flex flex-col justify-center items-center text-center group">
                                <div className="p-4 bg-primary-500/10 rounded-full mb-6 group-hover:scale-110 transition-transform">
                                    <ShieldCheckIcon className="w-10 h-10 text-primary-400" />
                                </div>
                                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-4">Chỉ số đo lường then chốt</h4>
                                <p className="text-2xl font-black text-white tracking-tighter leading-tight uppercase">
                                    {currentLevel.metric}
                                </p>
                            </div>
                        </div>

                        {/* Action Checklist */}
                        <div className="mt-auto">
                            <h4 className="text-[12px] font-black uppercase text-white tracking-[0.4em] mb-8 flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold mr-4 shadow-glow"></div>
                                Nhiệm vụ đột phá để thăng hạng
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                                {currentLevel.tasks.map((task, idx) => (
                                    <div 
                                        key={idx} 
                                        className="flex items-center p-5 bg-black/30 rounded-2xl border border-slate-800 group hover:border-primary-500/30 transition-all cursor-pointer"
                                    >
                                        <div className="w-6 h-6 rounded-lg border border-slate-700 flex items-center justify-center mr-6 group-hover:bg-primary-500 group-hover:border-primary-500 transition-all">
                                            <div className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-white"></div>
                                        </div>
                                        <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                                            {task}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-800 flex items-center gap-6">
                            <p className="text-xs text-slate-500 italic font-medium leading-relaxed">
                                <span className="text-luxury-gold font-black uppercase mr-2 tracking-widest">Coach Tip:</span>
                                "Bạn không thể giải quyết vấn đề bằng chính tư duy đã tạo ra nó. Để lên cấp độ mới, bạn cần một bộ kỹ năng và tư duy hoàn toàn mới."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
