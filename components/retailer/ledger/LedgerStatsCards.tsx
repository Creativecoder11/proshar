'use client';

import { TrendingUp, TrendingDown, Wallet, CreditCard } from 'lucide-react';

interface LedgerStatsCardsProps {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    supplierDue: number;
}

export default function LedgerStatsCards({
    totalIncome,
    totalExpense,
    netBalance,
    supplierDue,
}: LedgerStatsCardsProps) {
    const stats = [
        {
            icon: TrendingUp,
            iconBg: 'bg-green-50',
            iconColor: 'text-green-500',
            label: 'Total Income',
            value: totalIncome.toLocaleString(),
            subLabel: 'মোট আয়',
            subLabelColor: 'text-green-500',
            borderColor: 'border-l-green-400',
        },
        {
            icon: TrendingDown,
            iconBg: 'bg-red-50',
            iconColor: 'text-red-500',
            label: 'Total Expense',
            value: `৳ ${totalExpense.toLocaleString()}`,
            subLabel: 'মোট ব্যয়',
            subLabelColor: 'text-red-500',
            borderColor: 'border-l-red-400',
        },
        {
            icon: Wallet,
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-500',
            label: 'Net Balance',
            value: `৳ ${netBalance.toLocaleString()}`,
            subLabel: 'নিট ব্যালেন্স',
            subLabelColor: 'text-purple-500',
            borderColor: 'border-l-purple-400',
        },
        {
            icon: CreditCard,
            iconBg: 'bg-orange-50',
            iconColor: 'text-orange-500',
            label: 'Supplier Due',
            value: `৳ ${supplierDue.toLocaleString()}`,
            subLabel: 'সাপ্লায়ার বাকেয়া',
            subLabelColor: 'text-orange-500',
            borderColor: 'border-l-orange-400',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className={`bg-white rounded-xl p-4 border border-gray-100 border-l-4 ${stat.borderColor} hover:shadow-md transition-shadow`}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.iconBg}`}>
                                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>
                            <span className="text-sm text-gray-500">{stat.label}</span>
                        </div>
                        <div className="pl-1">
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className={`text-sm ${stat.subLabelColor}`}>{stat.subLabel}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
