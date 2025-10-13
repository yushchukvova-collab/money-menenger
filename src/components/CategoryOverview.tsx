import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ShoppingBag, Car, Home, Gamepad2, Heart, 
  MoreHorizontal, TrendingUp, Coffee, Shirt, BookOpen
} from "lucide-react";
import { Transaction, Category } from "@/hooks/useFinanceData";

const iconMap = {
  ShoppingBag,
  Car,
  Home,
  Gamepad2,
  Heart,
  Coffee,
  Shirt,
  BookOpen
};

import { useLanguage } from "@/contexts/LanguageContext";

interface CategoryOverviewProps {
  transactions: Transaction[];
  expenseCategories: Category[];
}

export const CategoryOverview = ({ transactions, expenseCategories }: CategoryOverviewProps) => {
  const { t, formatCurrency } = useLanguage();

  // Calculate spending by category from transactions
  const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const thisMonthExpenses = transactions.filter(t => 
    t.type === 'expense' && t.date.startsWith(thisMonth)
  );

  const categoryData = expenseCategories.map(category => {
    const spent = thisMonthExpenses
      .filter(t => t.category === category.id)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      ...category,
      spent
    };
  });

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || ShoppingBag;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-expense';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-income';
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t('categories.overview_title')}</CardTitle>
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryData.map((category) => {
            const IconComponent = getIconComponent(category.icon);
            const percentage = (category.spent / category.limit) * 100;
            const isOverBudget = percentage > 100;
            
            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color}/20`}>
                      <IconComponent className={`h-4 w-4 text-${category.color.replace('bg-', '')}`} />
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatCurrency(category.spent)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t('common.from')} {formatCurrency(category.limit)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-2"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${isOverBudget ? 'text-expense' : 'text-muted-foreground'}`}>
                      {Math.round(percentage)}% {t('common.used')}
                    </span>
                    {isOverBudget && (
                      <span className="text-expense font-medium">
                        {t('common.exceeded_by')} {formatCurrency(category.spent - category.limit)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t('common.total_spent')}</span>
              <span className="font-semibold">
                {formatCurrency(categoryData.reduce((sum, cat) => sum + cat.spent, 0))}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-income">
              <TrendingUp className="h-3 w-3" />
              <span>5% {t('common.less_than_last_month')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};