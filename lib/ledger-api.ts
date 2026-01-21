// Mock data and API functions for Ledger module

import {
    LedgerTransaction,
    LedgerStats,
    WholesalerLedger,
    WholesalerTransaction,
    AddIncomeFormData,
    AddExpenseFormData,
    incomeCategories,
    expenseCategories,
} from '@/types/ledger';
import { mockWholesalers } from './retailer-mock-data';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Ledger Transactions
export const mockLedgerTransactions: LedgerTransaction[] = [
    {
        id: 'txn-001',
        retailerId: 'ret-001',
        type: 'income',
        category: 'daily_sales',
        amount: 12500,
        date: '2025-12-28T10:00:00Z',
        description: 'Cash sales',
        createdAt: '2025-12-28T10:00:00Z',
        updatedAt: '2025-12-28T10:00:00Z',
    },
    {
        id: 'txn-002',
        retailerId: 'ret-001',
        type: 'expense',
        category: 'employee_salary',
        amount: 12500,
        date: '2025-12-28T09:00:00Z',
        description: 'Shop rent for January',
        createdAt: '2025-12-28T09:00:00Z',
        updatedAt: '2025-12-28T09:00:00Z',
    },
    {
        id: 'txn-003',
        retailerId: 'ret-001',
        type: 'expense',
        category: 'digital_payment',
        amount: 12500,
        date: '2025-12-28T08:00:00Z',
        description: 'bKash payment',
        createdAt: '2025-12-28T08:00:00Z',
        updatedAt: '2025-12-28T08:00:00Z',
    },
    {
        id: 'txn-004',
        retailerId: 'ret-001',
        type: 'income',
        category: 'daily_sales',
        amount: 12500,
        date: '2025-12-28T07:00:00Z',
        description: 'Cash sales',
        createdAt: '2025-12-28T07:00:00Z',
        updatedAt: '2025-12-28T07:00:00Z',
    },
    {
        id: 'txn-005',
        retailerId: 'ret-001',
        type: 'expense',
        category: 'supplier_purchase',
        amount: 12500,
        date: '2025-12-28T06:00:00Z',
        description: 'Healthcare Ltd',
        wholesalerId: 'wh-001',
        createdAt: '2025-12-28T06:00:00Z',
        updatedAt: '2025-12-28T06:00:00Z',
    },
    {
        id: 'txn-006',
        retailerId: 'ret-001',
        type: 'expense',
        category: 'supplier_purchase',
        amount: 12500,
        date: '2025-12-28T05:00:00Z',
        description: 'MediDistributors BD',
        wholesalerId: 'wh-002',
        createdAt: '2025-12-28T05:00:00Z',
        updatedAt: '2025-12-28T05:00:00Z',
    },
    {
        id: 'txn-007',
        retailerId: 'ret-001',
        type: 'expense',
        category: 'rent',
        amount: 12500,
        date: '2025-12-28T04:00:00Z',
        description: 'Shop rent for January',
        createdAt: '2025-12-28T04:00:00Z',
        updatedAt: '2025-12-28T04:00:00Z',
    },
    {
        id: 'txn-008',
        retailerId: 'ret-001',
        type: 'income',
        category: 'daily_sales',
        amount: 12500,
        date: '2025-12-28T03:00:00Z',
        description: 'Cash sales',
        createdAt: '2025-12-28T03:00:00Z',
        updatedAt: '2025-12-28T03:00:00Z',
    },
    {
        id: 'txn-009',
        retailerId: 'ret-001',
        type: 'expense',
        category: 'utility_bills',
        amount: 12500,
        date: '2025-12-28T02:00:00Z',
        description: 'Cash sales',
        createdAt: '2025-12-28T02:00:00Z',
        updatedAt: '2025-12-28T02:00:00Z',
    },
    {
        id: 'txn-010',
        retailerId: 'ret-001',
        type: 'income',
        category: 'daily_sales',
        amount: 12500,
        date: '2025-12-28T01:00:00Z',
        description: 'Cash sales',
        createdAt: '2025-12-28T01:00:00Z',
        updatedAt: '2025-12-28T01:00:00Z',
    },
];

