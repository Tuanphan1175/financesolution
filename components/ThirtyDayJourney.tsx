import React, { useState, useMemo } from 'react';
import { JOURNEY_30_DAYS } from '../constants';
import { JourneyProgress, JourneyTask } from '../types';
import { CheckCircleIcon, LockClosedIcon, CalendarIcon, FlagIcon, XIcon } from './Icons';

interface ThirtyDayJourneyProps {
    progress: JourneyProgress;
    onCompleteDay: (day: number, note?: string) => void;
}

const WeekSection: React.FC<{ 
    week: number; 
    title: string; 
    days: JourneyTask[]; 
    progress: JourneyProgress; 
    onSelectDay: (day: JourneyTask) => void; 
    firstIncompleteDay: number;
}> = ({ week, title, days, progress, onSelectDay, firstIncompleteDay }) => {
    
    const weekColor = [
        'border-teal-500 text-teal-600',
        'border-blue-500 text-blue-600',
        'border-indigo-500 text-indigo-600',
        'border-purple-500 text-purple-600'
    ][week - 1];

    const weekBg = [
        'bg-teal-50 dark:bg-teal-900/20',
        'bg-blue-50 dark:bg-blue-900/20',
        'bg-indigo-50 dark:bg-indigo-900/20',
        'bg-purple-50 dark:bg-purple-900/20'
    ][week - 1];

    return (
        <div className="mb-8">
            <div className={`flex items-center mb-4 ${weekColor}`}>
                <div className={`font-bold text-lg px-3 py-1 border-2 rounded-lg mr-3 uppercase tracking-wider ${weekColor} bg-white dark:bg-gray-800`}>
                    Tuần {week}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {days.map((task) => {
                    const isCompleted = progress[task.day]?.completed;
                    const isLocked = task.day > firstIncompleteDay && !isCompleted;
                    const isCurrent = task.day === firstIncompleteDay;

                    return (
                        <button
                            key={task.day}
                            onClick={() => !isLocked && onSelectDay(task)}
                            disabled={isLocked}
                            className={`
                                relative p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[120px]
                                ${isCompleted 
                                    ? 'bg-green-100 dark:bg-green-900/40 border-2 border-green-500' 
                                    : isLocked 
                                        ? 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 opacity-70 cursor-not-allowed' 
                                        : isCurrent
                                            ? `bg-white dark:bg-gray-700 border-2 ${weekColor.split(' ')[0]} shadow-lg ring-2 ring-offset-2 ring-opacity-50 ring-current transform scale-105 z-10`
                                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md'
                                }
                            `}
                        >
                            {isCompleted && (
                                <div className="absolute top-2 right-2">
                                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                </div>
                            )}
                            {isLocked && (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <LockClosedIcon className="h-8 w-8 text-gray-400" />
                                </div>
                            )}
                            
                            <span className={`text-sm font-bold mb-1 ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>Ngày {task.day}</span>
                            <span className={`text-sm font-semibold line-clamp-2 ${isLocked ? 'text-gray-400 opacity-0' : 'text-gray-800 dark:text-white'}`}>
                                {task.title}
                            </span>
                            
                            {isCurrent && (
                                <span className="absolute -bottom-3 bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm animate-bounce">
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

export const ThirtyDayJourney: React.FC<ThirtyDayJourneyProps> = ({ progress, onCompleteDay }) => {
    const [selectedTask, setSelectedTask] = useState<JourneyTask | null>(null);
    const [note, setNote] = useState('');

    const completedCount = Object.values(progress).filter((p: any) => p.completed).length;
    const progressPercentage = (completedCount / 30) * 100;
    
    // Find first incomplete day to handle locking logic
    const firstIncompleteDay = useMemo(() => {
        for (let i = 1; i <= 30; i++) {
            if (!progress[i]?.completed) return i;
        }
        return 31; // All completed
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

    const weekTitles = ["Nhận diện & Tỉnh thức", "Kỷ luật & Kiểm soát", "Củng cố nền tảng", "Định hình thói quen mới"];

    return (
        <div className="space-y-6">
            {/* Header / Stats */}
            <div className="bg-gradient-to-r from-primary-600 to-teal-500 p-8 rounded-xl shadow-lg text-white">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-3xl font-bold mb-2 flex items-center">
                            <CalendarIcon className="h-8 w-8 mr-3" />
                            Hành Trình 30 Ngày
                        </h2>
                        <p className="opacity-90 max-w-lg">Mỗi ngày một hành động nhỏ để thay đổi hoàn toàn tư duy tài chính của bạn. Không áp lực, chỉ có sự tiến bộ.</p>
                    </div>
                    <div className="text-center bg-white/10 p-4 rounded-lg backdrop-blur-sm min-w-[200px]">
                        <p className="text-sm uppercase tracking-widest opacity-80 mb-1">Tiến độ</p>
                        <p className="text-4xl font-extrabold">{completedCount}/30</p>
                        <p className="text-xs mt-1 opacity-80">Ngày hoàn thành</p>
                    </div>
                </div>
                <div className="w-full bg-black/20 rounded-full h-3 mt-8">
                    <div className="bg-white h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>

            {/* Weeks Grid */}
            <div className="space-y-2">
                {[1, 2, 3, 4].map(week => (
                    <WeekSection 
                        key={week}
                        week={week}
                        title={weekTitles[week-1]}
                        days={JOURNEY_30_DAYS.filter(t => t.week === week)}
                        progress={progress}
                        onSelectDay={handleOpenTask}
                        firstIncompleteDay={firstIncompleteDay}
                    />
                ))}
            </div>

            {/* Task Detail Modal */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTask(null)}>
                    <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
                        <div className="h-3 bg-primary-500 w-full"></div>
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                        Ngày {selectedTask.day} • Tuần {selectedTask.week}
                                    </span>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedTask.title}</h3>
                                </div>
                                <button onClick={() => setSelectedTask(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <XIcon className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                                    <h4 className="text-blue-700 dark:text-blue-300 font-bold text-sm uppercase mb-1">Mô tả</h4>
                                    <p className="text-gray-700 dark:text-gray-300">{selectedTask.description}</p>
                                </div>

                                <div>
                                    <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-2 flex items-center">
                                        <FlagIcon className="h-5 w-5 mr-2 text-primary-500" />
                                        Hành động hôm nay
                                    </h4>
                                    <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 font-medium text-lg text-center bg-gray-50 dark:bg-gray-700/50">
                                        {selectedTask.action}
                                    </div>
                                </div>

                                <div className="italic text-gray-500 dark:text-gray-400 text-sm border-l-2 border-gray-300 pl-4 py-1">
                                    "Coach: {selectedTask.coachMessage}"
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ghi chú cá nhân (Tùy chọn)</label>
                                    <textarea 
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Bạn cảm thấy thế nào sau khi làm điều này?"
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="mt-8">
                                <button 
                                    onClick={handleComplete}
                                    className={`w-full py-3 rounded-lg font-bold text-white text-lg transition-transform active:scale-95 flex justify-center items-center shadow-md ${
                                        progress[selectedTask.day]?.completed 
                                        ? 'bg-green-500 hover:bg-green-600' 
                                        : 'bg-primary-600 hover:bg-primary-700'
                                    }`}
                                >
                                    {progress[selectedTask.day]?.completed ? (
                                        <>
                                            <CheckCircleIcon className="h-6 w-6 mr-2" />
                                            Đã hoàn thành
                                        </>
                                    ) : 'Hoàn thành nhiệm vụ'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};