'use client';

import { useState } from 'react';
import { Search, ChevronDown, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { LedgerTransaction, categoryColors, incomeCategories, expenseCategories } from '@/types/ledger';

interface TransactionsTableProps {
    transactions: LedgerTransaction[];
    total: number;
    currentPage: number;
    perPage: number;
    onPageChange: (page: number) => void;
    onSearch: (query: string) => void;
    isLoading?: boolean;
}

export default function TransactionsTable({
    transactions,
    total,
    currentPage,
    perPage,
    onPageChange,
    onSearch,
    isLoading,
}: TransactionsTableProps) {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('date');

    const totalPages = Math.ceil(total / perPage);

    const handleSearch = (value: string) => {
        setSearch(value);
        onSearch(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        });
    };

    const getCategoryLabel = (category: string) => {
        const incomeCategory = incomeCategories.find(c => c.id === category);
        if (incomeCategory) return incomeCategory.name;

        const expenseCategory = expenseCategories.find(c => c.id === category);
        if (expenseCategory) return expenseCategory.name;

        return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getCategoryColors = (category: string) => {
        return categoryColors[category] || { bg: 'bg-gray-100', text: 'text-gray-600' };
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
                        <p className="text-sm text-gray-500">{total} Entries</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search Transactions..."
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3A21C0] focus:border-transparent w-full md:w-64"
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                                <span>By Status</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                                    Loading transactions...
                                </td>
                            </tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                                    No transactions found
                                </td>
                            </tr>
                        ) : (
                            transactions.map((transaction) => {
                                const colors = getCategoryColors(transaction.category);
                                const isIncome = transaction.type === 'income';

                                return (
                                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-50' : 'bg-red-50'}`}>
                                                {isIncome ? (
                                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <TrendingDown className="w-5 h-5 text-red-500" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{getCategoryLabel(transaction.category)}</p>
                                                <p className="text-sm text-gray-500">{transaction.description}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                                                {getCategoryLabel(transaction.category).split(' ')[0]}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {formatDate(transaction.date)}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <span className={`font-semibold ${isIncome ? 'text-green-600' : 'text-gray-900'}`}>
                                                {isIncome ? '+' : ''} ৳ {transaction.amount.toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Showing {Math.min((currentPage - 1) * perPage + 1, total)} of {total} transactions
                </p>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }

                        if (pageNum < 1 || pageNum > totalPages) return null;

                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                        ? 'bg-[#3A21C0] text-white'
                                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                            <span className="px-2 text-gray-400">...</span>
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="w-9 h-9 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
