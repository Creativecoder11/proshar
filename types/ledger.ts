// TypeScript types for Ledger module

export type TransactionType = 'income' | 'expense';

export type IncomeCategory =
    | 'daily_sales'
    | 'online_sales'
    | 'wholesale_sales'
    | 'other_income';

export type ExpenseCategory =
    | 'supplier_purchase'
    | 'employee_salary'
    | 'rent'
    | 'utility_bills'
    | 'digital_payment'
    | 'transport'
    | 'maintenance'
    | 'other_expense';

export interface LedgerTransaction {
    id: string;
    retailerId: string;
    type: TransactionType;
    category: IncomeCategory | ExpenseCategory;
    amount: number;
    date: string;
    description: string;
    notes?: string;
    wholesalerId?: string; // For supplier purchases
    receiptUrl?: string; // For expense receipts
    createdAt: string;
    updatedAt: string;
}

export interface LedgerStats {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    supplierDue: number;
}

export interface WholesalerLedger {
    wholesalerId: string;
    wholesalerName: string;
    wholesalerDescription?: string;
    phone?: string;
    email?: string;
    totalPurchase: number;
    totalPaid: number;
    totalDue: number;
    lastTransactionDate?: string;
    status: 'paid' | 'payment_due' | 'overdue';
}

export interface WholesalerTransaction {
    id: string;
    retailerId: string;
    wholesalerId: string;
    type: 'purchase' | 'payment';
    amount: number;
    paid: number;
    due: number;
    date: string;
    description: string;
    status: 'credit' | 'debit';
    createdAt: string;
}

export interface AddIncomeFormData {
    incomeType: IncomeCategory;
    amount: number;
    date: string;
    notes?: string;
}

export interface AddExpenseFormData {
    expenseType: ExpenseCategory;
    wholesalerId?: string;
    amount: number;
    date: string;
    notes?: string;
    receiptFile?: File;
}

export interface LedgerCategory {
    id: string;
    name: string;
    nameBn: string; // Bengali name
    type: TransactionType;
    icon?: string;
}

// Category display configuration
export const incomeCategories: LedgerCategory[] = [
    { id: 'daily_sales', name: 'Daily Sales', nameBn: 'দৈনিক বিক্রি', type: 'income' },
    { id: 'online_sales', name: 'Online Sales', nameBn: 'অনলাইন বিক্রি', type: 'income' },
    { id: 'wholesale_sales', name: 'Wholesale Sales', nameBn: 'পাইকারি বিক্রি', type: 'income' },
    { id: 'other_income', name: 'Other Income', nameBn: 'অন্যান্য আয়', type: 'income' },
];

export const expenseCategories: LedgerCategory[] = [
    { id: 'supplier_purchase', name: 'Supplier Purchase', nameBn: 'সাপ্লায়ার থেকে কেনাকাটা', type: 'expense' },
    { id: 'employee_salary', name: 'Employee Salary', nameBn: 'কর্মচারী বেতন', type: 'expense' },
    { id: 'rent', name: 'Rent', nameBn: 'ভাড়া', type: 'expense' },
    { id: 'utility_bills', name: 'Utility Bills', nameBn: 'ইউটিলিটি বিল', type: 'expense' },
    { id: 'digital_payment', name: 'Digital Payment', nameBn: 'ডিজিটাল পেমেন্ট', type: 'expense' },
    { id: 'transport', name: 'Transport', nameBn: 'পরিবহন', type: 'expense' },
    { id: 'maintenance', name: 'Maintenance', nameBn: 'রক্ষণাবেক্ষণ', type: 'expense' },
    { id: 'other_expense', name: 'Other Expense', nameBn: 'অন্যান্য খরচ', type: 'expense' },
];

// Category badge colors
export const categoryColors: Record<string, { bg: string; text: string }> = {
    daily_sales: { bg: 'bg-green-100', text: 'text-green-600' },
    online_sales: { bg: 'bg-blue-100', text: 'text-blue-600' },
    wholesale_sales: { bg: 'bg-purple-100', text: 'text-purple-600' },
    other_income: { bg: 'bg-gray-100', text: 'text-gray-600' },
    supplier_purchase: { bg: 'bg-red-100', text: 'text-red-600' },
    employee_salary: { bg: 'bg-orange-100', text: 'text-orange-600' },
    rent: { bg: 'bg-pink-100', text: 'text-pink-600' },
    utility_bills: { bg: 'bg-cyan-100', text: 'text-cyan-600' },
    digital_payment: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    transport: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    maintenance: { bg: 'bg-teal-100', text: 'text-teal-600' },
    other_expense: { bg: 'bg-gray-100', text: 'text-gray-600' },
};
