
import React, { useState } from 'react';
import { Asset, Liability } from '../types';
import { PlusIcon, XIcon, ShieldCheckIcon } from './Icons';

interface NetWorthProps {
    assets: Asset[];
    liabilities: Liability[];
    monthlyExpenseAvg: number;
}

export const NetWorth: React.FC<NetWorthProps> = ({ assets, liabilities, monthlyExpenseAvg }) => {
    const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + l.amount, 0);
    const netWorth = totalAssets - totalLiabilities;
    
    // Emergency Fund Calc
    const cashAssets = assets.filter(a => a.type === 'cash' || a.type === 'investment').reduce((sum, a) => sum + a.value, 0);
    const monthsCovered = monthlyExpenseAvg > 0 ? (cashAssets / monthlyExpenseAvg).toFixed(1) : '0';

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Net Worth Summary */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Tài Sản Ròng (Net Worth)</h3>
                    <p className={`text-3xl font-bold ${netWorth >= 0 ? 'text-primary-600' : 'text-red-500'}`}>{netWorth.toLocaleString('vi-VN')} ₫</p>
                    <div className="flex mt-4 space-x-4">
                        <div>
                            <p className="text-xs text-gray-500">Tổng tài sản</p>
                            <p className="text-green-600 font-semibold">+{totalAssets.toLocaleString('vi-VN')} ₫</p>
                        </div>
                         <div>
                            <p className="text-xs text-gray-500">Tổng nợ</p>
                            <p className="text-red-600 font-semibold">-{totalLiabilities.toLocaleString('vi-VN')} ₫</p>
                        </div>
                    </div>
                </div>

                {/* Emergency Fund */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col justify-between">
                     <div className="flex items-start justify-between">
                         <div>
                             <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Quỹ dự phòng</h3>
                             <div className="flex items-baseline">
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{monthsCovered} <span className="text-lg font-normal text-gray-500">tháng</span></p>
                             </div>
                         </div>
                         <ShieldCheckIcon className="h-8 w-8 text-blue-500" />
                     </div>
                     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
                        <div className={`h-2.5 rounded-full ${Number(monthsCovered) >= 6 ? 'bg-green-500' : Number(monthsCovered) >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.min((Number(monthsCovered)/6)*100, 100)}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Mục tiêu: 6 tháng chi tiêu ({ (monthlyExpenseAvg * 6).toLocaleString('vi-VN') } ₫)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 dark:text-white">Tài sản (Assets)</h3>
                        <button className="text-primary-500 text-sm hover:underline">+ Thêm</button>
                    </div>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {assets.map(asset => (
                            <li key={asset.id} className="py-3 flex justify-between">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-white">{asset.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{asset.type === 'real_estate' ? 'Bất động sản' : asset.type === 'vehicle' ? 'Phương tiện' : asset.type === 'investment' ? 'Đầu tư' : 'Tiền mặt'}</p>
                                </div>
                                <span className="font-semibold text-green-600">{asset.value.toLocaleString('vi-VN')} ₫</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 dark:text-white">Nợ (Liabilities)</h3>
                        <button className="text-red-500 text-sm hover:underline">+ Thêm</button>
                    </div>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {liabilities.map(lia => (
                            <li key={lia.id} className="py-3 flex justify-between">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-white">{lia.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{lia.type === 'credit_card' ? 'Thẻ tín dụng' : 'Vay'}</p>
                                </div>
                                <span className="font-semibold text-red-600">{lia.amount.toLocaleString('vi-VN')} ₫</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
