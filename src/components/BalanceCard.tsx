import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  title: string;
  amount: number | string;
  icon: LucideIcon;
  trend: string;
  type: "balance" | "income" | "expense" | "savings";
}

const typeStyles = {
  balance: "from-balance/20 to-balance/5 border-balance/20",
  income: "from-income/20 to-income/5 border-income/20",
  expense: "from-expense/20 to-expense/5 border-expense/20",
  savings: "from-primary/20 to-primary/5 border-primary/20",
};

const iconStyles = {
  balance: "text-balance",
  income: "text-income",
  expense: "text-expense", 
  savings: "text-primary",
};

export const BalanceCard = ({ title, amount, icon: Icon, trend, type }: BalanceCardProps) => {
  const isPositiveTrend = trend.startsWith('+');

  return (
    <Card className={cn(
      "relative overflow-hidden border bg-gradient-to-br transition-all duration-300 hover:shadow-lg hover:scale-105",
      typeStyles[type]
    )}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", iconStyles[type])} />
          <div className={cn(
            "text-xs sm:text-sm font-medium px-2 py-1 rounded-full",
            isPositiveTrend 
              ? "text-income bg-income/10" 
              : "text-expense bg-expense/10"
          )}>
            {trend}
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{title}</p>
          <p className="text-lg sm:text-2xl font-bold">
            {amount}
          </p>
        </div>

        {/* Background decoration */}
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <Icon className="h-12 w-12 sm:h-16 sm:w-16" />
        </div>
      </CardContent>
    </Card>
  );
};