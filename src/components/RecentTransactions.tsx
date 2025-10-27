// FIX: Виправлено імпорт типу Transaction
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingBag, Car, Home, Gamepad2, Heart, 
  TrendingUp, TrendingDown, MoreHorizontal 
} from "lucide-react";
import { Transaction } from "@/contexts/FinanceContext";
import { useLanguage, Currency } from "@/contexts/LanguageContext";

// FIX: Виправлено тип для іконок категорій
import { LucideIcon } from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  food: ShoppingBag,
  transport: Car,
  housing: Home,
  entertainment: Gamepad2,
  health: Heart,
  shopping: ShoppingBag,
  salary: TrendingUp,
};

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  const { t, formatCurrency, currency } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return t('common.today');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('common.yesterday');
    } else {
      const locale = getLocaleForCurrency(currency);
      return date.toLocaleDateString(locale, { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const getLocaleForCurrency = (curr: string) => {
    const localeMap: Record<string, string> = {
      USD: 'en-US',
      EUR: 'en-GB',
      UAH: 'uk-UA',
      PLN: 'pl-PL',
      GBP: 'en-GB'
    };
    return localeMap[curr] || 'en-US';
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const renderTransaction = (transaction: Transaction) => {
    const IconComponent = categoryIcons[transaction.category] || ShoppingBag;
    const isIncome = transaction.type === 'income';
    
    return (
      <div 
        key={transaction.id} 
        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
      >
        <div className={`p-2 rounded-lg flex-shrink-0 ${
          isIncome 
            ? 'bg-income/20 text-income' 
            : 'bg-muted'
        }`}>
          <IconComponent className="h-4 w-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-medium truncate text-sm sm:text-base">
              {transaction.description}
            </p>
            <p className={`font-semibold text-sm ${
              isIncome ? 'text-income' : 'text-foreground'
            }`}>
              {isIncome ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <Badge variant="secondary" className="text-xs">
              {transaction.categoryName}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDate(transaction.date)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl">{t('transactions.title')}</CardTitle>
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">{t('transactions.filter_all')}</TabsTrigger>
            <TabsTrigger value="income">{t('transactions.income')}</TabsTrigger>
            <TabsTrigger value="expense">{t('transactions.expense')}</TabsTrigger>
          </TabsList>
          
          <div className="space-y-2 sm:space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                {t('common.no_data')}
              </div>
            ) : (
              filteredTransactions.slice(0, 5).map(renderTransaction)
            )}
            
            {filteredTransactions.length > 0 && (
              <div className="pt-3 border-t">
                <button className="w-full text-sm text-primary hover:text-primary-hover transition-colors">
                  {t('transactions.show_all')}
                </button>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};