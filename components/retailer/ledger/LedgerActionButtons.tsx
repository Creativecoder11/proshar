'use client';

import { Plus, Minus } from 'lucide-react';

interface LedgerActionButtonsProps {
    onAddIncome: () => void;
    onAddExpense: () => void;
}

export default function LedgerActionButtons({
    onAddIncome,
    onAddExpense,
}: LedgerActionButtonsProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <button
                onClick={onAddIncome}
                className="flex items-center justify-center gap-2 py-3.5 px-6 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors"
            >
                <Plus className="w-5 h-5" />
                <span>আয় যোগ করুন</span>
            </button>
            <button
                onClick={onAddExpense}
                className="flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium rounded-xl transition-colors"
            >
                <Minus className="w-5 h-5" />
                <span>ব্যয় যোগ করুন</span>
            </button>
        </div>
    );
}
