import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Transaction, Category } from "@/hooks/useFinanceData";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExpenseChartProps {
  transactions: Transaction[];
  expenseCategories: Category[];
}

export const ExpenseChart = ({ transactions, expenseCategories }: ExpenseChartProps) => {
  const { t, formatCurrency } = useLanguage();

  // Calculate expenses by category from transactions
  const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const thisMonthExpenses = transactions.filter(t => 
    t.type === 'expense' && t.date.startsWith(thisMonth)
  );

  const data = expenseCategories
    .map(category => {
      const value = thisMonthExpenses
        .filter(t => t.category === category.id)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: category.name,
        value,
        color: category.color
      };
    })
    .filter(item => item.value > 0); // Only show categories with spending

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('chart.expenses.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            {t('common.no_data')}
          </div>
        ) : (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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