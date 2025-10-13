import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PiggyBank } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";

interface InitialBalanceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (balance: number) => void;
  currentBalance?: number;
}

export const InitialBalanceModal = ({ open, onClose, onSave, currentBalance = 0 }: InitialBalanceModalProps) => {
  const [balance, setBalance] = useState(currentBalance.toString());
  const { toast } = useToast();
  const { t, formatCurrency, currency } = useLanguage();

  const getCurrencySymbol = () => {
    const symbols: Record<typeof currency, string> = { 
      USD: '$', EUR: '€', UAH: '₴', PLN: 'zł', GBP: '£' 
    };
    return symbols[currency];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numBalance = parseFloat(balance);
    if (isNaN(numBalance) || numBalance < 0) {
      toast({
        title: t('actions.error'),
        description: t('balance.error_invalid'),
        variant: "destructive",
      });
      return;
    }

    onSave(numBalance);
    toast({
      title: t('balance.saved'),
      description: `${t('balance.saved_description')} ${formatCurrency(numBalance)}`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 max-h-[90vh]">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <PiggyBank className="h-5 w-5 text-balance" />
            {t('balance.initial')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="balance" className="text-sm font-medium">
              {t('balance.initial_label')}
            </Label>
            <div className="relative">
              <Input
                id="balance"
                type="number"
                placeholder="0"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="text-right text-lg pr-12 h-12 sm:h-10"
                step="0.01"
                min="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                {getCurrencySymbol()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('balance.initial_description')}
            </p>
          </div>

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