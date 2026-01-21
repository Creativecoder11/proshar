'use client';

import { LucideIcon } from 'lucide-react';

interface OrderStatsCardProps {
    icon: LucideIcon;
    iconBgColor: string;
    iconColor: string;
    label: string;
    value: number | string;
    isActive?: boolean;
    onClick?: () => void;
}

export default function OrderStatsCard({
    icon: Icon,
    iconBgColor,
    iconColor,
    label,
    value,
    isActive,
    onClick,
}: OrderStatsCardProps) {
    return (
        <div
            onClick={onClick}
            className={`
        bg-white rounded-xl p-4 flex items-center gap-4 border transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
        ${isActive ? 'border-[#3A21C0] shadow-md' : 'border-gray-100'}
      `}
        >
            <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgColor}`}
            >
                <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}
