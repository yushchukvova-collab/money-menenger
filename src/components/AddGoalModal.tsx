import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Target, Calendar } from "lucide-react";
import { FinancialGoal } from "@/hooks/useFinanceData";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddGoalModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => void;
  editGoal?: FinancialGoal;
}

export const AddGoalModal = ({ open, onClose, onSave, editGoal }: AddGoalModalProps) => {
  const [title, setTitle] = useState(editGoal?.title || '');
  const [targetAmount, setTargetAmount] = useState(editGoal?.targetAmount?.toString() || '');
  const [deadline, setDeadline] = useState(editGoal?.deadline?.split('T')[0] || '');
  const { toast } = useToast();
  const { t, formatCurrency } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: t('validation.title_required'),
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(targetAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: t('validation.amount_positive'),
        variant: "destructive",
      });
      return;
    }
    
    if (!deadline) {
      toast({
        title: t('validation.deadline_required'),
        variant: "destructive",
      });
      return;
    }

    onSave({
      title,
      targetAmount: amount,
      currentAmount: editGoal?.currentAmount || 0,
      deadline
    });

    toast({
      title: editGoal ? t('message.success.goal_updated') : t('message.success.goal_created'),
      description: `${t('message.success.goal_saved')} "${title}"`,
    });
    
    // Reset form
    setTitle('');
    setTargetAmount('');
    setDeadline('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Target className="h-5 w-5 text-primary" />
            {editGoal ? t('goals.edit') : t('modal.goal.title')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Goal Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">{t('form.goal_title')}</Label>
            <Input
              id="title"
              placeholder={t('form.placeholder.goal')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 sm:h-10"
            />
          </div>

          {/* Target Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">{t('form.target_amount')}</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="text-right text-lg h-12 sm:h-10"
              step="0.01"
              min="0"
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-sm font-medium">{t('form.deadline')}</Label>
            <div className="relative">
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="h-12 sm:h-10"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Current Amount (for editing) */}
          {editGoal && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">{t('form.current_amount')}</div>
              <div className="text-lg font-semibold">
                {formatCurrency(editGoal.currentAmount)}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12 sm:h-10">
              {t('actions.cancel')}
            </Button>
            <Button type="submit" className="flex-1 h-12 sm:h-10">
              {editGoal ? t('actions.update') : t('actions.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};