import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface ManagementActionsProps {
  onClearAll: () => void;
  onNewMonth: () => void;
  isMobile?: boolean;
}

export const ManagementActions = ({ onClearAll, onNewMonth, isMobile = false }: ManagementActionsProps) => {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showNewMonthDialog, setShowNewMonthDialog] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleClearAll = () => {
    onClearAll();
    setShowClearDialog(false);
    toast({
      title: t('message.success.data_cleared'),
      description: t('message.all_data_cleared'),
    });
  };

  const handleNewMonth = () => {
    onNewMonth();
    setShowNewMonthDialog(false);
    toast({
      title: t('message.success.new_month'),
      description: t('message.transactions_reset'),
    });
  };

  return (
    <>
      <div className={cn("flex gap-2", isMobile && "flex-col")}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowNewMonthDialog(true)}
          className={cn("flex items-center gap-2", isMobile && "w-full justify-start")}
        >
          <RotateCcw className="h-4 w-4" />
          {t('actions.new_month')}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowClearDialog(true)}
          className={cn("flex items-center gap-2 text-destructive hover:text-destructive", isMobile && "w-full justify-start")}
        >
          <Trash2 className="h-4 w-4" />
          {t('actions.clear_all')}
        </Button>
      </div>

      {/* Clear All Data Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              {t('message.confirm.clear_all')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('message.description.clear_data')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('actions.delete')} {t('actions.clear_all').toLowerCase()}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* New Month Dialog */}
      <AlertDialog open={showNewMonthDialog} onOpenChange={setShowNewMonthDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              {t('message.confirm.new_month')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('message.description.new_month')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleNewMonth}>
              {t('actions.new_month')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};