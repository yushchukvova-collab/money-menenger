import { useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  categoryName: string;
  description: string;
  date: string;
  goalId?: string; // Optional goal association
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  limit?: number; // Only for expense categories
}

export interface FinanceData {
  initialBalance: number;
  currentBalance: number;
  transactions: Transaction[];
  goals: FinancialGoal[];
  incomeCategories: Category[];
  expenseCategories: Category[];
}

const STORAGE_KEY = 'smf_finance_data';

const getDefaultIncomeCategories = (): Category[] => [
  {
    id: 'salary',
    name: 'Salary',
    icon: 'Wallet',
    color: 'bg-income-salary'
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: 'Briefcase',
    color: 'bg-income-freelance'
  },
  {
    id: 'investment',
    name: 'Investment',
    icon: 'TrendingUp',
    color: 'bg-income-investment'
  },
  {
    id: 'gift',
    name: 'Gift',
    icon: 'Gift',
    color: 'bg-income-gift'
  },
  {
    id: 'other_income',
    name: 'Other',
    icon: 'Plus',
    color: 'bg-income-other'
  }
];

const getDefaultExpenseCategories = (): Category[] => [
  {
    id: 'food',
    name: 'Food',
    limit: 3000,
    icon: 'Coffee',
    color: 'bg-category-food'
  },
  {
    id: 'transport',
    name: 'Transport',
    limit: 1500,
    icon: 'Car',
    color: 'bg-category-transport'
  },
  {
    id: 'housing',
    name: 'Housing',
    limit: 5000,
    icon: 'Home',
    color: 'bg-category-housing'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    limit: 1000,
    icon: 'Gamepad2',
    color: 'bg-category-entertainment'
  },
  {
    id: 'health',
    name: 'Health',
    limit: 800,
    icon: 'Heart',
    color: 'bg-category-health'
  },
  {
    id: 'shopping',
    name: 'Shopping',
    limit: 2000,
    icon: 'ShoppingBag',
    color: 'bg-category-shopping'
  }
];

const getDefaultData = (): FinanceData => ({
  initialBalance: 0,
  currentBalance: 0,
  transactions: [],
  goals: [],
  incomeCategories: getDefaultIncomeCategories(),
  expenseCategories: getDefaultExpenseCategories()
});

export const useFinanceData = () => {
  const [data, setData] = useState<FinanceData>(getDefaultData);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        
        // Migrate old data format
        if (!parsedData.incomeCategories || !parsedData.expenseCategories) {
          // If old format with single categories array
          if (parsedData.categories) {
            parsedData.expenseCategories = parsedData.categories;
            parsedData.incomeCategories = getDefaultIncomeCategories();
            delete parsedData.categories;
          } else {
            parsedData.incomeCategories = getDefaultIncomeCategories();
            parsedData.expenseCategories = getDefaultExpenseCategories();
          }
        }
        
        setData(parsedData);
      } catch (error) {
        // Reset to default if data is corrupted
        setData(getDefaultData());
      }
    }
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [data]);

  // Cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newData = JSON.parse(e.newValue);
          setData(newData);
        } catch (error) {
          console.error('Error syncing data from other tab:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setInitialBalance = (balance: number) => {
    setData(prev => {
      const newBalance = balance + prev.transactions.reduce((sum, t) => 
        sum + (t.type === 'income' ? t.amount : -t.amount), 0
      );
      return {
        ...prev,
        initialBalance: balance,
        currentBalance: newBalance
      };
    });
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    try {
      // Validate amount
      const amount = parseFloat(Number(transaction.amount).toFixed(2));
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid transaction amount');
      }

      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
        amount,
        date: transaction.date || new Date().toISOString(),
      };

      setData(prev => {
        const balanceChange = transaction.type === 'income' ? amount : -amount;
        
        // If transaction is linked to a goal, update the goal amount
        let updatedGoals = prev.goals;
        if (transaction.goalId) {
          updatedGoals = prev.goals.map(goal =>
            goal.id === transaction.goalId
              ? { 
                  ...goal, 
                  currentAmount: parseFloat((
                    transaction.type === 'income' 
                      ? goal.currentAmount + amount
                      : Math.max(0, goal.currentAmount - amount)
                  ).toFixed(2))
                }
              : goal
          );
        }
        
        return {
          ...prev,
          transactions: [newTransaction, ...prev.transactions],
          currentBalance: parseFloat((prev.currentBalance + balanceChange).toFixed(2)),
          goals: updatedGoals
        };
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const clearAllData = () => {
    setData(getDefaultData());
    localStorage.removeItem(STORAGE_KEY);
  };

  const startNewMonth = () => {
    setData(prev => ({
      ...prev,
      transactions: [],
      currentBalance: prev.initialBalance
    }));
  };

  const getMonthlyStats = () => {
    const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const thisMonthTransactions = data.transactions.filter(t => 
      t.date.startsWith(thisMonth)
    );

    const totalIncome = thisMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = thisMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      balance: data.currentBalance,
      savingsRate: Math.max(0, savingsRate)
    };
  };

  const addGoal = (goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    setData(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));
  };

  const updateGoal = (goalId: string, updates: Partial<FinancialGoal>) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(goal =>
        goal.id === goalId ? { ...goal, ...updates } : goal
      )
    }));
  };

  const deleteGoal = (goalId: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== goalId),
      transactions: prev.transactions.map(t => 
        t.goalId === goalId ? { ...t, goalId: undefined } : t
      )
    }));
  };

  const addAmountToGoal = (goalId: string, amount: number) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(goal =>
        goal.id === goalId 
          ? { ...goal, currentAmount: Math.max(0, goal.currentAmount + amount) }
          : goal
      )
    }));
  };

  const addCategory = (category: Omit<Category, 'id'>, type: 'income' | 'expense') => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString()
    };

    setData(prev => ({
      ...prev,
      incomeCategories: type === 'income' 
        ? [...prev.incomeCategories, newCategory]
        : prev.incomeCategories,
      expenseCategories: type === 'expense'
        ? [...prev.expenseCategories, newCategory]
        : prev.expenseCategories
    }));
  };

  const updateCategory = (categoryId: string, updates: Partial<Category>, type: 'income' | 'expense') => {
    setData(prev => ({
      ...prev,
      incomeCategories: type === 'income'
        ? prev.incomeCategories.map(category =>
            category.id === categoryId ? { ...category, ...updates } : category
          )
        : prev.incomeCategories,
      expenseCategories: type === 'expense'
        ? prev.expenseCategories.map(category =>
            category.id === categoryId ? { ...category, ...updates } : category
          )
        : prev.expenseCategories
    }));
  };

  const deleteCategory = (categoryId: string, type: 'income' | 'expense') => {
    setData(prev => ({
      ...prev,
      incomeCategories: type === 'income'
        ? prev.incomeCategories.filter(category => category.id !== categoryId)
        : prev.incomeCategories,
      expenseCategories: type === 'expense'
        ? prev.expenseCategories.filter(category => category.id !== categoryId)
        : prev.expenseCategories
    }));
  };

  const getCategorySpending = (categoryId: string) => {
    const thisMonth = new Date().toISOString().slice(0, 7);
    return data.transactions
      .filter(t => t.type === 'expense' && t.category === categoryId && t.date.startsWith(thisMonth))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return {
    data,
    setInitialBalance,
    addTransaction,
    clearAllData,
    startNewMonth,
    getMonthlyStats,
    addGoal,
    updateGoal,
    deleteGoal,
    addAmountToGoal,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategorySpending
  };
};