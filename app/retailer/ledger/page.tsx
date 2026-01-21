'use client';

import { useEffect, useState, useCallback } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import Layout from '@/components/retailer/Layout';
import LedgerStatsCards from '@/components/retailer/ledger/LedgerStatsCards';
import LedgerActionButtons from '@/components/retailer/ledger/LedgerActionButtons';
import LedgerQuickActions from '@/components/retailer/ledger/LedgerQuickActions';
import TransactionsTable from '@/components/retailer/ledger/TransactionsTable';
import AddIncomeModal from '@/components/retailer/ledger/AddIncomeModal';
import AddExpenseModal from '@/components/retailer/ledger/AddExpenseModal';
import { useAuthStore } from '@/lib/stores/auth-store';
import {
    getLedgerStats,
    getLedgerTransactions,
    addIncome,
    addExpense,
} from '@/lib/ledger-api';
import { LedgerTransaction, LedgerStats, AddIncomeFormData, AddExpenseFormData } from '@/types/ledger';
import { mockWholesalers } from '@/lib/retailer-mock-data';
import { Loader2 } from 'lucide-react';

export default function LedgerPage() {
    const { token } = useAuthStore();
    const [stats, setStats] = useState<LedgerStats>({
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0,
        supplierDue: 0,
    });
    const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('January 2025');

    // Modal states
    const [showIncomeModal, setShowIncomeModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);

    const perPage = 10;

    const loadStats = useCallback(async () => {
        if (!token) return;

        try {
            const response = await getLedgerStats(token);
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }, [token]);

    const loadTransactions = useCallback(async () => {
        if (!token) return;

        setIsLoading(true);
        try {
            const response = await getLedgerTransactions(token, {
                page: currentPage,
                perPage,
                search: searchQuery,
            });
            if (response.success) {
                setTransactions(response.data.transactions);
                setTotalTransactions(response.data.total);
            }
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setIsLoading(false);
        }
    }, [token, currentPage, searchQuery]);

    useEffect(() => {
        if (token) {
            loadStats();
            loadTransactions();
        }
    }, [token, loadStats, loadTransactions]);

    const handleAddIncome = async (data: AddIncomeFormData) => {
        if (!token) return;

        setIsSubmitting(true);
        try {
            await addIncome(token, data);
            await loadStats();
            await loadTransactions();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddExpense = async (data: AddExpenseFormData) => {
        if (!token) return;

        setIsSubmitting(true);
        try {
            await addExpense(token, data);
            await loadStats();
            await loadTransactions();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Add Income</h1>
                        <p className="text-gray-500 mt-1">Lorem ipsum dolor sit amet</p>
                    </div>

                    {/* Month Selector */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Calendar className="w-4 h-4" />
                        <span>{selectedMonth}</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>

                {/* Stats Cards */}
                <LedgerStatsCards
                    totalIncome={stats.totalIncome}
                    totalExpense={stats.totalExpense}
                    netBalance={stats.netBalance}
                    supplierDue={stats.supplierDue}
                />

                {/* Action Buttons */}
                <LedgerActionButtons
                    onAddIncome={() => setShowIncomeModal(true)}
                    onAddExpense={() => setShowExpenseModal(true)}
                />

                {/* Quick Actions */}
                <LedgerQuickActions />

                {/* Transactions Table */}
                {isLoading && transactions.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[300px]">
                        <Loader2 className="w-8 h-8 animate-spin text-[#3A21C0]" />
                    </div>
                ) : (
                    <TransactionsTable
                        transactions={transactions}
                        total={totalTransactions}
                        currentPage={currentPage}
                        perPage={perPage}
                        onPageChange={handlePageChange}
                        onSearch={handleSearch}
                        isLoading={isLoading}
                    />
                )}

                {/* Add Income Modal */}
                <AddIncomeModal
                    isOpen={showIncomeModal}
                    onClose={() => setShowIncomeModal(false)}
                    onSubmit={handleAddIncome}
                    isLoading={isSubmitting}
                />

                {/* Add Expense Modal */}
                <AddExpenseModal
                    isOpen={showExpenseModal}
                    onClose={() => setShowExpenseModal(false)}
                    onSubmit={handleAddExpense}
                    wholesalers={mockWholesalers.map(w => ({ id: w.id, name: w.name }))}
                    isLoading={isSubmitting}
                />
            </div>
        </Layout>
    );
}
