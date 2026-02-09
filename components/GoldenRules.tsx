
import React from 'react';
import { GoldenRule } from '../types';
import { CheckCircleIcon, XIcon } from './Icons';

interface GoldenRulesProps {
    rules?: GoldenRule[];
    onToggleRule?: (id: string) => void;
}

export const GoldenRules: React.FC<GoldenRulesProps> = (props) => {
    const rules = props.rules ?? [];
    const onToggleRule = props.onToggleRule ?? (() => { });
    const compliantCount = rules.filter(r => r.isCompliant).length;
    const score = rules.length > 0
        ? Math.round((compliantCount / rules.length) * 100)
        : 0;

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-luxury-gold to-amber-600 p-8 rounded-[2rem] shadow-luxury text-black flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 blur-3xl group-hover:bg-white/30 transition-all"></div>
                <div className="relative z-10 text-center md:text-left">
                    <h3 className="text-3xl font-black italic tracking-tighter">11 Nguyên Tắc Vàng</h3>
                    <p className="font-bold text-black/70 mt-1 uppercase text-[10px] tracking-[0.2em]">Kỷ luật là cầu nối giữa mục tiêu và kết quả.</p>
                </div>
                <div className="text-center bg-black/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-black/5 relative z-10 shadow-inner">
                    <p className="text-[10px] uppercase font-black tracking-[0.3em] opacity-60 mb-1">Điểm tuân thủ</p>
                    <p className="text-4xl font-black font-mono tracking-tighter">{score}%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {rules.map((rule) => (
                    <div
                        key={rule.id}
                        className={`p-6 rounded-[2rem] border transition-all duration-500 hover:border-luxury-gold/50 cursor-pointer shadow-premium relative group
                        ${rule.isCompliant
                                ? 'bg-slate-900/60 border-emerald-500/20'
                                : 'bg-slate-900 opacity-60 border-slate-800'}`}
                        onClick={() => onToggleRule(rule.id)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h4 className={`font-black text-lg tracking-tight ${rule.isCompliant ? 'text-white' : 'text-slate-500'}`}>
                                {rule.title}
                            </h4>
                            <div className="shrink-0 ml-4 group-active:scale-90 transition-transform">
                                {rule.isCompliant ? (
                                    <div className="bg-emerald-500 p-1 rounded-lg shadow-glow">
                                        <CheckCircleIcon className="h-5 w-5 text-white" />
                                    </div>
                                ) : (
                                    <div className="h-7 w-7 rounded-lg border-2 border-slate-800 bg-black/20 group-hover:border-slate-700"></div>
                                )}
                            </div>
                        </div>
                        <p className={`text-sm leading-relaxed font-medium ${rule.isCompliant ? 'text-slate-400' : 'text-slate-600'}`}>
                            {rule.description}
                        </p>
                        <div className="mt-5 flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-black/40 text-slate-500 px-3 py-1.5 rounded-full border border-white/5">
                                Trọng số: {rule.scoreWeight} điểm
                            </span>
                            {rule.isCompliant && (
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                                    <div className="w-1 h-1 rounded-full bg-emerald-400"></div>
                                    ĐÃ ĐẠT
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
