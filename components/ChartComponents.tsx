import React, { useMemo } from 'react';
import { Transaction, Category } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ExpensePieChartProps {
    data: Transaction[];
    categories: Category[];
}

export const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ data, categories }) => {
    const chartData = useMemo(() => {
        const expenseData = data.filter(t => t.type === 'expense');
        const groupedData: { [key: string]: number } = expenseData.reduce((acc, curr) => {
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
        });
    }, [data, categories]);

    if (chartData.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">Không có dữ liệu chi tiêu để hiển thị.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                    {chartData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toLocaleString('vi-VN')} ₫`} />
                <Legend iconSize={10} />
            </PieChart>
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
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                <XAxis dataKey="date" tick={{ fill: '#a0aec0' }} />
                <YAxis tick={{ fill: '#a0aec0' }} tickFormatter={(value: number) => `${value/1000000}tr`} />
                <Tooltip formatter={(value: number) => `${value.toLocaleString('vi-VN')} ₫`} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Thu nhập" />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Chi tiêu" />
            </LineChart>
        </ResponsiveContainer>
    );
};
