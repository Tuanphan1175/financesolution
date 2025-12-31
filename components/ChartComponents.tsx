
import React, { useMemo } from 'react';
import { Transaction, Category, TransactionType } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';

interface CategoryPieChartProps {
    data: Transaction[];
    categories: Category[];
    type: TransactionType;
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data, categories, type }) => {
    const chartData = useMemo(() => {
        const filteredData = data.filter(t => t.type === type);
        const groupedData: { [key: string]: number } = filteredData.reduce((acc, curr) => {
            acc[curr.categoryId] = (acc[curr.categoryId] || 0) + curr.amount;
            return acc;
        }, {} as { [key: string]: number });

        return Object.entries(groupedData).map(([categoryId, amount]) => {
            const category = categories.find(c => c.id === categoryId);
            return {
                name: category?.name || 'Không xác định',
                value: amount,
                color: category?.color || '#8884d8'
            };
        }).sort((a, b) => b.value - a.value);
    }, [data, categories, type]);

    if (chartData.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">Không có dữ liệu {type === 'income' ? 'thu nhập' : 'chi tiêu'} để hiển thị.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie 
                    data={chartData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60}
                    outerRadius={80} 
                    paddingAngle={5}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => `${value.toLocaleString('vi-VN')} ₫`} 
                />
                <Legend iconType="circle" />
            </PieChart>
        </ResponsiveContainer>
    );
};

export const ClassificationPieChart: React.FC<{ data: Transaction[] }> = ({ data }) => {
    const chartData = useMemo(() => {
        const expenses = data.filter(t => t.type === 'expense');
        const needs = expenses.filter(t => t.classification === 'need').reduce((s, t) => s + t.amount, 0);
        const wants = expenses.filter(t => t.classification === 'want').reduce((s, t) => s + t.amount, 0);
        
        if (needs === 0 && wants === 0) return [];

        return [
            { name: 'Cần thiết (Need)', value: needs, color: '#10b981' },
            { name: 'Mong muốn (Want)', value: wants, color: '#f43f5e' }
        ];
    }, [data]);

    if (chartData.length === 0) return <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">Không có dữ liệu phân loại.</div>;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toLocaleString('vi-VN')} ₫`} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export const CategoryBarChart: React.FC<CategoryPieChartProps> = ({ data, categories, type }) => {
    const chartData = useMemo(() => {
        const filteredData = data.filter(t => t.type === type);
        const groupedData: { [key: string]: number } = filteredData.reduce((acc, curr) => {
            acc[curr.categoryId] = (acc[curr.categoryId] || 0) + curr.amount;
            return acc;
        }, {} as { [key: string]: number });

        return Object.entries(groupedData).map(([categoryId, amount]) => {
            const category = categories.find(c => c.id === categoryId);
            return {
                name: category?.name || '?',
                amount: amount,
                color: category?.color || '#14b8a6'
            };
        }).sort((a, b) => b.amount - a.amount).slice(0, 8);
    }, [data, categories, type]);

    if (chartData.length === 0) return null;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 30, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(128,128,128,0.1)" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    formatter={(value: number) => `${value.toLocaleString('vi-VN')} ₫`} 
                />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

interface TrendLineChartProps {
    data: Transaction[];
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({ data }) => {
     const chartData = useMemo(() => {
        const groupedByDate: { [key: string]: { income: number; expense: number } } = {};
        
        [...data].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(t => {
            if (!groupedByDate[t.date]) {
                groupedByDate[t.date] = { income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                groupedByDate[t.date].income += t.amount;
            } else {
                groupedByDate[t.date].expense += t.amount;
            }
        });

        return Object.entries(groupedByDate).map(([date, values]) => ({
            date: new Date(date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
            ...values
        }));
    }, [data]);
    
    if (chartData.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">Không có dữ liệu xu hướng để hiển thị.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
                <XAxis dataKey="date" tick={{ fill: '#a0aec0', fontSize: 10 }} />
                <YAxis tick={{ fill: '#a0aec0', fontSize: 10 }} tickFormatter={(value: number) => `${(value/1000000).toFixed(1)}tr`} />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => `${value.toLocaleString('vi-VN')} ₫`} 
                />
                <Legend verticalAlign="top" height={36}/>
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Thu nhập" />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Chi tiêu" />
            </LineChart>
        </ResponsiveContainer>
    );
};
