
import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheckIcon, TrendingUpIcon, ExclamationIcon, CheckCircleIcon, SparklesIcon } from './Icons';
import { PYRAMID_LEVELS, PyramidStatus } from '../lib/pyramidLogic';

interface Props {
    pyramidStatus?: PyramidStatus;
}

export const Journey: React.FC<Props> = (props) => {
    const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);

    // Default fallback if pyramidStatus not provided
    const defaultStatus: PyramidStatus = {
        currentLevel: PYRAMID_LEVELS[0],
        metrics: {
            avgIncome: 0,
            avgExpense: 0,
            emergencyFundMonths: 0,
            passiveIncome: 0,
            netWorth: 0,
            complianceScore: 0
        },
        reasons: ["Bắt đầu hành trình tài chính của bạn"],
        nextLevelConditions: ["Ghi chép giao dịch đầu tiên"],
        actions7d: ["Bắt đầu quan sát dòng tiền"]
    };

    const pyramidStatus = props.pyramidStatus ?? defaultStatus;
    const { currentLevel, metrics, reasons, nextLevelConditions, actions7d } = pyramidStatus;

    const [checkedConditions, setCheckedConditions] = useState<Record<string, boolean>>(() => {
        const saved = localStorage.getItem('smartfinance_journey_checks');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('smartfinance_journey_checks', JSON.stringify(checkedConditions));
    }, [checkedConditions]);

    const displayLevel = selectedLevelId ? (PYRAMID_LEVELS.find(l => l.id === selectedLevelId) || currentLevel) : currentLevel;

    const toggleCondition = (condition: string) => {
        setCheckedConditions(prev => ({
            ...prev,
            [condition]: !prev[condition]
        }));
    };

    const nextLevelProgress = useMemo(() => {
        if (!nextLevelConditions.length) return 100;
        const checkedCount = nextLevelConditions.filter(c => !!checkedConditions[c]).length;
        return Math.round((checkedCount / nextLevelConditions.length) * 100);
    }, [nextLevelConditions, checkedConditions]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: The Premium Pyramid */}
            <div className="lg:col-span-5 flex flex-col items-center bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-slate-800 shadow-premium">
                <div className="text-center mb-10">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Bản Đồ Thịnh Vượng</h3>
                    <p className="text-[10px] font-black text-luxury-gold uppercase tracking-[0.3em] mt-2 opacity-60">Wealth Strategy Pyramid</p>
                </div>

                <div className="flex flex-col-reverse w-full items-center space-y-reverse space-y-2">
                    {PYRAMID_LEVELS.map((level) => {
                        const isCurrent = level.id === currentLevel.id;
                        const isSelected = level.id === selectedLevelId;
                        const isPassed = level.id < currentLevel.id;

                        const widthPct = 100 - (level.id * 8);

                        return (
                            <button
                                key={level.id}
                                onClick={() => setSelectedLevelId(level.id)}
                                style={{ width: `${widthPct}%` }}
                                className={`
                                    group relative h-14 md:h-16 flex items-center justify-center transition-all duration-700 rounded-2xl overflow-hidden active:scale-95
                                    ${isCurrent
                                        ? `bg-gradient-to-r ${level.color} text-white shadow-luxury-gold scale-105 z-20 border border-white/20`
                                        : isPassed
                                            ? `bg-gradient-to-r ${level.color} text-white opacity-30 hover:opacity-100 hover:scale-102`
                                            : 'bg-slate-800/40 text-slate-500 hover:bg-slate-700/60 hover:text-white border border-white/5'
                                    }
                                    ${isSelected ? 'ring-4 ring-luxury-gold/30' : ''}
                                `}
                            >
                                <span className={`text-[10px] md:text-xs font-black uppercase tracking-[0.2em] ${isCurrent ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                                    {level.id}. {level.name}
                                </span>

                                {isCurrent && (
                                    <div className="absolute left-6 animate-pulse">
                                        <div className="w-2 h-2 bg-white rounded-full shadow-glow"></div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-12 flex items-center gap-4 p-5 bg-black/40 rounded-[1.5rem] w-full border border-white/5 shadow-inner">
                    <div className="p-2.5 bg-luxury-gold/10 rounded-xl border border-luxury-gold/20">
                        <SparklesIcon className="w-5 h-5 text-luxury-gold" />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium italic">
                        “Sức mạnh của lãi kép không chỉ nằm ở tiền, mà nằm ở sự tích lũy của kỷ luật tài chính mỗi ngày.”
                    </p>
                </div>
            </div>

            {/* Right Column: Detailed Intelligence */}
            <div className="lg:col-span-7 space-y-6 w-full">

                {/* 1. Header Level Card */}
                <div className={`relative overflow-hidden p-8 md:p-10 rounded-[2.5rem] border transition-all duration-700 shadow-premium ${displayLevel.bg} ${displayLevel.id === currentLevel.id ? 'border-luxury-gold/30' : 'border-slate-800'}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className={`p-5 rounded-[1.5rem] bg-gradient-to-br ${displayLevel.color} text-white shadow-luxury`}>
                                <TrendingUpIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Cấp độ hiện tại</span>
                                    {displayLevel.id === currentLevel.id && (
                                        <span className="px-3 py-1 bg-luxury-gold text-black text-[9px] font-black uppercase rounded-full shadow-luxury animate-bounce">Bạn ở đây</span>
                                    )}
                                </div>
                                <h2 className={`text-3xl font-black mt-2 tracking-tighter italic ${displayLevel.textColor}`}>{displayLevel.id}. {displayLevel.name}</h2>
                            </div>
                        </div>
                        <div className="flex flex-col md:items-end">
                            <div className="text-[9px] uppercase font-black text-slate-500 tracking-[0.3em] mb-1">Chiến lược chính</div>
                            <div className={`text-sm font-black uppercase tracking-widest ${displayLevel.textColor}`}>{displayLevel.criteria}</div>
                        </div>
                    </div>

                    <p className={`mt-8 text-[15px] leading-relaxed opacity-70 font-medium ${displayLevel.textColor}`}>
                        {displayLevel.description}. Ở tầng này, mục tiêu cốt lõi của bạn là <span className="underline decoration-luxury-gold/50 underline-offset-4">{nextLevelConditions[0].toLowerCase()}</span>.
                    </p>
                </div>

                {/* 2. Real-time Indicators */}
                {(selectedLevelId === null || selectedLevelId === currentLevel.id) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <IndicatorCard
                            label="Cashflow TB"
                            value={formatVND(metrics.avgIncome - metrics.avgExpense)}
                            sub={metrics.avgIncome > metrics.avgExpense ? "Positive" : "Negative"}
                            status={metrics.avgIncome > metrics.avgExpense ? "success" : "danger"}
                        />
                        <IndicatorCard
                            label="Backup Fund"
                            value={`${metrics.emergencyFundMonths.toFixed(1)} Months`}
                            sub={`Goal: 6.0 Months`}
                            status={metrics.emergencyFundMonths >= 6 ? "success" : metrics.emergencyFundMonths >= 3 ? "warning" : "danger"}
                        />
                        <IndicatorCard
                            label="Kỷ Luật Tài Chính"
                            value={`${metrics.complianceScore}%`}
                            sub="Rules Completion"
                            status={metrics.complianceScore >= 80 ? "success" : metrics.complianceScore >= 50 ? "warning" : "danger"}
                        />
                    </div>
                )}

                {/* 3. Reasons & Next Level Checklist */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800 shadow-premium">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-6 flex items-center gap-3">
                            <ExclamationIcon className="w-4 h-4 text-amber-500" />
                            Phân tích hiện trạng
                        </h4>
                        <ul className="space-y-5 mb-10">
                            {reasons.map((r, i) => (
                                <li key={i} className="flex items-start text-[13px] text-slate-400 leading-relaxed font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50 mt-1.5 mr-4 shrink-0"></div>
                                    {r}
                                </li>
                            ))}
                        </ul>

                        <div className="pt-8 border-t border-slate-800">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Lộ trình thăng hạng</h4>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${nextLevelProgress === 100 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-luxury-gold/10 text-luxury-gold'}`}>
                                    {nextLevelProgress}%
                                </span>
                            </div>

                            <div className="space-y-4">
                                {nextLevelConditions.map((condition, i) => (
                                    <button
                                        key={i}
                                        onClick={() => toggleCondition(condition)}
                                        className="w-full flex items-center group text-left"
                                    >
                                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mr-4 transition-all duration-500 ${checkedConditions[condition] ? 'bg-emerald-500 border-emerald-500 shadow-glow' : 'border-slate-700 bg-black/20 group-hover:border-luxury-gold'}`}>
                                            {checkedConditions[condition] && <CheckCircleIcon className="w-4 h-4 text-white" />}
                                        </div>
                                        <span className={`text-[13px] font-bold transition-all ${checkedConditions[condition] ? 'text-slate-600 line-through' : 'text-slate-300 group-hover:text-white'}`}>
                                            {condition}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 w-full bg-black/40 rounded-full h-1.5 border border-slate-800 overflow-hidden shadow-inner">
                                <div
                                    className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-1000 shadow-glow"
                                    style={{ width: `${nextLevelProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-premium relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-luxury-gold/5 blur-3xl group-hover:bg-luxury-gold/10 transition-all"></div>

                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-luxury-gold mb-8 flex items-center gap-3">
                            <ShieldCheckIcon className="w-4 h-4" />
                            Kế hoạch hành động 7 ngày
                        </h4>
                        <div className="space-y-6">
                            {actions7d.map((a, i) => (
                                <div key={i} className="flex gap-5 group/item cursor-pointer">
                                    <div className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center shrink-0 group-hover/item:border-luxury-gold transition-all bg-black/20 shadow-inner">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover/item:bg-luxury-gold transition-all"></div>
                                    </div>
                                    <p className="text-[13px] text-slate-400 group-hover/item:text-white transition-colors leading-relaxed font-bold italic tracking-tight">
                                        {a}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-10 py-5 bg-white text-black text-xs font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-luxury-gold transition-all duration-500 shadow-premium active:scale-95 group-hover:shadow-luxury">
                            Bắt đầu thực thi
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

function IndicatorCard({ label, value, sub, status }: { label: string, value: string, sub: string, status: 'success' | 'warning' | 'danger' }) {
    const statusColor = status === 'success' ? 'text-emerald-400' : status === 'warning' ? 'text-amber-400' : 'text-rose-400';
    const borderColor = status === 'success' ? 'border-emerald-500/20' : status === 'warning' ? 'border-amber-500/20' : 'border-rose-500/20';

    return (
        <div className={`bg-slate-900 border ${borderColor} p-6 rounded-[1.5rem] shadow-premium flex flex-col items-center text-center transition-all hover:scale-105 active:scale-95`}>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] mb-3">{label}</span>
            <span className={`text-xl font-black font-mono tracking-tighter ${statusColor}`}>{value}</span>
            <span className="text-[9px] font-black text-slate-600 mt-2 uppercase tracking-widest">{sub}</span>
        </div>
    );
}

function formatVND(n: number) {
    return Math.round(n || 0).toLocaleString("vi-VN") + " ₫";
}
