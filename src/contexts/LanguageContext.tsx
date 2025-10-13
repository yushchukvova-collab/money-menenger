import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

const STORAGE_KEYS = {
  LANGUAGE: 'smf_locale',
  CURRENCY: 'smf_currency'
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ua');
  const [currency, setCurrencyState] = useState<Currency>('UAH');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
    const savedCurrency = localStorage.getItem(STORAGE_KEYS.CURRENCY) as Currency;
    
    if (savedLanguage && ['en', 'ua', 'pl'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
    
    if (savedCurrency && ['USD', 'EUR', 'UAH', 'PLN', 'GBP'].includes(savedCurrency)) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem(STORAGE_KEYS.CURRENCY, curr);
  };

  const t = (key: string): string => {
    const translations = getTranslations();
    return translations[language]?.[key] || key;
  };

  const formatCurrency = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    const currencyMap = {
      USD: { code: 'USD', symbol: '$' },
      EUR: { code: 'EUR', symbol: '€' },
      UAH: { code: 'UAH', symbol: '₴' },
      PLN: { code: 'PLN', symbol: 'zł' },
      GBP: { code: 'GBP', symbol: '£' }
    };

    try {
      return new Intl.NumberFormat(getLocaleForCurrency(currency), {
        style: 'currency',
        currency: currencyMap[currency].code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(numAmount);
    } catch (error) {
      // Fallback formatting
      return `${currencyMap[currency].symbol}${numAmount.toFixed(2)}`;
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

const getLocaleForCurrency = (currency: Currency): string => {
  const localeMap = {
    USD: 'en-US',
    EUR: 'en-GB',
    UAH: 'uk-UA',
    PLN: 'pl-PL',
    GBP: 'en-GB'
  };
  return localeMap[currency];
};

const getTranslations = () => {
  return {
    en: {
      // Header
      'app.title': 'Finance Manager',
      'header.balance': 'Balance',
      'header.add': 'Add',
      'header.menu': 'Menu',
      
      // Balance cards
      'balance.total': 'Total Balance',
      'balance.income.month': 'Income This Month',
      'balance.expenses.month': 'Expenses This Month',
      'balance.savings.rate': 'Savings Rate',
      'balance.saved': 'Balance saved',
      'balance.error_invalid': 'Please enter a valid amount',
      
      // Categories
      'categories.title': 'Category Management',
      'categories.overview': 'Category Overview',
      'categories.overview_title': 'Category Overview',
      'categories.add': 'Add Category',
      'categories.edit': 'Edit Category',
      'categories.delete': 'Delete Category',
      'categories.name': 'Category Name',
      'categories.limit': 'Monthly Limit',
      'categories.icon': 'Icon',
      'categories.spent': 'Spent',
      'categories.remaining': 'Remaining',
      'categories.over_limit': 'Over Limit',
      'categories.placeholder': 'Enter category name',
      
      // Default categories
      'category.food': 'Food',
      'category.transport': 'Transport',
      'category.housing': 'Housing',
      'category.entertainment': 'Entertainment',
      'category.health': 'Health',
      'category.shopping': 'Shopping',
      
      // Transactions
      'transactions.title': 'Recent Transactions',
      'transactions.add': 'Add Transaction',
      'transactions.type': 'Type',
      'transactions.amount': 'Amount',
      'transactions.category': 'Category',
      'transactions.description': 'Description',
      'transactions.date': 'Date',
      'transactions.income': 'Income',
      'transactions.expense': 'Expense',
      'transactions.fill_required': 'Please fill in all required fields',
      'transactions.other': 'Other',
      'transactions.no_description': 'No description',
      'transactions.income_saved': 'Income added:',
      'transactions.expense_saved': 'Expense added:',
      'transactions.added': 'Transaction added',
      'transactions.select_category': 'Select category',
      'transactions.link_to_goal': 'Link to goal',
      'transactions.select_goal': 'Select goal (optional)',
      'transactions.no_goal': 'No goal',
      'transactions.placeholder_description': 'Enter description...',
      'transactions.show_all': 'Show All Transactions',
      
      // Goals
      'goals.title': 'Financial Goals',
      'goals.add': 'Add Goal',
      'goals.edit': 'Edit Goal',
      'goals.delete': 'Delete Goal',
      'goals.name': 'Goal Name',
      'goals.target': 'Target Amount',
      'goals.current': 'Current Amount',
      'goals.deadline': 'Deadline',
      'goals.progress': 'Progress',
      'goals.days_left': 'days left',
      'goals.overdue': 'Overdue',
      'goals.per_month': '/month',
      'goals.completed': 'Goal achieved!',
      'goals.no_goals': 'No financial goals yet',
      'goals.create_first': 'Create Your First Goal',
      'goals.delete_confirm': 'Delete Goal?',
      'goals.delete_description': 'This action cannot be undone.',
      'goals.deleted': 'Goal deleted',
      'goals.deleted_description': 'The financial goal has been successfully removed',
      
      // Actions
      'actions.save': 'Save',
      'actions.cancel': 'Cancel', 
      'actions.delete': 'Delete',
      'actions.edit': 'Edit',
      'actions.add': 'Add',
      'actions.close': 'Close',
      'actions.clear_all': 'Clear All Data',
      'actions.new_month': 'New Month',
      'actions.create': 'Create',
      'actions.update': 'Update',
      'actions.error': 'Error',
      
      // Messages
      'message.error.fill_all_fields': 'Please fill in all fields',
      'message.error.valid_amount': 'Please enter a valid amount',
      'message.success.goal_created': 'Goal created!',
      'message.success.goal_updated': 'Goal updated!',
      'message.success.data_cleared': 'Data cleared',
      'message.success.new_month': 'New month started',
      'message.success.goal_saved': 'Financial goal saved',
      'message.description.clear_data': 'All your transactions, balance and settings will be permanently deleted. This action cannot be undone.',
      'message.description.new_month': 'All transactions from this month will be deleted, but the initial balance will be preserved. This helps track monthly expenses.',
      'message.confirm.clear_all': 'Clear all data?',
      'message.confirm.new_month': 'Start new month?',
      'message.all_data_cleared': 'All data has been successfully deleted',
      'message.transactions_reset': 'Transactions reset, initial balance preserved',
      
      // Form labels
      'form.goal_title': 'Goal Title*',
      'form.target_amount': 'Target Amount*', 
      'form.deadline': 'Deadline*',
      'form.current_amount': 'Current Amount',
      'form.placeholder.goal': 'e.g., New car',
      
      // Modals
      'modal.initial_balance.title': 'Set Initial Balance',
      'modal.initial_balance.current': 'Current Balance',
      'modal.goal.title': 'Financial Goal',
      'modal.category.title': 'Category',
      
      // Charts
      'chart.expenses.title': 'Monthly Expenses',
      'chart.no_data': 'No data available',
      'chart.total_expenses': 'Total Expenses',
      
      // Common
      'common.today': 'Today',
      'common.yesterday': 'Yesterday',
      'common.show_all': 'Show All',
      'common.per_month': 'per month',
      'common.no_data': 'No data yet',
      'common.no_transactions': 'No transactions yet',
      'common.no_goals': 'No financial goals yet',
      'common.no_categories': 'No custom categories',
      'common.select': 'Select',
      'common.select_category': 'Select category',
      'common.select_goal': 'Select goal (optional)',
      'common.enter_amount': 'Enter amount',
      'common.enter_description': 'Enter description',
      'common.used': 'used',
      'common.from': 'of',
      'common.exceeded_by': 'Exceeded by',
      'common.total_spent': 'Total spent',
      'common.less_than_last_month': 'less than last month',
      'common.total_progress': 'Total progress',
      'common.of': 'of',
      'common.goals_achieved': 'goals achieved',
      'common.optional': 'optional',
      
      // Error
      'error.404': '404',
      'error.page_not_found': 'Oops! Page not found',
      'error.return_home': 'Return to Home',
      
      // Validation
      'validation.amount_required': 'Please enter an amount',
      'validation.amount_positive': 'Amount must be greater than 0',
      'validation.category_required': 'Please select a category',
      'validation.title_required': 'Please enter a title',
      'validation.deadline_required': 'Please select a deadline',
      
      // Color names
      'color.blue': 'Blue',
      'color.green': 'Green',
      'color.orange': 'Orange',
      'color.purple': 'Purple',
      'color.red': 'Red',
      'color.yellow': 'Yellow',
      'color.pink': 'Pink',
      'color.teal': 'Teal',
      
      // Icon names
      'icons.shopping_bag': 'Shopping Bag',
      'icons.car': 'Car',
      'icons.house': 'House',
      'icons.games': 'Games',
      'icons.health': 'Health',
      'icons.coffee': 'Coffee',
      'icons.clothing': 'Clothing',
      'icons.education': 'Education',
      
      'colors.green': 'Green',
      'colors.blue': 'Blue',
      'colors.purple': 'Purple',
      'colors.pink': 'Pink',
      'colors.red': 'Red',
      'colors.yellow': 'Yellow',
      
      // Income categories
      'income_category.salary': 'Salary',
      'income_category.freelance': 'Freelance',
      'income_category.investment': 'Investment',
      'income_category.gift': 'Gift',
      'income_category.other': 'Other',
      
      // Expense categories
      'expense_category.food': 'Food',
      'expense_category.transport': 'Transport',
      'expense_category.housing': 'Housing',
      'expense_category.entertainment': 'Entertainment',
      'expense_category.health': 'Health',
      'expense_category.shopping': 'Shopping',
      
      // Transaction filters
      'transactions.filter_all': 'All',
      
      // Languages
      'language.english': 'English',
      'language.ukrainian': 'Ukrainian',  
      'language.polish': 'Polish',
      
      // Currencies
      'currency.usd': 'US Dollar',
      'currency.eur': 'Euro',
      'currency.uah': 'Ukrainian Hryvnia',
      'currency.pln': 'Polish Zloty',
      'currency.gbp': 'British Pound',
      
      // User Counter
      'userCounter.text': '👥 We are already {count} users!'
    
      'categories.no_categories': 'No categories yet',
      'categories.add_first': 'Add your first category',
      'categories.color': 'Color',
      'icons.shopping_': 'Shopping',
},
    ua: {
      // Header
      'app.title': 'Фінансовий Менеджер',
      'header.balance': 'Баланс',
      'header.add': 'Додати',
      'header.menu': 'Меню',
      
      // Balance cards
      'balance.total': 'Загальний баланс',
      'balance.income.month': 'Доходи цього місяця',
      'balance.expenses.month': 'Витрати цього місяця',
      'balance.savings.rate': 'Норма заощаджень',
      'balance.saved': 'Баланс збережено',
      'balance.error_invalid': 'Будь ласка, введіть коректну суму',
      
      // Categories
      'categories.title': 'Управління категоріями',
      'categories.overview': 'Огляд категорій',
      'categories.overview_title': 'Огляд категорій',
      'categories.add': 'Додати категорію',
      'categories.edit': 'Редагувати категорію',
      'categories.delete': 'Видалити категорію',
      'categories.name': 'Назва категорії',
      'categories.limit': 'Місячний ліміт',
      'categories.icon': 'Іконка',
      'categories.spent': 'Витрачено',
      'categories.remaining': 'Залишилося',
      'categories.over_limit': 'Перевищено ліміт',
      'categories.placeholder': 'Введіть назву категорії',
      
      // Default categories
      'category.food': 'Харчування',
      'category.transport': 'Транспорт',
      'category.housing': 'Житло',
      'category.entertainment': 'Розваги',
      'category.health': 'Здоров\'я',
      'category.shopping': 'Покупки',
      
      // Transactions
      'transactions.title': 'Останні транзакції',
      'transactions.add': 'Додати транзакцію',
      'transactions.type': 'Тип',
      'transactions.amount': 'Сума',
      'transactions.category': 'Категорія',
      'transactions.description': 'Опис',
      'transactions.date': 'Дата',
      'transactions.income': 'Дохід',
      'transactions.expense': 'Витрата',
      'transactions.fill_required': 'Будь ласка, заповніть всі обов\'язкові поля',
      'transactions.other': 'Інше',
      'transactions.no_description': 'Без опису',
      'transactions.income_saved': 'Дохід додано:',
      'transactions.expense_saved': 'Витрату додано:',
      'transactions.added': 'Транзакцію додано',
      'transactions.select_category': 'Виберіть категорію',
      'transactions.link_to_goal': 'Прив\'язати до цілі',
      'transactions.select_goal': 'Виберіть ціль (необов\'язково)',
      'transactions.no_goal': 'Без цілі',
      'transactions.placeholder_description': 'Введіть опис...',
      'transactions.show_all': 'Показати всі транзакції',
      
      // Goals
      'goals.title': 'Фінансові цілі',
      'goals.add': 'Додати ціль',
      'goals.edit': 'Редагувати ціль',
      'goals.delete': 'Видалити ціль',
      'goals.name': 'Назва цілі',
      'goals.target': 'Цільова сума',
      'goals.current': 'Поточна сума',
      'goals.deadline': 'Дедлайн',
      'goals.progress': 'Прогрес',
      'goals.days_left': 'днів залишилось',
      'goals.overdue': 'Прострочено',
      'goals.per_month': '/місяць',
      'goals.completed': 'Ціль досягнута!',
      'goals.no_goals': 'Фінансових цілей ще немає',
      'goals.create_first': 'Створити першу ціль',
      'goals.delete_confirm': 'Видалити ціль?',
      'goals.delete_description': 'Цю дію неможливо скасувати.',
      'goals.deleted': 'Ціль видалено',
      'goals.deleted_description': 'Фінансова ціль успішно видалена',
      
      // Actions
      'actions.save': 'Зберегти',
      'actions.cancel': 'Скасувати',
      'actions.delete': 'Видалити',
      'actions.edit': 'Редагувати',
      'actions.add': 'Додати',
      'actions.close': 'Закрити',
      'actions.clear_all': 'Очистити дані',
      'actions.new_month': 'Новий місяць',
      'actions.create': 'Створити',
      'actions.update': 'Оновити',
      'actions.error': 'Помилка',
      
      // Messages
      'message.error.fill_all_fields': 'Будь ласка, заповніть всі поля',
      'message.error.valid_amount': 'Будь ласка, введіть коректну суму',
      'message.success.goal_created': 'Ціль створено!',
      'message.success.goal_updated': 'Ціль оновлено!',
      'message.success.data_cleared': 'Дані очищено',
      'message.success.new_month': 'Новий місяць розпочато',
      'message.success.goal_saved': 'Фінансова ціль збережена',
      'message.description.clear_data': 'Ця дія видалить всі ваші операції, баланс та налаштування назавжди. Відновити дані буде неможливо.',
      'message.description.new_month': 'Всі операції цього місяця будуть видалені, але початковий баланс збережеться. Це допоможе вести облік по місяцях.',
      'message.confirm.clear_all': 'Очистити всі дані?',
      'message.confirm.new_month': 'Розпочати новий місяць?',
      'message.all_data_cleared': 'Всі дані було успішно видалено',
      'message.transactions_reset': 'Операції обнулено, початковий баланс збережено',
      
      // Form labels
      'form.goal_title': 'Назва цілі*',
      'form.target_amount': 'Цільова сума*',
      'form.deadline': 'Дедлайн*',
      'form.current_amount': 'Поточна сума',
      'form.placeholder.goal': 'Наприклад: Новий автомобіль',
      
      // Modals
      'modal.initial_balance.title': 'Встановити початковий баланс',
      'modal.initial_balance.current': 'Поточний баланс',
      'modal.goal.title': 'Фінансова ціль',
      'modal.category.title': 'Категорія',
      
      // Charts
      'chart.expenses.title': 'Витрати за місяць',
      'chart.no_data': 'Дані відсутні',
      'chart.total_expenses': 'Всього витрат',
      
      // Common
      'common.today': 'Сьогодні',
      'common.yesterday': 'Вчора',
      'common.show_all': 'Показати всі',
      'common.per_month': 'на місяць',
      'common.no_data': 'Даних ще немає',
      'common.no_transactions': 'Транзакцій ще немає',
      'common.no_goals': 'Фінансових цілей ще немає',
      'common.no_categories': 'Користувацьких категорій немає',
      'common.select': 'Вибрати',
      'common.select_category': 'Виберіть категорію',
      'common.select_goal': 'Виберіть ціль (опціонально)',
      'common.enter_amount': 'Введіть суму',
      'common.enter_description': 'Введіть опис',
      'common.used': 'використано',
      'common.from': 'з',
      'common.exceeded_by': 'Перевищено на',
      'common.total_spent': 'Всього витрачено',
      'common.less_than_last_month': 'менше ніж минулого місяця',
      'common.total_progress': 'Загальний прогрес',
      'common.of': 'з',
      'common.goals_achieved': 'цілей досягнуто',
      'common.optional': 'необов\'язково',
      
      // Error
      'error.404': '404',
      'error.page_not_found': 'Упс! Сторінку не знайдено',
      'error.return_home': 'Повернутися на головну',
      
      // Validation
      'validation.amount_required': 'Будь ласка, введіть суму',
      'validation.amount_positive': 'Сума повинна бути більше 0',
      'validation.category_required': 'Будь ласка, виберіть категорію',
      'validation.title_required': 'Будь ласка, введіть назву',
      'validation.deadline_required': 'Будь ласка, виберіть дедлайн',
      
      // Color names
      'color.blue': 'Синій',
      'color.green': 'Зелений',
      'color.orange': 'Помаранчевий',
      'color.purple': 'Фіолетовий',
      'color.red': 'Червоний',
      'color.yellow': 'Жовтий',
      'color.pink': 'Рожевий',
      'color.teal': 'Бірюзовий',
      
      // Icon names
      'icons.shopping_bag': 'Сумка',
      'icons.car': 'Автомобіль',
      'icons.house': 'Будинок',
      'icons.games': 'Ігри',
      'icons.health': 'Здоров\'я',
      'icons.coffee': 'Кава',
      'icons.clothing': 'Одяг',
      'icons.education': 'Освіта',
      
      'colors.green': 'Зелений',
      'colors.blue': 'Синій',
      'colors.purple': 'Фіолетовий',
      'colors.pink': 'Рожевий',
      'colors.red': 'Червоний',
      'colors.yellow': 'Жовтий',
      
      // Income categories
      'income_category.salary': 'Зарплата',
      'income_category.freelance': 'Фріланс',
      'income_category.investment': 'Інвестиції',
      'income_category.gift': 'Подарунок',
      'income_category.other': 'Інше',
      
      // Expense categories
      'expense_category.food': 'Їжа',
      'expense_category.transport': 'Транспорт',
      'expense_category.housing': 'Житло',
      'expense_category.entertainment': 'Розваги',
      'expense_category.health': 'Здоров\'я',
      'expense_category.shopping': 'Покупки',
      
      // Transaction filters
      'transactions.filter_all': 'Всі',
      
      // Languages
      'language.english': 'Англійська',
      'language.ukrainian': 'Українська',
      'language.polish': 'Польська',
      
      // Currencies
      'currency.usd': 'Долар США',
      'currency.eur': 'Євро',
      'currency.uah': 'Українська гривня',
      'currency.pln': 'Польський злотий',
      'currency.gbp': 'Британський фунт',
      
      // User Counter
      'userCounter.text': '👥 Нас уже {count} користувачів!'
    
      'categories.no_categories': 'Користувацьких категорій немає',
      'categories.add_first': 'Додай першу категорію, щоб почати',
      'categories.color': 'Колір',
      'icons.shopping_': 'Покупки',
},
    pl: {
      // Header
      'app.title': 'Menedżer Finansowy',
      'header.balance': 'Saldo',
      'header.add': 'Dodaj',
      'header.menu': 'Menu',
      
      // Balance cards
      'balance.total': 'Całkowite saldo',
      'balance.income.month': 'Dochody w tym miesiącu',
      'balance.expenses.month': 'Wydatki w tym miesiącu',
      'balance.savings.rate': 'Wskaźnik oszczędności',
      'balance.saved': 'Saldo zapisane',
      'balance.error_invalid': 'Proszę wpisać prawidłową kwotę',
      
      // Categories
      'categories.title': 'Zarządzanie kategoriami',
      'categories.overview': 'Przegląd kategorii',
      'categories.overview_title': 'Przegląd kategorii',
      'categories.add': 'Dodaj kategorię',
      'categories.edit': 'Edytuj kategorię',
      'categories.delete': 'Usuń kategorię',
      'categories.name': 'Nazwa kategorii',
      'categories.limit': 'Miesięczny limit',
      'categories.icon': 'Ikona',
      'categories.spent': 'Wydano',
      'categories.remaining': 'Pozostało',
      'categories.over_limit': 'Przekroczono limit',
      'categories.placeholder': 'Wpisz nazwę kategorii',
      
      // Default categories
      'category.food': 'Żywność',
      'category.transport': 'Transport',
      'category.housing': 'Mieszkanie',
      'category.entertainment': 'Rozrywka',
      'category.health': 'Zdrowie',
      'category.shopping': 'Zakupy',
      
      // Transactions
      'transactions.title': 'Ostatnie transakcje',
      'transactions.add': 'Dodaj transakcję',
      'transactions.type': 'Typ',
      'transactions.amount': 'Kwota',
      'transactions.category': 'Kategoria',
      'transactions.description': 'Opis',
      'transactions.date': 'Data',
      'transactions.income': 'Dochód',
      'transactions.expense': 'Wydatek',
      'transactions.fill_required': 'Proszę wypełnić wszystkie wymagane pola',
      'transactions.other': 'Inne',
      'transactions.no_description': 'Brak opisu',
      'transactions.income_saved': 'Dodano dochód:',
      'transactions.expense_saved': 'Dodano wydatek:',
      'transactions.added': 'Transakcja dodana',
      'transactions.select_category': 'Wybierz kategorię',
      'transactions.link_to_goal': 'Powiąż z celem',
      'transactions.select_goal': 'Wybierz cel (opcjonalnie)',
      'transactions.no_goal': 'Bez celu',
      'transactions.placeholder_description': 'Wpisz opis...',
      'transactions.show_all': 'Pokaż wszystkie transakcje',
      
      // Goals
      'goals.title': 'Cele finansowe',
      'goals.add': 'Dodaj cel',
      'goals.edit': 'Edytuj cel',
      'goals.delete': 'Usuń cel',
      'goals.name': 'Nazwa celu',
      'goals.target': 'Kwota docelowa',
      'goals.current': 'Obecna kwota',
      'goals.deadline': 'Termin',
      'goals.progress': 'Postęp',
      'goals.days_left': 'dni pozostało',
      'goals.overdue': 'Zaległe',
      'goals.per_month': '/miesiąc',
      'goals.completed': 'Cel osiągnięty!',
      'goals.no_goals': 'Jeszcze brak celów finansowych',
      'goals.create_first': 'Utwórz pierwszy cel',
      'goals.delete_confirm': 'Usunąć cel?',
      'goals.delete_description': 'Tej operacji nie można cofnąć.',
      'goals.deleted': 'Cel usunięty',
      'goals.deleted_description': 'Cel finansowy został pomyślnie usunięty',
      
      // Actions
      'actions.save': 'Zapisz',
      'actions.cancel': 'Anuluj',
      'actions.delete': 'Usuń',
      'actions.edit': 'Edytuj',
      'actions.add': 'Dodaj',
      'actions.close': 'Zamknij',
      'actions.clear_all': 'Wyczyść dane',
      'actions.new_month': 'Nowy miesiąc',
      'actions.create': 'Utwórz',
      'actions.update': 'Aktualizuj',
      'actions.error': 'Błąd',
      
      // Messages
      'message.error.fill_all_fields': 'Proszę wypełnić wszystkie pola',
      'message.error.valid_amount': 'Proszę wpisać prawidłową kwotę',
      'message.success.goal_created': 'Cel utworzony!',
      'message.success.goal_updated': 'Cel zaktualizowany!',
      'message.success.data_cleared': 'Dane wyczyszczone',
      'message.success.new_month': 'Rozpoczęto nowy miesiąc',
      'message.success.goal_saved': 'Cel finansowy zapisany',
      'message.description.clear_data': 'Ta akcja trwale usunie wszystkie transakcje, saldo i ustawienia. Tej czynności nie można cofnąć.',
      'message.description.new_month': 'Wszystkie transakcje z tego miesiąca zostaną usunięte, ale saldo początkowe zostanie zachowane. Pomaga to śledzić miesięczne wydatki.',
      'message.confirm.clear_all': 'Wyczyścić wszystkie dane?',
      'message.confirm.new_month': 'Rozpocząć nowy miesiąc?',
      'message.all_data_cleared': 'Wszystkie dane zostały pomyślnie usunięte',
      'message.transactions_reset': 'Transakcje zresetowane, saldo początkowe zachowane',
      
      // Form labels
      'form.goal_title': 'Tytuł celu*',
      'form.target_amount': 'Kwota docelowa*',
      'form.deadline': 'Termin*',
      'form.current_amount': 'Obecna kwota',
      'form.placeholder.goal': 'np. Nowy samochód',
      
      // Modals
      'modal.initial_balance.title': 'Ustaw saldo początkowe',
      'modal.initial_balance.current': 'Obecne saldo',
      'modal.goal.title': 'Cel finansowy',
      'modal.category.title': 'Kategoria',
      
      // Charts
      'chart.expenses.title': 'Wydatki miesięczne',
      'chart.no_data': 'Brak danych',
      'chart.total_expenses': 'Całkowite wydatki',
      
      // Common
      'common.today': 'Dzisiaj',
      'common.yesterday': 'Wczoraj',
      'common.show_all': 'Pokaż wszystko',
      'common.per_month': 'na miesiąc',
      'common.no_data': 'Jeszcze brak danych',
      'common.no_transactions': 'Jeszcze brak transakcji',
      'common.no_goals': 'Jeszcze brak celów finansowych',
      'common.no_categories': 'Brak niestandardowych kategorii',
      'common.select': 'Wybierz',
      'common.select_category': 'Wybierz kategorię',
      'common.select_goal': 'Wybierz cel (opcjonalnie)',
      'common.enter_amount': 'Wpisz kwotę',
      'common.enter_description': 'Wpisz opis',
      'common.used': 'wykorzystano',
      'common.from': 'z',
      'common.exceeded_by': 'Przekroczono o',
      'common.total_spent': 'Całkowite wydatki',
      'common.less_than_last_month': 'mniej niż w zeszłym miesiącu',
      'common.total_progress': 'Całkowity postęp',
      'common.of': 'z',
      'common.goals_achieved': 'celów osiągniętych',
      'common.optional': 'opcjonalnie',
      
      // Error
      'error.404': '404',
      'error.page_not_found': 'Ups! Strona nie została znaleziona',
      'error.return_home': 'Powrót do strony głównej',
      
      // Validation
      'validation.amount_required': 'Proszę wpisać kwotę',
      'validation.amount_positive': 'Kwota musi być większa niż 0',
      'validation.category_required': 'Proszę wybrać kategorię',
      'validation.title_required': 'Proszę wpisać tytuł',
      'validation.deadline_required': 'Proszę wybrać termin',
      
      // Color names
      'color.blue': 'Niebieski',
      'color.green': 'Zielony',
      'color.orange': 'Pomarańczowy',
      'color.purple': 'Fioletowy',
      'color.red': 'Czerwony',
      'color.yellow': 'Żółty',
      'color.pink': 'Różowy',
      'color.teal': 'Turkusowy',
      
      // Icon names
      'icon.shopping_bag': 'Torba na zakupy',
      'icon.car': 'Samochód',
      'icon.home': 'Dom',
      'icon.utensils': 'Sztućce',
      'icon.heart': 'Serce',
      'icon.coffee': 'Kawa',
      'icon.shirt': 'Koszula',
      'icon.book': 'Książka',
      
      'icons.shopping_bag': 'Torba',
      'icons.car': 'Samochód',
      'icons.house': 'Dom',
      'icons.games': 'Gry',
      'icons.health': 'Zdrowie',
      'icons.coffee': 'Kawa',
      'icons.clothing': 'Odzież',
      'icons.education': 'Edukacja',
      
      'colors.green': 'Zielony',
      'colors.blue': 'Niebieski',
      'colors.purple': 'Fioletowy',
      'colors.pink': 'Różowy',
      'colors.red': 'Czerwony',
      'colors.yellow': 'Żółty',
      
      // Income categories
      'income_category.salary': 'Pensja',
      'income_category.freelance': 'Freelance',
      'income_category.investment': 'Inwestycje',
      'income_category.gift': 'Prezent',
      'income_category.other': 'Inne',
      
      // Expense categories
      'expense_category.food': 'Jedzenie',
      'expense_category.transport': 'Transport',
      'expense_category.housing': 'Mieszkanie',
      'expense_category.entertainment': 'Rozrywka',
      'expense_category.health': 'Zdrowie',
      'expense_category.shopping': 'Zakupy',
      
      // Transaction filters
      'transactions.filter_all': 'Wszystkie',
      
      // Languages
      'language.english': 'Angielski',
      'language.ukrainian': 'Ukraiński',
      'language.polish': 'Polski',
      
      // Currencies
      'currency.usd': 'Dolar amerykański',
      'currency.eur': 'Euro',
      'currency.uah': 'Hrywna ukraińska',
      'currency.pln': 'Złoty polski',
      'currency.gbp': 'Funt brytyjski',
      
      // User Counter
      'userCounter.text': '👥 Jesteśmy już {count} użytkowników!'
    
      'categories.no_categories': 'Brak niestandardowych kategorii',
      'categories.add_first': 'Dodaj pierwszą kategorię, aby rozpocząć',
      'categories.color': 'Kolor',
      'icons.shopping_': 'Zakupy',
}
  };
};