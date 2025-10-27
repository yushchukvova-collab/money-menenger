import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ua' | 'pl';
export type Currency = 'USD' | 'EUR' | 'UAH' | 'PLN' | 'GBP';

interface LanguageContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  t: (key: string) => string;
  formatCurrency: (amount: number | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Мінімальні переклади
const translations = {
  ua: {
    'app.title': 'Фінансовий Менеджер',
    'balance.total': 'Загальний баланс',
    'transactions.title': 'Останні транзакції',
    'goals.title': 'Фінансові цілі',
    'categories.title': 'Категорії',
    'actions.add': 'Додати',
    'actions.save': 'Зберегти',
    'actions.cancel': 'Скасувати',
    'transactions.add': 'Додати транзакцію',
    'transactions.income': 'Дохід',
    'transactions.expense': 'Витрата',
    'transactions.amount': 'Сума',
    'transactions.category': 'Категорія',
    'transactions.description': 'Опис',
    'categories.food': 'Їжа',
    'categories.transport': 'Транспорт',
    'categories.housing': 'Житло',
    'categories.entertainment': 'Розваги',
    'categories.health': 'Здоров\'я',
    'categories.shopping': 'Покупки',
    'goals.add': 'Додати ціль',
    'goals.target': 'Цільова сума',
    'goals.current': 'Поточна сума',
    'goals.deadline': 'Дедлайн',
    'balance.income.month': 'Доходи цього місяця',
    'balance.expenses.month': 'Витрати цього місяця',
    'chart.expenses.title': 'Витрати за місяць',
    'userCounter.text': '👥 Нас уже {count} користувачів!',
    'modal.initial_balance.title': 'Встановити початковий баланс',
    'modal.initial_balance.current': 'Поточний баланс',
    'common.no_data': 'Даних ще немає'
  },
  en: {
    'app.title': 'Finance Manager',
    'balance.total': 'Total Balance',
    'transactions.title': 'Recent Transactions',
    'goals.title': 'Financial Goals',
    'categories.title': 'Categories',
    'actions.add': 'Add',
    'actions.save': 'Save',
    'actions.cancel': 'Cancel',
    'transactions.add': 'Add Transaction',
    'transactions.income': 'Income',
    'transactions.expense': 'Expense',
    'transactions.amount': 'Amount',
    'transactions.category': 'Category',
    'transactions.description': 'Description',
    'categories.food': 'Food',
    'categories.transport': 'Transport',
    'categories.housing': 'Housing',
    'categories.entertainment': 'Entertainment',
    'categories.health': 'Health',
    'categories.shopping': 'Shopping',
    'goals.add': 'Add Goal',
    'goals.target': 'Target Amount',
    'goals.current': 'Current Amount',
    'goals.deadline': 'Deadline',
    'balance.income.month': 'Income This Month',
    'balance.expenses.month': 'Expenses This Month',
    'chart.expenses.title': 'Monthly Expenses',
    'userCounter.text': '👥 We are already {count} users!',
    'modal.initial_balance.title': 'Set Initial Balance',
    'modal.initial_balance.current': 'Current Balance',
    'common.no_data': 'No data yet'
  },
  pl: {
    'app.title': 'Menedżer Finansowy',
    'balance.total': 'Całkowite saldo',
    'transactions.title': 'Ostatnie transakcje',
    'goals.title': 'Cele finansowe',
    'categories.title': 'Kategorie',
    'actions.add': 'Dodaj',
    'actions.save': 'Zapisz',
    'actions.cancel': 'Anuluj',
    'transactions.add': 'Dodaj transakcję',
    'transactions.income': 'Dochód',
    'transactions.expense': 'Wydatek',
    'transactions.amount': 'Kwota',
    'transactions.category': 'Kategoria',
    'transactions.description': 'Opis',
    'categories.food': 'Żywność',
    'categories.transport': 'Transport',
    'categories.housing': 'Mieszkanie',
    'categories.entertainment': 'Rozrywka',
    'categories.health': 'Zdrowie',
    'categories.shopping': 'Zakupy',
    'goals.add': 'Dodaj cel',
    'goals.target': 'Kwota docelowa',
    'goals.current': 'Obecna kwota',
    'goals.deadline': 'Termin',
    'balance.income.month': 'Dochody w tym miesiącu',
    'balance.expenses.month': 'Wydatki w tym miesiącu',
    'chart.expenses.title': 'Wydatki miesięczne',
    'userCounter.text': '👥 Jesteśmy już {count} użytkowników!',
    'modal.initial_balance.title': 'Ustaw saldo początkowe',
    'modal.initial_balance.current': 'Obecne saldo',
    'common.no_data': 'Jeszcze brak danych'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ua');
  const [currency, setCurrencyState] = useState<Currency>('UAH');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('smf_locale', lang);
    } catch (e) {
      console.warn('LocalStorage недоступний');
    }
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    try {
      localStorage.setItem('smf_currency', curr);
    } catch (e) {
      console.warn('LocalStorage недоступний');
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  const formatCurrency = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      UAH: '₴',
      PLN: 'zł',
      GBP: '£'
    };

    try {
      return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(numAmount);
    } catch (error) {
      return `${currencySymbols[currency]}${numAmount.toFixed(2)}`;
    }
  };

  const value: LanguageContextType = {
    language,
    currency,
    setLanguage,
    setCurrency,
    t,
    formatCurrency
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};