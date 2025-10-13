import { renderHook, act } from '@testing-library/react';
import { useFinanceData } from '../hooks/useFinanceData';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock as any;

describe('useFinanceData', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  test('initializes with default data', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useFinanceData());
    
    expect(result.current.data.initialBalance).toBe(0);
    expect(result.current.data.currentBalance).toBe(0);
    expect(result.current.data.transactions).toEqual([]);
    expect(result.current.data.goals).toEqual([]);
    expect(result.current.data.incomeCategories.length).toBeGreaterThan(0);
    expect(result.current.data.expenseCategories.length).toBeGreaterThan(0);
  });

  test('sets initial balance correctly', () => {
    const { result } = renderHook(() => useFinanceData());
    
    act(() => {
      result.current.setInitialBalance(1000);
    });
    
    expect(result.current.data.initialBalance).toBe(1000);
    expect(result.current.data.currentBalance).toBe(1000);
  });

  test('adds transaction and updates balance', () => {
    const { result } = renderHook(() => useFinanceData());
    
    act(() => {
      result.current.setInitialBalance(1000);
    });
    
    act(() => {
      result.current.addTransaction({
        type: 'expense',
        amount: 100,
        description: 'Test expense',
        category: 'food',
        categoryName: 'Food',
        date: new Date().toISOString()
      });
    });
    
    expect(result.current.data.transactions).toHaveLength(1);
    expect(result.current.data.currentBalance).toBe(900);
  });

  test('calculates monthly stats correctly', () => {
    const { result } = renderHook(() => useFinanceData());
    
    act(() => {
      result.current.setInitialBalance(1000);
      result.current.addTransaction({
        type: 'income',
        amount: 500,
        description: 'Salary',
        category: 'income',
        categoryName: 'Income',
        date: new Date().toISOString()
      });
      result.current.addTransaction({
        type: 'expense',
        amount: 200,
        description: 'Groceries',
        category: 'food',
        categoryName: 'Food',
        date: new Date().toISOString()
      });
    });
    
    const stats = result.current.getMonthlyStats();
    
    expect(stats.totalIncome).toBe(500);
    expect(stats.totalExpenses).toBe(200);
    expect(stats.balance).toBe(1300);
    expect(stats.savingsRate).toBe(60);
  });
});