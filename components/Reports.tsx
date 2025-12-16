
import React, { useState, useMemo } from 'react';
import { TRANSACTIONS, CATEGORIES } from '../constants';
import { Transaction, Category } from '../types';
import { ExpensePieChart, TrendLineChart } from './ChartComponents';
import { DownloadIcon, IconMap, CashIcon } from './Icons';

const getCategory = (id: string): Category | undefined => CATEGORIES.find(c => c.id === id);

export const Reports: React.FC = () => {
    const [month, setMonth] = useState<string>('2023-10'); // Default to October 2023
    
    const filteredTransactions = useMemo(() => {
        return TRANSACTIONS.filter(t => t.date.startsWith(month));
    }, [month]);

    const handleExportCSV = () => {
        const headers = ["ID", "Mô tả", "Danh mục", "Số tiền", "Loại", "Ngày", "Phương thức thanh toán"];
        const rows = filteredTransactions.map(t => {
            const category = getCategory(t.categoryId);
            return [t.id, t.description, category?.name, t.amount, t.type, t.date, t.paymentMethod].join(',');
        });
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `bao-cao-giao-dich-${month}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <label htmlFor="month-select" className="font-medium">Chọn tháng:</label>
                    <input 
                        type="month" 
                        id="month-select"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
                <button 
                    onClick={handleExportCSV}
                    className="flex items-center bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                >
                    <DownloadIcon className="h-5 w-5 mr-2" />
                    Xuất CSV
                </button>
            </div>

            {filteredTransactions.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Xu hướng Thu nhập và Chi tiêu</h3>
                            <div className="h-72">
                                <TrendLineChart data={filteredTransactions} />
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Chi tiêu theo Danh mục</h3>
                            <div className="h-72">
                                <ExpensePieChart data={filteredTransactions} categories={CATEGORIES} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                      <h3 className="text-lg font-semibold p-6 text-gray-800 dark:text-white">Chi tiết Giao dịch</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                              <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ngày</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Mô tả</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Danh mục</th>
                                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Số tiền</th>
                              </tr>
                          </thead>
                           <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                               {filteredTransactions.map(t => {
                                   const category = getCategory(t.categoryId);
                                   const IconComponent = (category && IconMap[category.icon]) ? IconMap[category.icon] : CashIcon;
                                   
                                   return (
                                   <tr key={t.id}>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString()}</td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{t.description}</td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center">
                                                <div className="p-1.5 rounded-full mr-3 shrink-0" style={{ backgroundColor: `${category?.color || '#9ca3af'}20` }}>
                                                    <IconComponent className="h-5 w-5" style={{ color: category?.color || '#9ca3af' }} />
                                                </div>
                                                <span>{category?.name || 'Chưa phân loại'}</span>
                                            </div>
                                       </td>
                                       <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                         {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('vi-VN')} ₫
                                       </td>
                                   </tr>
                               )})}
                           </tbody>
                        </table>
                      </div>
                    </div>
                </>
            ) : (
                <div className="text-center bg-white dark:bg-gray-800 p-10 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Không có dữ liệu cho tháng {month}</h3>
                    <p className="text-gray-500 dark:text-gray-400">Không có giao dịch nào được ghi nhận trong tháng đã chọn.</p>
                </div>
            )}
        </div>
    );
};
