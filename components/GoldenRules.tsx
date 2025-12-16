
import React from 'react';
import { GoldenRule } from '../types';
import { CheckCircleIcon, XIcon } from './Icons';

interface GoldenRulesProps {
    rules: GoldenRule[];
    onToggleRule: (id: string) => void;
}

export const GoldenRules: React.FC<GoldenRulesProps> = ({ rules, onToggleRule }) => {
    const compliantCount = rules.filter(r => r.isCompliant).length;
    const score = Math.round((compliantCount / rules.length) * 100);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-6 rounded-xl shadow-lg text-white flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-bold">11 Nguyên Tắc Vàng</h3>
                    <p className="text-yellow-100">Kỷ luật là cầu nối giữa mục tiêu và kết quả.</p>
                </div>
                <div className="text-center">
                    <p className="text-sm uppercase tracking-widest opacity-80">Điểm tuân thủ</p>
                    <p className="text-4xl font-extrabold">{score}/100</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rules.map((rule) => (
                    <div 
                        key={rule.id} 
                        className={`p-4 rounded-xl border-l-4 shadow-sm transition-all hover:shadow-md cursor-pointer bg-white dark:bg-gray-800 ${rule.isCompliant ? 'border-green-500' : 'border-gray-300 dark:border-gray-600 opacity-80'}`}
                        onClick={() => onToggleRule(rule.id)}
                    >
                        <div className="flex justify-between items-start">
                            <h4 className={`font-bold text-lg ${rule.isCompliant ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{rule.title}</h4>
                            {rule.isCompliant ? (
                                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                            ) : (
                                <div className="h-6 w-6 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{rule.description}</p>
                        <div className="mt-3 flex items-center">
                             <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-500">Trọng số: {rule.scoreWeight}đ</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
