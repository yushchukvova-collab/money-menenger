import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Transaction, Category } from "@/contexts/FinanceContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExpenseChartProps {
  transactions: Transaction[];
  expenseCategories: Category[];
}

export const ExpenseChart = ({ transactions, expenseCategories }: ExpenseChartProps) => {
  const { t, formatCurrency } = useLanguage();
  // FIX: Додано responsive обробку для мобільних пристроїв
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Поточний місяць
  const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const thisMonthExpenses = transactions.filter(
    t => t.type === 'expense' && t.date.startsWith(thisMonth)
  );

  // Дані для PieChart
  const data = expenseCategories
    .map(category => {
      const value = thisMonthExpenses
        .filter(t => t.category === category.id)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        name: category.name,
        value,
        // FIX: Конвертація Tailwind кольору в hex або використання fallback
        color: convertTailwindColorToHex(category.color)
      };
    })
    .filter(item => item.value > 0); // тільки категорії з витратами

  // FIX: Виправлено типи для tooltip
  const CustomTooltip = ({ active, payload }: { 
    active?: boolean; 
    payload?: Array<{ name: string; value: number; payload: { name: string; value: number } }> 
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.payload.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // FIX: Виправлено типи для legend з правильними кольорами
  const CustomLegend = ({ payload }: { 
    payload?: Array<{ value: string; color: string }> 
  }) => {
    if (!payload) return null;
    
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const COLORS = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f",
    "#0088fe", "#ffbb28", "#ff8042", "#a4de6c", "#d0ed57"
  ];

  // FIX: Функція для конвертації Tailwind кольорів у hex
  const convertTailwindColorToHex = (tailwindColor: string): string => {
    const colorMap: Record<string, string> = {
      'bg-category-food': '#f97316',      // orange-500
      'bg-category-transport': '#3b82f6', // blue-500  
      'bg-category-housing': '#8b5cf6',   // violet-500
      'bg-category-entertainment': '#a855f7', // purple-500
      'bg-category-health': '#10b981',    // emerald-500
      'bg-category-shopping': '#ec4899',  // pink-500
      'bg-income-salary': '#22c55e',      // green-500
      'bg-income-freelance': '#06b6d4',   // cyan-500
      'bg-income-investment': '#84cc16',  // lime-500
      'bg-income-gift': '#f59e0b',        // amber-500
      'bg-income-other': '#6b7280'        // gray-500
    };
    
    return colorMap[tailwindColor] || '#64748b'; // gray-500 як fallback
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('chart.expenses.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-48 sm:h-64 flex items-center justify-center text-muted-foreground">
            {t('common.no_data')}
          </div>
        ) : (
          <>
            {/* FIX: Покращена адаптивність діаграми для мобільних пристроїв */}
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 25 : 40}
                    outerRadius={isMobile ? 60 : 80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {formatCurrency(data.reduce((sum, item) => sum + item.value, 0))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('chart.total_expenses')}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};