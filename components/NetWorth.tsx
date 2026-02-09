
import React, { useState, useMemo } from 'react';
import { Asset, Liability, AccountType } from '../types';
import { PlusIcon, XIcon, ShieldCheckIcon, CashIcon, HomeIcon, TrendingUpIcon, BusIcon, CreditCardIcon, FilterIcon } from './Icons';
import { Modal } from './Modal';

interface NetWorthProps {
    assets?: Asset[];
    setAssets?: React.Dispatch<React.SetStateAction<Asset[]>>;
    liabilities?: Liability[];
    setLiabilities?: React.Dispatch<React.SetStateAction<Liability[]>>;
    monthlyExpenseAvg?: number;
    accountFilter?: 'all' | AccountType;
    setAccountFilter?: (val: 'all' | AccountType) => void;
}

export const NetWorth: React.FC<NetWorthProps> = (props) => {
    // Internal state management with localStorage persistence
    const [internalAssets, setInternalAssets] = useState<Asset[]>(() => {
        const saved = localStorage.getItem('smartfinance_assets');
        return saved ? JSON.parse(saved) : [];
    });
    const [internalLiabilities, setInternalLiabilities] = useState<Liability[]>(() => {
        const saved = localStorage.getItem('smartfinance_liabilities');
        return saved ? JSON.parse(saved) : [];
    });
    const [internalAccountFilter, setInternalAccountFilter] = useState<'all' | AccountType>('all');

    // Use props if provided, otherwise use internal state
    const assets = props.assets ?? internalAssets;
    const setAssets = props.setAssets ?? setInternalAssets;
    const liabilities = props.liabilities ?? internalLiabilities;
    const setLiabilities = props.setLiabilities ?? setInternalLiabilities;
    const monthlyExpenseAvg = props.monthlyExpenseAvg ?? 10000000; // Default 10M VND
    const accountFilter = props.accountFilter ?? internalAccountFilter;
    const setAccountFilter = props.setAccountFilter ?? setInternalAccountFilter;

    // Persist internal state to localStorage
    React.useEffect(() => {
        if (!props.assets) {
            localStorage.setItem('smartfinance_assets', JSON.stringify(internalAssets));
        }
    }, [internalAssets, props.assets]);

    React.useEffect(() => {
        if (!props.liabilities) {
            localStorage.setItem('smartfinance_liabilities', JSON.stringify(internalLiabilities));
        }
    }, [internalLiabilities, props.liabilities]);
    const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
    const [isLiabilityModalOpen, setIsLiabilityModalOpen] = useState(false);

    // Form States for Asset
    const [assetName, setAssetName] = useState('');
    const [assetValue, setAssetValue] = useState('');
    const [assetType, setAssetType] = useState<Asset['type']>('cash');
    const [assetAccountType, setAssetAccountType] = useState<AccountType>('personal');

    // Form States for Liability
    const [liaName, setLiaName] = useState('');
    const [liaAmount, setLiaAmount] = useState('');
    const [liaType, setLiaType] = useState<Liability['type']>('loan');
    const [liaAccountType, setLiaAccountType] = useState<AccountType>('personal');

    const filteredAssets = useMemo(() => accountFilter === 'all' ? assets : assets.filter(a => a.accountType === accountFilter), [assets, accountFilter]);
    const filteredLiabilities = useMemo(() => accountFilter === 'all' ? liabilities : liabilities.filter(l => l.accountType === accountFilter), [liabilities, accountFilter]);

    const totalAssets = filteredAssets.reduce((sum, a) => sum + a.value, 0);
    const totalLiabilities = filteredLiabilities.reduce((sum, l) => sum + l.amount, 0);
    const netWorth = totalAssets - totalLiabilities;

    // Emergency Fund Calc (Only for Personal if filtered, or Total)
    const liquidAssets = filteredAssets.filter(a => a.type === 'cash' || a.type === 'investment').reduce((sum, a) => sum + a.value, 0);
    const monthsCovered = monthlyExpenseAvg > 0 ? (liquidAssets / monthlyExpenseAvg).toFixed(1) : '0';

    const handleAddAsset = (e: React.FormEvent) => {
        e.preventDefault();
        if (!assetName || !assetValue) return;
        const newAsset: Asset = {
            id: `asset-${Date.now()}`,
            name: assetName,
            value: parseFloat(assetValue),
            type: assetType,
            accountType: assetAccountType
        };
        setAssets(prev => [...prev, newAsset]);
        setAssetName('');
        setAssetValue('');
        setIsAssetModalOpen(false);
    };

    const handleAddLiability = (e: React.FormEvent) => {
        e.preventDefault();
        if (!liaName || !liaAmount) return;
        const newLia: Liability = {
            id: `lia-${Date.now()}`,
            name: liaName,
            amount: parseFloat(liaAmount),
            type: liaType,
            accountType: liaAccountType
        };
        setLiabilities(prev => [...prev, newLia]);
        setLiaName('');
        setLiaAmount('');
        setIsLiabilityModalOpen(false);
    };

    const deleteAsset = (id: string) => {
        if (window.confirm("Bạn có chắc muốn xóa tài sản này?")) {
            setAssets(prev => prev.filter(a => a.id !== id));
        }
    };

    const deleteLiability = (id: string) => {
        if (window.confirm("Bạn có chắc muốn xóa khoản nợ này?")) {
            setLiabilities(prev => prev.filter(l => l.id !== id));
        }
    };

    return (
        <div className="space-y-12">
            {/* Asset Modal */}
            <Modal isOpen={isAssetModalOpen} onClose={() => setIsAssetModalOpen(false)} title="THÊM TÀI SẢN">
                <form onSubmit={handleAddAsset} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" onClick={() => setAssetAccountType('personal')} className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${assetAccountType === 'personal' ? 'bg-luxury-gold text-black border-luxury-gold shadow-glow' : 'bg-black/40 text-slate-500 border-slate-800'}`}>Ví Cá Nhân</button>
                        <button type="button" onClick={() => setAssetAccountType('business')} className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${assetAccountType === 'business' ? 'bg-primary-500 text-white border-primary-500 shadow-glow' : 'bg-black/40 text-slate-500 border-slate-800'}`}>Ví Kinh Doanh</button>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Tên tài sản</label>
                        <input type="text" value={assetName} onChange={e => setAssetName(e.target.value)} className="w-full bg-black/40 border border-slate-800 text-white rounded-2xl p-4 text-sm font-bold focus:border-luxury-gold outline-none" placeholder="VD: Sổ tiết kiệm, Xe hơi..." required />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Giá trị (₫)</label>
                        <input type="number" value={assetValue} onChange={e => setAssetValue(e.target.value)} className="w-full bg-black/40 border border-slate-800 text-white rounded-2xl p-4 text-lg font-black font-mono focus:border-luxury-gold outline-none" placeholder="0" required />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Phân loại</label>
                        <select value={assetType} onChange={e => setAssetType(e.target.value as any)} className="w-full bg-black/40 border border-slate-800 text-white rounded-2xl p-4 text-sm font-bold focus:border-luxury-gold outline-none">
                            <option value="cash">Tiền mặt / Tiết kiệm</option>
                            <option value="investment">Đầu tư (Chứng khoán/Quỹ)</option>
                            <option value="real_estate">Bất động sản</option>
                            <option value="vehicle">Phương tiện</option>
                            <option value="other">Tài sản khác</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full py-4 bg-luxury-gold text-black text-xs font-black rounded-2xl hover:bg-white transition-all uppercase tracking-widest shadow-luxury">Xác nhận thêm</button>
                </form>
            </Modal>

            {/* Liability Modal */}
            <Modal isOpen={isLiabilityModalOpen} onClose={() => setIsLiabilityModalOpen(false)} title="THÊM KHOẢN NỢ">
                <form onSubmit={handleAddLiability} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" onClick={() => setLiaAccountType('personal')} className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${liaAccountType === 'personal' ? 'bg-luxury-gold text-black border-luxury-gold shadow-glow' : 'bg-black/40 text-slate-500 border-slate-800'}`}>Ví Cá Nhân</button>
                        <button type="button" onClick={() => setLiaAccountType('business')} className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${liaAccountType === 'business' ? 'bg-primary-500 text-white border-primary-500 shadow-glow' : 'bg-black/40 text-slate-500 border-slate-800'}`}>Ví Kinh Doanh</button>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Tên khoản nợ</label>
                        <input type="text" value={liaName} onChange={e => setLiaName(e.target.value)} className="w-full bg-black/40 border border-slate-800 text-white rounded-2xl p-4 text-sm font-bold focus:border-luxury-gold outline-none" placeholder="VD: Vay mua nhà, Thẻ tín dụng..." required />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Số tiền (₫)</label>
                        <input type="number" value={liaAmount} onChange={e => setLiaAmount(e.target.value)} className="w-full bg-black/40 border border-slate-800 text-white rounded-2xl p-4 text-lg font-black font-mono focus:border-luxury-gold outline-none" placeholder="0" required />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Phân loại</label>
                        <select value={liaType} onChange={e => setLiaType(e.target.value as any)} className="w-full bg-black/40 border border-slate-800 text-white rounded-2xl p-4 text-sm font-bold focus:border-luxury-gold outline-none">
                            <option value="loan">Khoản vay cá nhân</option>
                            <option value="credit_card">Thẻ tín dụng</option>
                            <option value="mortgage">Thế chấp / Trả góp</option>
                            <option value="other">Nợ khác</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full py-4 bg-rose-600 text-white text-xs font-black rounded-2xl hover:bg-rose-500 transition-all uppercase tracking-widest shadow-luxury">Xác nhận thêm</button>
                </form>
            </Modal>

            {/* Account Filter Toggle */}
            <div className="flex justify-between items-center bg-slate-900/50 backdrop-blur-md p-5 rounded-[2.5rem] shadow-premium border border-slate-800">
                <span className="text-[11px] font-black uppercase text-luxury-gold tracking-[0.4em] ml-8 hidden md:block italic">Portfolio Wallet</span>
                <div className="flex bg-black/40 p-2 rounded-[1.5rem] w-full md:w-auto border border-slate-800 shadow-inner">
                    {(['all', 'personal', 'business'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setAccountFilter(type)}
                            className={`flex-1 md:flex-none px-10 py-3 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all duration-500 ${accountFilter === type ? 'bg-luxury-gold text-black shadow-glow' : 'text-slate-500 hover:text-white'}`}
                        >
                            {type === 'all' ? 'TỔNG HỢP' : type === 'personal' ? 'CÁ NHÂN' : 'KINH DOANH'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Net Worth Summary Card */}
                <div className="bg-gradient-to-br from-slate-900 to-black p-10 rounded-[3rem] shadow-premium border border-luxury-gold/20 relative overflow-hidden group">
                    <div className="absolute -right-20 -bottom-20 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                        <TrendingUpIcon className="w-80 h-80" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-[12px] font-black text-luxury-gold uppercase mb-6 tracking-[0.3em]">Tài sản ròng {accountFilter === 'all' ? 'TỔNG' : accountFilter.toUpperCase()}</h3>
                        <p className={`text-5xl md:text-6xl font-black tracking-tighter leading-none mb-10 font-mono ${netWorth >= 0 ? 'text-white' : 'text-rose-400'}`}>
                            {netWorth.toLocaleString('vi-VN')} ₫
                        </p>
                        <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/5">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tổng tài sản</p>
                                <p className="text-xl font-black text-emerald-400 font-mono">+{totalAssets.toLocaleString('vi-VN')} ₫</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tổng nợ</p>
                                <p className="text-xl font-black text-rose-400 font-mono">-{totalLiabilities.toLocaleString('vi-VN')} ₫</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Emergency Fund Intelligence */}
                <div className="bg-slate-900/90 p-10 rounded-[3rem] shadow-premium border border-slate-800 flex flex-col justify-between group">
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.3em]">Sức mạnh thanh khoản {accountFilter === 'all' ? 'TỔNG' : accountFilter.toUpperCase()}</h3>
                            <ShieldCheckIcon className="h-10 w-10 text-primary-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex items-baseline mb-6">
                            <p className="text-6xl font-black text-white tracking-tighter font-mono">{monthsCovered}</p>
                            <span className="text-xl font-black text-slate-600 ml-4 uppercase tracking-widest">Tháng</span>
                        </div>
                        <p className="text-xs text-slate-500 font-bold leading-relaxed italic">
                            Dựa trên chi phí TB {monthlyExpenseAvg.toLocaleString('vi-VN')} ₫/tháng.
                        </p>
                    </div>
                    <div className="mt-10">
                        <div className="w-full bg-black/40 rounded-full h-3 border border-slate-800 p-0.5">
                            <div className={`h-full rounded-full transition-all duration-1000 shadow-glow ${Number(monthsCovered) >= 6 ? 'bg-emerald-500' : Number(monthsCovered) >= 3 ? 'bg-luxury-gold' : 'bg-rose-500'}`} style={{ width: `${Math.min((Number(monthsCovered) / 6) * 100, 100)}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Assets List */}
                <div className="bg-slate-900/90 p-10 rounded-[3rem] shadow-premium border border-slate-800">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-[14px] font-black text-white uppercase tracking-[0.3em] flex items-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-4 shadow-glow"></div>
                            Tài sản ({filteredAssets.length})
                        </h3>
                        <button
                            onClick={() => setIsAssetModalOpen(true)}
                            className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-black transition-all"
                        >
                            + Thêm mới
                        </button>
                    </div>
                    <div className="space-y-6">
                        {filteredAssets.length > 0 ? filteredAssets.map(asset => (
                            <div key={asset.id} className="flex items-center justify-between p-5 bg-black/20 rounded-2xl border border-slate-800/50 group hover:border-emerald-500/30 transition-all">
                                <div className="flex items-center">
                                    <div className="p-3 bg-emerald-500/10 rounded-xl mr-5">
                                        {asset.type === 'real_estate' ? <HomeIcon className="w-6 h-6 text-emerald-500" /> : asset.type === 'vehicle' ? <BusIcon className="w-6 h-6 text-emerald-500" /> : asset.type === 'investment' ? <TrendingUpIcon className="w-6 h-6 text-emerald-500" /> : <CashIcon className="w-6 h-6 text-emerald-500" />}
                                    </div>
                                    <div>
                                        <p className="font-black text-white tracking-tight text-base mb-1">{asset.name}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{asset.type}</p>
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${asset.accountType === 'personal' ? 'text-luxury-gold border-luxury-gold/30 bg-luxury-gold/10' : 'text-primary-400 border-primary-500/30 bg-primary-500/10'}`}>{asset.accountType}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="font-black text-emerald-400 font-mono">{asset.value.toLocaleString('vi-VN')} ₫</span>
                                    <button onClick={() => deleteAsset(asset.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-500 transition-all">
                                        <XIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center py-10 text-slate-600 font-black italic uppercase tracking-widest text-xs">Chưa có dữ liệu phù hợp.</p>
                        )}
                    </div>
                </div>

                {/* Liabilities List */}
                <div className="bg-slate-900/90 p-10 rounded-[3rem] shadow-premium border border-slate-800">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-[14px] font-black text-white uppercase tracking-[0.3em] flex items-center">
                            <div className="w-2 h-2 rounded-full bg-rose-500 mr-4 shadow-glow"></div>
                            Nợ ({filteredLiabilities.length})
                        </h3>
                        <button
                            onClick={() => setIsLiabilityModalOpen(true)}
                            className="bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"
                        >
                            + Thêm mới
                        </button>
                    </div>
                    <div className="space-y-6">
                        {filteredLiabilities.length > 0 ? filteredLiabilities.map(lia => (
                            <div key={lia.id} className="flex items-center justify-between p-5 bg-black/20 rounded-2xl border border-slate-800/50 group hover:border-rose-500/30 transition-all">
                                <div className="flex items-center">
                                    <div className="p-3 bg-rose-500/10 rounded-xl mr-5">
                                        <CreditCardIcon className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <div>
                                        <p className="font-black text-white tracking-tight text-base mb-1">{lia.name}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{lia.type}</p>
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${lia.accountType === 'personal' ? 'text-luxury-gold border-luxury-gold/30 bg-luxury-gold/10' : 'text-primary-400 border-primary-500/30 bg-primary-500/10'}`}>{lia.accountType}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="font-black text-rose-400 font-mono">-{lia.amount.toLocaleString('vi-VN')} ₫</span>
                                    <button onClick={() => deleteLiability(lia.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-500 transition-all">
                                        <XIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center py-10 text-slate-600 font-black italic uppercase tracking-widest text-xs">Chưa có dữ liệu phù hợp.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
