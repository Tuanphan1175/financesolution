
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
            <div className="lg:col-span-5 flex flex-col items-center bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-10">
                    <h3 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">Bản Đồ Thịnh Vượng</h3>
                    <p className="text-sm text-gray-500 mt-2">Hành trình từ Sống sót đến Di sản</p>
                </div>

                <div className="flex flex-col-reverse w-full items-center space-y-reverse space-y-1">
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
                                    group relative h-14 md:h-16 flex items-center justify-center transition-all duration-500 rounded-xl overflow-hidden
                                    ${isCurrent
                                        ? `bg-gradient-to-r ${level.color} text-white shadow-xl scale-110 z-20 border-2 border-white dark:border-gray-800`
                                        : isPassed
                                            ? `bg-gradient-to-r ${level.color} text-white opacity-40 hover:opacity-100`
                                            : 'bg-gray-100 dark:bg-gray-700/50 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }
                                    ${isSelected ? 'ring-4 ring-primary-400 ring-offset-2 dark:ring-offset-gray-900' : ''}
                                `}
                            >
                                <span className={`text-xs md:text-sm font-black uppercase tracking-widest ${isCurrent ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                                    {level.id}. {level.name}
                                </span>

                                {isCurrent && (
                                    <div className="absolute left-4 animate-pulse">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-12 flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl w-full border border-dashed border-gray-300 dark:border-gray-700">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <SparklesIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <p className="text-[11px] text-gray-500 leading-tight">
                        “Sức mạnh của lãi kép không chỉ nằm ở tiền, mà nằm ở sự tích lũy của kỷ luật tài chính mỗi ngày.”
                    </p>
                </div>
            </div>

            {/* Right Column: Detailed Intelligence */}
            <div className="lg:col-span-7 space-y-6">

                {/* 1. Header Level Card */}
                <div className={`relative overflow-hidden p-8 rounded-3xl shadow-lg border transition-all duration-500 ${displayLevel.bg} ${displayLevel.id === currentLevel.id ? 'border-primary-200 dark:border-primary-900/50' : 'border-gray-200 dark:border-gray-700'}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${displayLevel.color} text-white shadow-lg`}>
                                <TrendingUpIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Tầng Tài Chính</span>
                                    {displayLevel.id === currentLevel.id && (
                                        <span className="px-2 py-0.5 bg-primary-500 text-white text-[10px] font-bold rounded-full animate-bounce">Bạn ở đây</span>
                                    )}
                                </div>
                                <h2 className={`text-3xl font-black ${displayLevel.textColor}`}>{displayLevel.id}. {displayLevel.name}</h2>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-[10px] uppercase font-bold text-gray-500">Tiêu chí</div>
                            <div className={`text-sm font-bold ${displayLevel.textColor}`}>{displayLevel.criteria}</div>
                        </div>
                    </div>

                    <p className={`mt-6 text-sm leading-relaxed opacity-80 ${displayLevel.textColor}`}>
                        {displayLevel.description}. Ở tầng này, mục tiêu cốt lõi của bạn là {nextLevelConditions[0].toLowerCase()}.
                    </p>
                </div>

                {/* 2. Real-time Indicators */}
                {(selectedLevelId === null || selectedLevelId === currentLevel.id) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <IndicatorCard
                            label="Cashflow TB"
                            value={formatVND(metrics.avgIncome - metrics.avgExpense)}
                            sub={metrics.avgIncome > metrics.avgExpense ? "Dương" : "Âm"}
                            status={metrics.avgIncome > metrics.avgExpense ? "success" : "danger"}
                        />
                        <IndicatorCard
                            label="Quỹ Dự Phòng"
                            value={`${metrics.emergencyFundMonths.toFixed(1)} Tháng`}
                            sub={`Tiêu chuẩn: 6.0`}
                            status={metrics.emergencyFundMonths >= 6 ? "success" : metrics.emergencyFundMonths >= 3 ? "warning" : "danger"}
                        />
                        <IndicatorCard
                            label="Điểm Kỷ Luật"
                            value={`${metrics.complianceScore}%`}
                            sub="11 Nguyên tắc vàng"
                            status={metrics.complianceScore >= 80 ? "success" : metrics.complianceScore >= 50 ? "warning" : "danger"}
                        />
                    </div>
                )}

                {/* 3. Reasons & Next Level Checklist */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700">
                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-800 dark:text-white mb-4 flex items-center">
                            <ExclamationIcon className="w-4 h-4 mr-2 text-orange-500" />
                            Phân tích hiện tại
                        </h4>
                        <ul className="space-y-4 mb-8">
                            {reasons.map((r, i) => (
                                <li key={i} className="flex items-start text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 mr-3 shrink-0"></div>
                                    {r}
                                </li>
                            ))}
                        </ul>

                        <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-black uppercase text-gray-800 dark:text-white">Lộ trình thăng hạng</h4>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${nextLevelProgress === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-primary-100 text-primary-600'}`}>
                                    {nextLevelProgress}%
                                </span>
                            </div>

                            <div className="space-y-3">
                                {nextLevelConditions.map((condition, i) => (
                                    <button
                                        key={i}
                                        onClick={() => toggleCondition(condition)}
                                        className="w-full flex items-center group text-left"
                                    >
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mr-3 transition-all ${checkedConditions[condition] ? 'bg-emerald-500 border-emerald-500 shadow-sm' : 'border-gray-300 dark:border-gray-600 group-hover:border-primary-500'}`}>
                                            {checkedConditions[condition] && <CheckCircleIcon className="w-4 h-4 text-white" />}
                                        </div>
                                        <span className={`text-xs font-bold transition-all ${checkedConditions[condition] ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300 group-hover:text-primary-500'}`}>
                                            {condition}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-6 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-emerald-500 h-full transition-all duration-1000"
                                    style={{ width: `${nextLevelProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-800">
                        <h4 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-6 flex items-center">
                            <ShieldCheckIcon className="w-4 h-4 mr-2" />
                            7 Ngày Chiến Thuật
                        </h4>
                        <div className="space-y-4">
                            {actions7d.map((a, i) => (
                                <div key={i} className="flex gap-4 group cursor-pointer">
                                    <div className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 group-hover:border-emerald-500 transition-all">
                                        <CheckCircleIcon className="w-4 h-4 text-slate-700 group-hover:text-emerald-500" />
                                    </div>
                                    <p className="text-xs text-slate-300 group-hover:text-white transition-colors leading-relaxed font-medium">
                                        {a}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                            Bắt đầu thực thi
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

function IndicatorCard({ label, value, sub, status }: { label: string, value: string, sub: string, status: 'success' | 'warning' | 'danger' }) {
    const statusColor = status === 'success' ? 'text-emerald-500' : status === 'warning' ? 'text-orange-500' : 'text-red-500';
    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">{label}</span>
            <span className={`text-lg font-black font-mono ${statusColor}`}>{value}</span>
            <span className="text-[10px] font-medium text-gray-500 mt-1">{sub}</span>
        </div>
    );
}

function formatVND(n: number) {
    return Math.round(n || 0).toLocaleString("vi-VN") + " ₫";
}
