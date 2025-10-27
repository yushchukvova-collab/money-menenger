// FIX: Виправлено імпорти типів
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingBag, Car, Home, Gamepad2, Heart, 
  TrendingUp, TrendingDown, Calendar 
} from "lucide-react";
import { Transaction, FinancialGoal, Category } from "@/contexts/FinanceContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuickAddTransactionProps {
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  goals: FinancialGoal[];
  incomeCategories: Category[];
  expenseCategories: Category[];
}

export const QuickAddTransaction = ({ onClose, onAdd, goals, incomeCategories, expenseCategories }: QuickAddTransactionProps) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [goalId, setGoalId] = useState('none');
  
  const { toast } = useToast();
  const { t, currency, formatCurrency } = useLanguage();

  const getCurrencySymbol = () => {
    const symbols: Record<typeof currency, string> = { 
      USD: '$', EUR: '€', UAH: '₴', PLN: 'zł', GBP: '£' 
    };
    return symbols[currency];
  };

  const currentCategories = type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) {
      toast({
        title: t('actions.error') || "Error",
        description: t('transactions.fill_required'),
        variant: "destructive",
      });
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: t('actions.error'),
        description: t('balance.error_invalid'),
        variant: "destructive",
      });
      return;
    }

    const selectedCategory = currentCategories.find(cat => cat.id === category);
    
    onAdd({
      type,
      amount: numAmount,
      category,
      categoryName: selectedCategory?.name || t('transactions.other'),
      description: description || t('transactions.no_description'),
      date,
      goalId: goalId === 'none' || !goalId ? undefined : goalId
    });

    const successMsg = type === 'income' 
      ? `${t('transactions.income_saved')} ${formatCurrency(numAmount)}`
      : `${t('transactions.expense_saved')} ${formatCurrency(numAmount)}`;

    toast({
      title: t('transactions.added'),
      description: successMsg,
    });
    
    // Reset form
    setType('expense');
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setGoalId('none');
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            {type === 'income' ? (
              <TrendingUp className="h-5 w-5 text-income" />
            ) : (
              <TrendingDown className="h-5 w-5 text-expense" />
            )}
            {t('transactions.add')} {type === 'income' ? t('transactions.income').toLowerCase() : t('transactions.expense').toLowerCase()}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4">
          {/* Transaction Type */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === 'expense' ? 'default' : 'outline'}
              className="flex-1 h-12 sm:h-10"
              onClick={() => {
                setType('expense');
                setCategory('');
              }}
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              {t('transactions.expense')}
            </Button>
            <Button
              type="button"
              variant={type === 'income' ? 'default' : 'outline'}
              className="flex-1 h-12 sm:h-10"
              onClick={() => {
                setType('income');
                setCategory('');
              }}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              {t('transactions.income')}
            </Button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">{t('transactions.amount')}*</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-right text-lg pr-12 h-12 sm:h-10"
                step="0.01"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                {getCurrencySymbol()}
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">{t('transactions.category')}*</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t('transactions.select_category')} />
              </SelectTrigger>
              <SelectContent>
                {currentCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">{t('transactions.date')}</Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Goal Assignment */}
          <div className="space-y-2">
            <Label htmlFor="goal">{t('transactions.link_to_goal')}</Label>
            <Select value={goalId} onValueChange={setGoalId}>
              <SelectTrigger>
                <SelectValue placeholder={t('transactions.select_goal')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('transactions.no_goal')}</SelectItem>
                {goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              {t('transactions.description')} ({t('common.optional')})
            </Label>
            <Textarea
              id="description"
              placeholder={t('transactions.placeholder_description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12 sm:h-10">
              {t('actions.cancel')}
            </Button>
            <Button type="submit" className="flex-1 h-12 sm:h-10">
              {t('actions.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};