// Mock Wholesaler Transactions
export const mockWholesalerTransactions: WholesalerTransaction[] = [
    {
        id: 'wt-001',
        retailerId: 'ret-001',
        wholesalerId: 'wh-001',
        type: 'payment',
        amount: 10000,
        paid: 0,
        due: 10000,
        date: '2025-12-31T10:00:00Z',
        description: 'Payment via bank transfer',
        status: 'credit',
        createdAt: '2025-12-31T10:00:00Z',
    },
    {
        id: 'wt-002',
        retailerId: 'ret-001',
        wholesalerId: 'wh-001',
        type: 'purchase',
        amount: 10000,
        paid: 0,
        due: 10000,
        date: '2025-01-16T10:00:00Z',
        description: 'Medicine stock purchase',
        status: 'debit',
        createdAt: '2025-01-16T10:00:00Z',
    },
    {
        id: 'wt-003',
        retailerId: 'ret-001',
        wholesalerId: 'wh-001',
        type: 'payment',
        amount: 10000,
        paid: 0,
        due: 10000,
        date: '2025-12-31T10:00:00Z',
        description: 'Payment via bank transfer',
        status: 'credit',
        createdAt: '2025-12-31T10:00:00Z',
    },
    {
        id: 'wt-004',
        retailerId: 'ret-001',
        wholesalerId: 'wh-001',
        type: 'purchase',
        amount: 10000,
        paid: 0,
        due: 10000,
        date: '2025-01-16T10:00:00Z',
        description: 'Medicine stock purchase',
        status: 'debit',
        createdAt: '2025-01-16T10:00:00Z',
    },
];

// API Functions

/**
 * GET /api/retailer/ledger/stats
 * Get ledger statistics for a retailer
 */
export async function getLedgerStats(token: string, month?: string): Promise<{ success: boolean; data: LedgerStats }> {
    await delay(500);

    const transactions = mockLedgerTransactions;

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const supplierDue = transactions
        .filter(t => t.category === 'supplier_purchase')
        .reduce((sum, t) => sum + t.amount, 0) * 0.25; // Mock 25% as due

    return {
        success: true,
        data: {
            totalIncome: 126570,
            totalExpense: 68246,
            netBalance: 58324,
            supplierDue: 31500,
        },
    };
}

/**
 * GET /api/retailer/ledger/transactions
 * Get ledger transactions with pagination and filters
 */
export async function getLedgerTransactions(
    token: string,
    options?: {
        page?: number;
        perPage?: number;
        type?: 'income' | 'expense';
        category?: string;
        search?: string;
        sortBy?: string;
    }
): Promise<{ success: boolean; data: { transactions: LedgerTransaction[]; total: number } }> {
    await delay(500);

    let transactions = [...mockLedgerTransactions];

    // Apply type filter
    if (options?.type) {
        transactions = transactions.filter(t => t.type === options.type);
    }

    // Apply category filter
    if (options?.category) {
        transactions = transactions.filter(t => t.category === options.category);
    }

    // Apply search
    if (options?.search) {
        const searchLower = options.search.toLowerCase();
        transactions = transactions.filter(
            t => t.description.toLowerCase().includes(searchLower)
        );
    }

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const total = transactions.length;
    const page = options?.page || 1;
    const perPage = options?.perPage || 10;
    const startIndex = (page - 1) * perPage;
    const paginatedTransactions = transactions.slice(startIndex, startIndex + perPage);

    return {
        success: true,
        data: {
            transactions: paginatedTransactions,
            total,
        },
    };
}

/**
 * POST /api/retailer/ledger/income
 * Add a new income entry
 */
