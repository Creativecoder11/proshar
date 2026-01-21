'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface DeliverySubFiltersProps {
    deliveryType: 'all' | 'full' | 'partial';
    selectedMonth: string;
    onDeliveryTypeChange: (type: 'all' | 'full' | 'partial') => void;
    onMonthChange: (month: string) => void;
}

export default function DeliverySubFilters({
    deliveryType,
    selectedMonth,
    onDeliveryTypeChange,
    onMonthChange,
}: DeliverySubFiltersProps) {
    const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

    const months = [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ];

    const currentYear = new Date().getFullYear().toString().slice(-2);

    return (
        <div className="flex items-center gap-4 py-3">
            {/* Delivery Type Filters */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onDeliveryTypeChange('full')}
                    className={`
            px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-l-lg border
            ${deliveryType === 'full'
                            ? 'bg-white text-[#3A21C0] border-[#3A21C0]'
                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                        }
          `}
                >
                    Full Delivered
                </button>
                <button
                    onClick={() => onDeliveryTypeChange('partial')}
                    className={`
            px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-r-lg border border-l-0
            ${deliveryType === 'partial'
                            ? 'bg-white text-[#3A21C0] border-[#3A21C0]'
                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                        }
          `}
                >
                    Partial Delivered
                </button>
            </div>

            {/* Month Picker */}
            <div className="relative">
                <button
                    onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <span>{selectedMonth}.{currentYear}</span>
                    <ChevronDown className="w-4 h-4" />
                </button>

                {isMonthPickerOpen && (
                    <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2 grid grid-cols-4 gap-1 min-w-[200px]">
                        {months.map((month) => (
                            <button
                                key={month}
                                onClick={() => {
                                    onMonthChange(month);
                                    setIsMonthPickerOpen(false);
                                }}
                                className={`
                  px-2 py-1.5 text-xs font-medium rounded transition-colors
                  ${selectedMonth === month
                                        ? 'bg-[#3A21C0] text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }
                `}
                            >
                                {month}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
