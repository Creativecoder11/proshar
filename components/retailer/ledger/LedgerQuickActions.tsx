'use client';

import Link from 'next/link';
import { Users, TrendingUp, FileText } from 'lucide-react';

export default function LedgerQuickActions() {
    const actions = [
        {
            href: '/retailer/ledger/wholesaler',
            icon: Users,
            title: 'Wholesaler Ledger',
            subtitle: 'পাইকারী বিক্রেতার হিসাব',
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-600',
        },
        {
            href: '/retailer/ledger/daily-sales',
            icon: TrendingUp,
            title: 'Daily Sales',
            subtitle: 'দৈনিক বেচাকেনা',
            iconBg: 'bg-green-50',
            iconColor: 'text-green-600',
        },
        {
            href: '/retailer/ledger/reports',
            icon: FileText,
            title: 'Monthly Reports',
            subtitle: 'মাসিক রিপোর্ট',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                    <Link key={index} href={action.href}>
                        <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.iconBg}`}>
                                <Icon className={`w-6 h-6 ${action.iconColor}`} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{action.title}</h3>
                                <p className="text-sm text-gray-500">{action.subtitle}</p>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
