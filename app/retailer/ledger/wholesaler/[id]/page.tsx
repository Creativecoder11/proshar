'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Users,
    User,
    Phone,
    Mail,
    Wallet,
    Check,
    FileText,
    Edit,
} from 'lucide-react';
import Layout from '@/components/retailer/Layout';
import { useAuthStore } from '@/lib/stores/auth-store';
import { getWholesalerLedgerDetails } from '@/lib/ledger-api';
import { WholesalerLedger, WholesalerTransaction } from '@/types/ledger';
import { Loader2 } from 'lucide-react';

export default function WholesalerLedgerDetailsPage() {
    const params = useParams();
    const { token } = useAuthStore();
    const [wholesaler, setWholesaler] = useState<WholesalerLedger | null>(null);
    const [transactions, setTransactions] = useState<WholesalerTransaction[]>([]);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const wholesalerId = params.id as string;
    const perPage = 10;

    const loadData = useCallback(async () => {
        if (!token || !wholesalerId) return;

        setIsLoading(true);
        try {
            const response = await getWholesalerLedgerDetails(token, wholesalerId);
            if (response.success) {
                setWholesaler(response.data.wholesaler);
                setTransactions(response.data.transactions);
                setTotalTransactions(response.data.total);
            }
        } catch (error) {
            console.error('Error loading wholesaler details:', error);
        } finally {
            setIsLoading(false);
        }
    }, [token, wholesalerId]);

    useEffect(() => {
        if (token && wholesalerId) {
            loadData();
        }
    }, [token, wholesalerId, loadData]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit',
        });
    };

    const totalPages = Math.ceil(totalTransactions / perPage);

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#3A21C0]" />
                </div>
            </Layout>
        );
    }

    if (!wholesaler) {
        return (
            <Layout>
                <div className="space-y-4">
                    <Link
                        href="/retailer/ledger/wholesaler"
                        className="inline-flex items-center gap-2 text-[#3A21C0] hover:text-[#2d1a99] font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Wholesaler Ledger
                    </Link>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-red-800">Wholesaler not found</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header Card */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center">
                                <FileText className="w-7 h-7 text-cyan-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    {wholesaler.wholesalerName}
                                </h1>
                                <p className="text-gray-500">{wholesaler.wholesalerDescription}</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            <Edit className="w-4 h-4" />
                            Edit Wholesaler
                        </button>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-sm text-gray-500 mb-1">Wholesaler Name</p>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-600" />
                                <span className="font-medium text-gray-900">Kawsar Ahmed</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-sm text-gray-500 mb-1">Phone No</p>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-600" />
                                <span className="font-medium text-gray-900">+880123456789</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-sm text-gray-500 mb-1">Email Address</p>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-600" />
                                <span className="font-medium text-gray-900">kawsarahmed@gmail.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Wallet className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Paid</p>
                                    <p className="text-xl font-bold text-gray-900">
                                        ৳ {wholesaler.totalPaid.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Wallet className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Paid</p>
                                    <p className="text-xl font-bold text-gray-900">
                                        ৳ {wholesaler.totalPaid.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Wallet className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Paid</p>
                                    <p className="text-xl font-bold text-gray-900">
                                        ৳ {wholesaler.totalPaid.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pay Due Button */}
                    <div className="flex justify-end">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-400 to-red-400 text-white text-sm font-medium rounded-xl hover:from-orange-500 hover:to-red-500 transition-colors">
                            <Wallet className="w-4 h-4" />
                            Pay Due (বাকেয়া পরিশোধ করুন)
                        </button>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-5 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
                                <p className="text-sm text-gray-500">{totalTransactions} Entries</p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search Transactions..."
                                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3A21C0] focus:border-transparent w-full md:w-64"
                                    />
                                </div>

                                {/* Sort Dropdown */}
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                                    <span>By Status</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Transaction
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Paid
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Due
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center ${transaction.type === 'payment'
                                                        ? 'bg-green-100'
                                                        : 'bg-red-100'
                                                    }`}
                                            >
                                                {transaction.type === 'payment' ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <FileText className="w-4 h-4 text-red-600" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 font-medium text-gray-900 capitalize">
                                            {transaction.type}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <span className="text-gray-400">📅</span>
                                                {formatDate(transaction.date)}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">{transaction.description}</td>
                                        <td className="px-5 py-4">
                                            <span className="text-red-600 font-medium">
                                                - {transaction.amount.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-900">৳ 00.00</td>
                                        <td className="px-5 py-4">
                                            <span className="text-orange-500 font-medium">
                                                {transaction.due.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${transaction.status === 'credit'
                                                        ? 'bg-green-50 text-green-600'
                                                        : 'bg-red-50 text-red-600'
                                                    }`}
                                            >
                                                {transaction.status === 'credit' ? 'Credit' : 'Debit'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing 10 of {totalTransactions} transactions
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {[1, 2].map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                            ? 'bg-[#3A21C0] text-white'
                                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <span className="px-2 text-gray-400">...</span>

                            <button className="w-9 h-9 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                                5
                            </button>

                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
