
import React, { useState, useMemo } from 'react';
import { JOURNEY_30_DAYS } from '../constants';
import { JourneyProgress, JourneyTask, TaskPillar } from '../types';
import { CheckCircleIcon, LockClosedIcon, CalendarIcon, FlagIcon, XIcon, TrendingUpIcon, SparklesIcon, ScaleIcon, CashIcon, ShieldCheckIcon } from './Icons';
import { PyramidLevelConfig, PYRAMID_LEVELS } from '../lib/pyramidLogic';

interface ThirtyDayJourneyProps {
    progress?: JourneyProgress;
    onCompleteDay?: (day: number, note?: string) => void;
    currentLevel?: PyramidLevelConfig;
    targetLevelId?: number;
    onSetTarget?: (id: number) => void;
}

const PILLAR_ICONS: Record<TaskPillar, React.FC<any>> = {
    income: TrendingUpIcon,
    expense: ScaleIcon,
    protection: ShieldCheckIcon,
    investment: CashIcon,
    mindset: SparklesIcon
};

const PILLAR_LABELS: Record<TaskPillar, string> = {
    income: 'Tăng Thu Nhập',
    expense: 'Tối Ưu Chi Phí',
    protection: 'Bảo Vệ Tài Sản',
    investment: 'Nhân Bản Tiền',
    mindset: 'Tư Duy & Kỷ Luật'
};

// Advanced Personalization Engine
const customizeTask = (task: JourneyTask, currentLevelId: number, targetLevelId: number): JourneyTask => {
    let customAction = task.action;
    let customMsg = task.coachMessage;
    let customTitle = task.title;

    const gap = targetLevelId - currentLevelId;

    // STRATEGY: SURVIVALISM (Levels 1 -> 2)
    if (currentLevelId <= 1 && targetLevelId >= 2) {
        if (task.pillar === 'expense') {
            customAction = `Cắt giảm 50% khoản chi này. Bạn đang ở tầng Sống Sót, kỷ luật chi tiêu là ưu tiên #1.`;
            customMsg = `Mỗi đồng tiết kiệm được hôm nay là một bước thoát khỏi xiềng xích nô lệ đồng tiền.`;
        }
        if (task.pillar === 'income') {
            customAction = `Tìm việc làm thêm ngay hôm nay. Mục tiêu là Cashflow dương.`;
        }
    }

    // STRATEGY: GROWTH (Levels 2 -> 4)
    if (currentLevelId >= 2 && targetLevelId <= 4) {
        if (task.pillar === 'protection') {
            customAction = `Tối ưu quỹ dự phòng đạt mốc ${currentLevelId === 2 ? '3' : '6'} tháng chi tiêu.`;
            customMsg = `Khi móng nhà vững (dự phòng), bạn mới có thể xây cao (đầu tư).`;
        }
        if (task.pillar === 'investment') {
            customAction = `Mua chứng chỉ quỹ ETF đầu tiên với số tiền nhỏ (từ 500k).`;
        }
    }

    // STRATEGY: WEALTH (Levels 4 -> 6)
    if (currentLevelId >= 4 && targetLevelId >= 6) {
        if (task.pillar === 'income') {
            customAction = `Quy trình hóa 1 công việc để có thể thuê nhân sự. Giải phóng thời gian để làm việc quan trọng hơn.`;
            customTitle = `${task.title} (Hệ thống hóa)`;
        }
        if (task.pillar === 'investment') {
            customAction = `Nghiên cứu dòng tiền từ BĐS hoặc Cổ tức. Mục tiêu là thu nhập thụ động phủ kín chi phí.`;
            customMsg = `Chào mừng đến với thế giới của những người làm chủ cuộc chơi tài chính.`;
        }
    }

    // Adjust messages for large gaps (Aggressive mode)
    if (gap > 2) {
        customMsg += ` Bạn đang đặt mục tiêu thăng hạng thần tốc (nhảy ${gap} bậc). Kỷ luật của bạn phải gấp đôi người thường!`;
    }

    return { ...task, action: customAction, coachMessage: customMsg, title: customTitle };
};

