'use client';

import { useState } from 'react';
import { X, TrendingUp, Calendar, Plus } from 'lucide-react';
import { incomeCategories, AddIncomeFormData } from '@/types/ledger';

interface AddIncomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AddIncomeFormData) => Promise<void>;
    isLoading?: boolean;
}

export default function AddIncomeModal({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
}: AddIncomeModalProps) {
    const [formData, setFormData] = useState<AddIncomeFormData>({
        incomeType: 'daily_sales',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        notes: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof AddIncomeFormData, string>>>({});

    const validate = () => {
        const newErrors: Partial<Record<keyof AddIncomeFormData, string>> = {};

        if (!formData.incomeType) {
            newErrors.incomeType = 'Please select an income type';
        }
        if (!formData.amount || formData.amount <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }
        if (!formData.date) {
            newErrors.date = 'Please select a date';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await onSubmit(formData);
            // Reset form
            setFormData({
                incomeType: 'daily_sales',
                amount: 0,
                date: new Date().toISOString().split('T')[0],
                notes: '',
            });
            onClose();
        } catch (error) {
            console.error('Error adding income:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Add Income</h2>
                        <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1.5 text-[#3A21C0] text-sm font-medium hover:text-[#2d1a99] transition-colors">
                            <Plus className="w-4 h-4" />
                            Add Category
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Green Header Banner */}
                <div className="mx-5 mt-5 bg-green-500 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">New Income</h3>
                        <p className="text-white/80 text-sm">আয় যোগ করুন</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {/* Income Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Income Type<span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.incomeType}
                            onChange={(e) => setFormData({ ...formData, incomeType: e.target.value as any })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A21C0] focus:border-transparent transition-all"
                        >
                            {incomeCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name} ({category.nameBn})
                                </option>
                            ))}
                        </select>
                        {errors.incomeType && (
                            <p className="text-red-500 text-sm mt-1">{errors.incomeType}</p>
                        )}
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount (৳)<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
                            <input
                                type="number"
                                value={formData.amount || ''}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                placeholder="0.00"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A21C0] focus:border-transparent transition-all"
                            />
                        </div>
                        {errors.amount && (
                            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                        )}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A21C0] focus:border-transparent transition-all"
                            />
                        </div>
                        {errors.date && (
                            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={formData.notes || ''}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Add any additional notes... / অতিরিক্ত নোট যোগ করুন..."
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A21C0] focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-6 bg-green-50 text-green-600 font-medium rounded-xl hover:bg-green-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-3 px-6 bg-[#3A21C0] text-white font-medium rounded-xl hover:bg-[#2d1a99] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Saving...' : 'Save Income'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