export async function addIncome(
    token: string,
    data: AddIncomeFormData
): Promise<{ success: boolean; data: LedgerTransaction }> {
    await delay(800);

    const category = incomeCategories.find(c => c.id === data.incomeType);

    const newTransaction: LedgerTransaction = {
        id: `txn-${Date.now()}`,
        retailerId: 'ret-001',
        type: 'income',
        category: data.incomeType,
        amount: data.amount,
        date: data.date,
        description: category?.name || 'Income',
        notes: data.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    mockLedgerTransactions.unshift(newTransaction);

    return {
        success: true,
        data: newTransaction,
    };
}

/**
 * POST /api/retailer/ledger/expense
 * Add a new expense entry
 */
export async function addExpense(
    token: string,
    data: AddExpenseFormData
): Promise<{ success: boolean; data: LedgerTransaction }> {
    await delay(800);

    const category = expenseCategories.find(c => c.id === data.expenseType);

    const newTransaction: LedgerTransaction = {
        id: `txn-${Date.now()}`,
        retailerId: 'ret-001',
        type: 'expense',
        category: data.expenseType,
        amount: data.amount,
        date: data.date,
        description: category?.name || 'Expense',
        notes: data.notes,
        wholesalerId: data.wholesalerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    mockLedgerTransactions.unshift(newTransaction);

    return {
        success: true,
        data: newTransaction,
    };
}

/**
 * GET /api/retailer/ledger/wholesalers
 * Get wholesaler ledger list
 */
export async function getWholesalerLedgers(
    token: string
): Promise<{ success: boolean; data: { wholesalers: WholesalerLedger[]; stats: { totalPurchase: number; totalPaid: number; totalDue: number } } }> {
    await delay(600);

    const wholesalers: WholesalerLedger[] = mockWholesalers.map((w, index) => ({
        wholesalerId: w.id,
        wholesalerName: w.name,
        wholesalerDescription: w.description,
        phone: w.phone,
        email: w.email,
        totalPurchase: 18000,
        totalPaid: 10000,
        totalDue: 8000,
        lastTransactionDate: '2025-12-28T10:00:00Z',
        status: 'payment_due' as const,
    }));

    return {
        success: true,
        data: {
            wholesalers,
            stats: {
                totalPurchase: 130000,
                totalPaid: 113000,
                totalDue: 17000,
            },
        },
    };
}

/**
 * GET /api/retailer/ledger/wholesalers/:id
 * Get wholesaler ledger details
 */
export async function getWholesalerLedgerDetails(
    token: string,
    wholesalerId: string
): Promise<{
    success: boolean;
    data: {
        wholesaler: WholesalerLedger;
        transactions: WholesalerTransaction[];
        total: number;
    };
}> {
    await delay(600);

    const wholesaler = mockWholesalers.find(w => w.id === wholesalerId);

    if (!wholesaler) {
        throw new Error('Wholesaler not found');
    }

    const ledger: WholesalerLedger = {
        wholesalerId: wholesaler.id,
        wholesalerName: wholesaler.name,
        wholesalerDescription: wholesaler.description,
        phone: wholesaler.phone,
        email: wholesaler.email,
        totalPurchase: 130000,
        totalPaid: 113000,
        totalDue: 17000,
        lastTransactionDate: '2025-12-28T10:00:00Z',
        status: 'payment_due',
    };

    const transactions = mockWholesalerTransactions.filter(
        t => t.wholesalerId === wholesalerId
    );

    return {
        success: true,
        data: {
            wholesaler: ledger,
            transactions: transactions.length > 0 ? transactions : mockWholesalerTransactions,
            total: transactions.length > 0 ? transactions.length : mockWholesalerTransactions.length,
        },
    };
}

/**
 * POST /api/retailer/ledger/wholesalers/:id/payment
 * Record a payment to wholesaler
 */
export async function recordWholesalerPayment(
    token: string,
    wholesalerId: string,
    amount: number,
    description?: string
): Promise<{ success: boolean; data: WholesalerTransaction }> {
    await delay(800);

    const newTransaction: WholesalerTransaction = {
        id: `wt-${Date.now()}`,
        retailerId: 'ret-001',
        wholesalerId,
        type: 'payment',
        amount,
        paid: amount,
        due: 0,
        date: new Date().toISOString(),
        description: description || 'Payment',
        status: 'credit',
        createdAt: new Date().toISOString(),
    };

    mockWholesalerTransactions.unshift(newTransaction);

    return {
        success: true,
        data: newTransaction,
    };
}