const WeekSection: React.FC<{
    week: number;
    title: string;
    days: JourneyTask[];
    progress: JourneyProgress;
    onSelectDay: (day: JourneyTask) => void;
    firstIncompleteDay: number;
    currentLevelId: number;
    targetLevelId: number;
}> = ({ week, title, days, progress, onSelectDay, firstIncompleteDay, currentLevelId, targetLevelId }) => {

    const weekColor = [
        'border-teal-500 text-teal-600',
        'border-blue-500 text-blue-600',
        'border-indigo-500 text-indigo-600',
        'border-purple-500 text-purple-600'
    ][week - 1];

    return (
        <div className="mb-10">
            <div className={`flex items-center mb-6 ${weekColor}`}>
                <div className={`font-black text-xs px-4 py-1.5 border-2 rounded-xl mr-4 uppercase tracking-[0.2em] shadow-sm ${weekColor} bg-white dark:bg-gray-800`}>
                    Tuần {week}
                </div>
                <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">{title}</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
                {days.map((baseTask) => {
                    const task = customizeTask(baseTask, currentLevelId, targetLevelId);
                    const isCompleted = progress[task.day]?.completed;
                    const isLocked = task.day > firstIncompleteDay && !isCompleted;
                    const isCurrent = task.day === firstIncompleteDay;
                    const PillarIcon = PILLAR_ICONS[task.pillar];

                    return (
                        <button
                            key={task.day}
                            onClick={() => !isLocked && onSelectDay(task)}
                            disabled={isLocked}
                            className={`
                                relative p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[140px] group
                                ${isCompleted
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500'
                                    : isLocked
                                        ? 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed'
                                        : isCurrent
                                            ? `bg-white dark:bg-gray-700 border-2 ${weekColor.split(' ')[0]} shadow-xl ring-4 ring-offset-2 ring-opacity-20 ring-current transform scale-105 z-10`
                                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:shadow-lg hover:-translate-y-1'
                                }
                            `}
                        >
                            <div className={`absolute top-3 left-3 opacity-20 group-hover:opacity-40 transition-opacity`}>
                                <PillarIcon className="w-8 h-8" />
                            </div>

                            {isCompleted && (
                                <div className="absolute top-3 right-3">
                                    <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                                </div>
                            )}

                            {isLocked ? (
                                <LockClosedIcon className="h-8 w-8 text-gray-400" />
                            ) : (
                                <>
                                    <span className="text-[10px] font-black mb-2 text-gray-400 uppercase tracking-widest">Ngày {task.day}</span>
                                    <span className="text-sm font-black line-clamp-2 text-gray-800 dark:text-white leading-tight">
                                        {task.title}
                                    </span>
                                </>
                            )}

                            {isCurrent && (
                                <span className="absolute -top-3 bg-rose-500 text-white text-[9px] uppercase font-black px-3 py-1 rounded-full shadow-lg animate-bounce">
                                    Hôm nay
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export const ThirtyDayJourney: React.FC<ThirtyDayJourneyProps> = (props) => {
    const progress = props.progress ?? {};
    const onCompleteDay = props.onCompleteDay ?? (() => { });
    const currentLevel = props.currentLevel ?? PYRAMID_LEVELS[0]; // Default to first level if not provided
    const targetLevelId = props.targetLevelId ?? currentLevel.id; // Default to current level if not provided
    const onSetTarget = props.onSetTarget ?? (() => { });

    const [selectedTask, setSelectedTask] = useState<JourneyTask | null>(null);
    const [note, setNote] = useState('');

    const completedCount = Object.values(progress).filter((p: any) => p.completed).length;
    const progressPercentage = (completedCount / 30) * 100;

    const firstIncompleteDay = useMemo(() => {
        for (let i = 1; i <= 30; i++) {
            if (!progress[i]?.completed) return i;
        }
        return 31;
    }, [progress]);

    const handleOpenTask = (task: JourneyTask) => {
        setNote(progress[task.day]?.note || '');
        setSelectedTask(task);
    };

    const handleComplete = () => {
        if (selectedTask) {
            onCompleteDay(selectedTask.day, note);
            setSelectedTask(null);
        }
    };

    const targetLevel = useMemo(() =>
        PYRAMID_LEVELS.find(l => l.id === targetLevelId) || currentLevel,
        [targetLevelId, currentLevel]);

    const weekTitles = ["Nhận diện & Tỉnh thức", "Kỷ luật & Kiểm soát", "Củng cố nền tảng", "Định hình thói quen mới"];

    return (
        <div className="space-y-8 pb-12">
            {/* Strategy Header Section */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row justify-between items-center gap-10">
                <div className="flex items-center gap-6">
                    <div className={`p-5 rounded-2xl bg-gradient-to-br ${currentLevel.color} text-white shadow-xl shadow-current/20`}>
                        <TrendingUpIcon className="w-10 h-10" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Cấp độ hiện tại</div>
                        <h2 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tight">{currentLevel.id}. {currentLevel.name}</h2>
                        <p className="text-xs text-gray-500 mt-1 font-medium">{currentLevel.description.split('.')[0]}.</p>
                    </div>
                </div>

                <div className="flex-1 flex items-center gap-6 max-w-xl w-full">
                    <div className="text-primary-500 text-3xl font-black opacity-30 animate-pulse">≫</div>
                    <div className="flex-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] block mb-3">Mục tiêu thăng hạng 30 ngày</label>
                        <select
                            value={targetLevelId}
                            onChange={(e) => onSetTarget(parseInt(e.target.value))}
                            className="w-full p-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 rounded-2xl text-sm font-black focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer"
                        >
                            {PYRAMID_LEVELS.slice().reverse().map(level => (
                                <option key={level.id} value={level.id} disabled={level.id < currentLevel.id}>
                                    {level.id === currentLevel.id ? 'Duy trì: ' : 'Thăng hạng: '} {level.id}. {level.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="p-5 bg-primary-50 dark:bg-primary-900/30 rounded-2xl text-primary-600 shadow-inner">
                        <SparklesIcon className="w-10 h-10" />
                    </div>
                </div>
            </div>

            {/* Main Progress Board */}
            <div className="bg-slate-900 p-10 rounded-3xl shadow-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="flex flex-col md:flex-row justify-between items-end relative z-10 gap-8">
                    <div className="flex-1">
                        <div className="inline-block px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-widest mb-4">
                            Lộ trình cá nhân hóa
                        </div>
                        <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter italic">Hành Trình Tỉnh Thức</h2>
                        <p className="text-slate-400 max-w-2xl leading-relaxed font-medium">
                            Nhiệm vụ của bạn đã được Coach Tuấn Dr tái cấu trúc dựa trên mục tiêu thăng hạng lên
                            <span className="text-white font-black mx-1">Tầng {targetLevel.id} - {targetLevel.name}</span>.
                            Mỗi ngày hoàn thành là một viên gạch xây nên sự tự do.
                        </p>
                    </div>
                    <div className="text-right shrink-0">
                        <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-2 font-black">Hoàn thành</div>
                        <div className="text-6xl font-black font-mono text-primary-400">{completedCount}<span className="text-2xl text-slate-700 ml-2">/ 30</span></div>
                    </div>
                </div>

                <div className="mt-12 relative">
                    <div className="w-full bg-slate-800 rounded-full h-4 shadow-inner overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-primary-600 to-teal-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(20,184,166,0.5)]"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-3 text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">
                        <span>Khởi đầu</span>
                        <span className="text-primary-400">{Math.round(progressPercentage)}%</span>
                        <span>Đích đến</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {[1, 2, 3, 4].map(week => (
                    <WeekSection
                        key={week}
                        week={week}
                        title={weekTitles[week - 1]}
                        days={JOURNEY_30_DAYS.filter(t => t.week === week)}
                        progress={progress}
                        onSelectDay={handleOpenTask}
                        firstIncompleteDay={firstIncompleteDay}
                        currentLevelId={currentLevel.id}
                        targetLevelId={targetLevelId}
                    />
                ))}
            </div>

            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md" onClick={() => setSelectedTask(null)}>
                    <div className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all border border-gray-100 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                        <div className="h-3 bg-gradient-to-r from-primary-500 to-teal-500 w-full"></div>

                        <div className="p-8 md:p-12">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-5">
                                    <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 shrink-0">
                                        {React.createElement(PILLAR_ICONS[selectedTask.pillar], { className: "w-8 h-8" })}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày {selectedTask.day}</span>
                                            <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                                {PILLAR_LABELS[selectedTask.pillar]}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">{selectedTask.title}</h3>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedTask(null)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                    <XIcon className="h-8 w-8" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-slate-50 dark:bg-gray-700/50 p-6 rounded-3xl border-l-8 border-primary-500">
                                    <h4 className="text-primary-600 dark:text-primary-400 font-black text-[10px] uppercase tracking-widest mb-3">Mô tả nhiệm vụ</h4>
                                    <p className="text-gray-700 dark:text-gray-300 text-base font-medium leading-relaxed">
                                        {selectedTask.description}
                                    </p>
                                </div>

                                <div className="relative">
                                    <div className="absolute -top-3 left-6 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-full z-10">
                                        Lợi ích thăng hạng
                                    </div>
                                    <div className="p-8 border-2 border-slate-200 dark:border-gray-600 rounded-3xl text-gray-800 dark:text-gray-200 font-black text-xl text-center bg-white dark:bg-gray-800 shadow-sm">
                                        {selectedTask.action}
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-5 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30 italic text-amber-800 dark:text-amber-200 text-sm font-medium leading-relaxed">
                                    <div className="shrink-0 mt-1">💡</div>
                                    "Coach: {selectedTask.coachMessage}"
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Ghi chú hành trình</label>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Cảm xúc hoặc kết quả cụ thể của bạn..."
                                        className="w-full p-5 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-primary-500 rounded-3xl text-sm font-bold dark:text-white transition-all outline-none resize-none"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="mt-12">
                                <button
                                    onClick={handleComplete}
                                    className={`w-full py-5 rounded-3xl font-black text-white text-lg transition-all active:scale-95 flex justify-center items-center shadow-2xl uppercase tracking-[0.2em] ${progress[selectedTask.day]?.completed
                                        ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                                        : 'bg-slate-900 hover:bg-black shadow-slate-900/40'
                                        }`}
                                >
                                    {progress[selectedTask.day]?.completed ? (
                                        <>
                                            <CheckCircleIcon className="h-7 w-7 mr-3" />
                                            Đã ghi nhận
                                        </>
                                    ) : (
                                        <>
                                            <CalendarIcon className="h-7 w-7 mr-3" />
                                            Hoàn thành ngay
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
