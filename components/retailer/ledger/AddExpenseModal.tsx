'use client';

import { useState } from 'react';
import { X, TrendingDown, Calendar, Plus, Upload } from 'lucide-react';
import { expenseCategories, AddExpenseFormData } from '@/types/ledger';

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AddExpenseFormData) => Promise<void>;
    wholesalers: { id: string; name: string }[];
    isLoading?: boolean;
}

export default function AddExpenseModal({
    isOpen,
    onClose,
    onSubmit,
    wholesalers,
    isLoading,
}: AddExpenseModalProps) {
    const [formData, setFormData] = useState<AddExpenseFormData>({
        expenseType: 'supplier_purchase',
        wholesalerId: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        notes: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof AddExpenseFormData, string>>>({});
    const [receiptFile, setReceiptFile] = useState<File | null>(null);

    const validate = () => {
        const newErrors: Partial<Record<keyof AddExpenseFormData, string>> = {};

        if (!formData.expenseType) {
            newErrors.expenseType = 'Please select an expense type';
        }
        if (formData.expenseType === 'supplier_purchase' && !formData.wholesalerId) {
            newErrors.wholesalerId = 'Please select a wholesaler';
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
            await onSubmit({ ...formData, receiptFile: receiptFile || undefined });
            // Reset form
            setFormData({
                expenseType: 'supplier_purchase',
                wholesalerId: '',
                amount: 0,
                date: new Date().toISOString().split('T')[0],
                notes: '',
            });
            setReceiptFile(null);
            onClose();
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setReceiptFile(e.target.files[0]);
        }
    };

    const showWholesalerField = formData.expenseType === 'supplier_purchase';

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
                        <h2 className="text-xl font-bold text-gray-900">Add Expense</h2>
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

                {/* Red Header Banner */}
                <div className="mx-5 mt-5 bg-gradient-to-r from-red-400 to-red-500 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <TrendingDown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">New Expense</h3>
                        <p className="text-white/80 text-sm">ব্যয় যোগ করুন</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {/* Expense Type */}
                    <div>
                        <label className="block text-sm font-medium text-red-500 mb-2">
                            Expense Type<span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.expenseType}
                            onChange={(e) => setFormData({ ...formData, expenseType: e.target.value as any })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                        >
                            {expenseCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name} ({category.nameBn})
                                </option>
                            ))}
                        </select>
                        {errors.expenseType && (
                            <p className="text-red-500 text-sm mt-1">{errors.expenseType}</p>
                        )}
                    </div>

                    {/* Wholesaler (only for supplier purchase) */}
                    {showWholesalerField && (
                        <div>
                            <label className="block text-sm font-medium text-red-500 mb-2">
                                Select Wholesaler<span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.wholesalerId}
                                onChange={(e) => setFormData({ ...formData, wholesalerId: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                            >
                                <option value="">Select a wholesaler</option>
                                {wholesalers.map((wholesaler) => (
                                    <option key={wholesaler.id} value={wholesaler.id}>
                                        {wholesaler.name}
                                    </option>
                                ))}
                            </select>
                            {errors.wholesalerId && (
                                <p className="text-red-500 text-sm mt-1">{errors.wholesalerId}</p>
                            )}
                        </div>
                    )}

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-red-500 mb-2">
                            Amount (৳)<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
                            <input
                                type="number"
                                value={formData.amount || ''}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                placeholder="0.00"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                            />
                        </div>
                        {errors.amount && (
                            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                        )}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-red-500 mb-2">
                            Date<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
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
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Upload Receipt */}
                    <div>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-gray-300 transition-colors">
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="receipt-upload"
                            />
                            <label htmlFor="receipt-upload" className="cursor-pointer">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm">
                                    <span className="text-red-500 font-medium">Click Here</span>
                                    <span className="text-gray-600"> Upload Receipt</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Supported Format: JPG, JPEG, PNG, PDF (Max file size 2 mb)
                                </p>
                                {receiptFile && (
                                    <p className="text-sm text-green-600 mt-2">
                                        Selected: {receiptFile.name}
                                    </p>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-6 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-3 px-6 bg-[#3A21C0] text-white font-medium rounded-xl hover:bg-[#2d1a99] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Saving...' : 'Save Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
