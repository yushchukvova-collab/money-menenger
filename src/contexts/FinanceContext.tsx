// FIX: Створений контекст фінансових даних для централізованого управління
import React, { createContext, useContext, ReactNode } from 'react';
import { 
  useFinanceData,
  Transaction, 
  Category, 
  FinancialGoal, 
  FinanceData 
} from '@/hooks/useFinanceData';

// Експортуємо типи для використання в інших компонентах
export type { Transaction, Category, FinancialGoal, FinanceData };

interface FinanceContextType {
  data: FinanceData;
  setInitialBalance: (balance: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  clearAllData: () => void;
  startNewMonth: () => void;
  getMonthlyStats: () => {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    savingsRate: number;
  };
  addGoal: (goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => void;
  updateGoal: (goalId: string, updates: Partial<FinancialGoal>) => void;
  deleteGoal: (goalId: string) => void;
  addAmountToGoal: (goalId: string, amount: number) => void;
  addCategory: (category: Omit<Category, 'id'>, type: 'income' | 'expense') => void;
  updateCategory: (categoryId: string, updates: Partial<Category>, type: 'income' | 'expense') => void;
  deleteCategory: (categoryId: string, type: 'income' | 'expense') => void;
  getCategorySpending: (categoryId: string) => number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

interface FinanceProviderProps {
  children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  const financeData = useFinanceData();

  return (
    <FinanceContext.Provider value={financeData}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinanceContext = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinanceContext must be used within a FinanceProvider');
  }
  return context;
};

// FIX: Експортуємо useFinanceData для зворотної сумісності
export { useFinanceData };