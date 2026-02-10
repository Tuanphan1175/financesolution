
import React from 'react';
import { GoldenRule } from '../types';
import { CheckCircleIcon, XIcon } from './Icons';
import { FIN_PLAYBOOK } from '../knowledge/financialPlaybook';

interface GoldenRulesProps {
    rules?: GoldenRule[];
    onToggleRule?: (id: string) => void;
}

const DEFAULT_RULES: GoldenRule[] = FIN_PLAYBOOK.principles.map(p => ({
    id: p.id.toString(),
    name: p.title,
    title: p.title,
    description: p.description,
    content: p.actionableTip,
    isCompliant: false,
    scoreWeight: 9
}));

// Basic modal for rule details
const RuleDetailModal = ({ rule, onClose }: { rule: GoldenRule; onClose: () => void }) => {
    if (!rule) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-luxury-obsidian border border-luxury-gold/20 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                    <XIcon className="w-6 h-6" />
                </button>

                <h3 className="text-2xl font-black text-luxury-gold mb-2 pr-10">{rule.name || rule.title}</h3>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Chi tiết nguyên tắc</p>

                <div className="prose prose-invert prose-lg max-w-none">
                    <p className="font-medium text-white/90 text-lg leading-relaxed mb-6 border-l-4 border-luxury-gold pl-4 py-1 bg-white/5 rounded-r-lg">
                        {rule.description}
                    </p>

                    {rule.content ? (
                        <div className="whitespace-pre-wrap text-slate-300 space-y-4 leading-relaxed">
                            {rule.content}
                        </div>
                    ) : (
                        <p className="text-slate-500 italic text-center py-8">Chưa có nội dung chi tiết cho nguyên tắc này.</p>
                    )}
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-xl transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export const GoldenRules: React.FC<GoldenRulesProps> = (props) => {
    const [localRules, setLocalRules] = React.useState<GoldenRule[]>(() => {
        // Load from localStorage or use default
        const saved = localStorage.getItem('smartfinance_golden_rules');
        const initial = props.rules && props.rules.length > 0 ? props.rules : (saved ? JSON.parse(saved) : DEFAULT_RULES);
        return Array.isArray(initial) ? initial : DEFAULT_RULES;
    });

    const [selectedRule, setSelectedRule] = React.useState<GoldenRule | null>(null);

    React.useEffect(() => {
        localStorage.setItem('smartfinance_golden_rules', JSON.stringify(localRules));
    }, [localRules]);

    const handleToggle = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setLocalRules(prev => prev.map(r =>
            r.id === id ? { ...r, isCompliant: !r.isCompliant } : r
        ));
        if (props.onToggleRule) props.onToggleRule(id);
    };

    const rules = localRules;
    const compliantCount = rules.filter(r => r.isCompliant).length;
    const score = rules.length > 0
        ? Math.round((compliantCount / rules.length) * 100)
        : 0;

    return (
        <div className="space-y-8 pb-20">
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
                        onClick={() => setSelectedRule(rule)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h4 className={`font-black text-lg tracking-tight ${rule.isCompliant ? 'text-white' : 'text-slate-500'}`}>
                                {rule.name || rule.title}
                            </h4>
                            <div
                                className="shrink-0 ml-4 group-active:scale-90 transition-transform cursor-pointer p-1 -m-1"
                                onClick={(e) => handleToggle(rule.id, e)}
                            >
                                {rule.isCompliant ? (
                                    <div className="bg-emerald-500 p-1 rounded-lg shadow-glow">
                                        <CheckCircleIcon className="h-5 w-5 text-white" />
                                    </div>
                                ) : (
                                    <div className="h-7 w-7 rounded-lg border-2 border-slate-800 bg-black/20 hover:border-luxury-gold transition-colors"></div>
                                )}
                            </div>
                        </div>
                        <p className={`text-sm leading-relaxed font-medium line-clamp-3 ${rule.isCompliant ? 'text-slate-400' : 'text-slate-600'}`}>
                            {rule.description}
                        </p>
                        <div className="mt-5 flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-black/40 text-slate-500 px-3 py-1.5 rounded-full border border-white/5">
                                Trọng số: {rule.scoreWeight} điểm
                            </span>
                            {rule.content && (
                                <span className="text-[10px] font-bold text-luxury-gold underline decoration-luxury-gold/30 hover:text-white transition-colors">
                                    Xem chi tiết
                                </span>
                            )}
                            {!rule.content && rule.isCompliant && (
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                                    <div className="w-1 h-1 rounded-full bg-emerald-400"></div>
                                    ĐÃ ĐẠT
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {selectedRule && (
                <RuleDetailModal
                    rule={selectedRule}
                    onClose={() => setSelectedRule(null)}
                />
            )}
        </div>
    );
};
