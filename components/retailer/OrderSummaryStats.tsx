'use client';

import { Package, Wallet, Award, CreditCard } from 'lucide-react';

interface OrderSummaryStatsProps {
    totalOrders: number;
    totalSaved: number;
    earnPoints: number;
    orderAmount: number;
}

export default function OrderSummaryStats({
    totalOrders,
    totalSaved,
    earnPoints,
    orderAmount,
}: OrderSummaryStatsProps) {
    const stats = [
        {
            icon: Package,
            label: 'Total Orders',
            value: totalOrders.toString().padStart(2, '0'),
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-600',
        },
        {
            icon: Wallet,
            label: 'Total Saved',
            value: `৳ ${totalSaved.toLocaleString()}`,
            iconBg: 'bg-green-50',
            iconColor: 'text-green-600',
        },
        {
            icon: Award,
            label: 'Earn Points',
            value: earnPoints.toString().padStart(2, '0'),
            iconBg: 'bg-orange-50',
            iconColor: 'text-orange-600',
        },
        {
            icon: CreditCard,
            label: 'Order Amount',
            value: `৳ ${orderAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className="bg-white rounded-xl p-4 flex items-center gap-3 border border-gray-100"
                    >
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg}`}
                        >
                            <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
