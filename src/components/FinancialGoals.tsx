import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Car, Home, Plane, GraduationCap, 
  Plus, Target, Calendar, Edit, Trash2
} from "lucide-react";
import { FinancialGoal } from "@/hooks/useFinanceData";
import { useState } from "react";
import { AddGoalModal } from "./AddGoalModal";
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
import { useLanguage } from "@/contexts/LanguageContext";

interface FinancialGoalsProps {
  goals: FinancialGoal[];
  onAddGoal: (goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => void;
  onUpdateGoal: (goalId: string, updates: Partial<FinancialGoal>) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const FinancialGoals = ({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }: FinancialGoalsProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editGoal, setEditGoal] = useState<FinancialGoal | undefined>();
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);
  const { toast } = useToast();
  const { t, formatCurrency } = useLanguage();

  const calculateDaysLeft = (deadline: string) => {
    const today = new Date();
    const target = new Date(deadline);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateMonthlyNeed = (targetAmount: number, currentAmount: number, deadline: string) => {
    const remaining = targetAmount - currentAmount;
    const daysLeft = calculateDaysLeft(deadline);
    const monthsLeft = Math.max(daysLeft / 30, 1);
    return remaining / monthsLeft;
  };

  const getGoalIcon = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('car') || titleLower.includes('авто') || titleLower.includes('samoch')) return Car;
    if (titleLower.includes('house') || titleLower.includes('квартир') || titleLower.includes('будинок') || titleLower.includes('mieszk') || titleLower.includes('dom')) return Home;
    if (titleLower.includes('trip') || titleLower.includes('vacation') || titleLower.includes('відпустк') || titleLower.includes('подорож') || titleLower.includes('wakacje')) return Plane;
    if (titleLower.includes('educat') || titleLower.includes('навчанн') || titleLower.includes('курс') || titleLower.includes('edukacj')) return GraduationCap;
    return Target;
  };

  const handleDeleteGoal = (goalId: string) => {
    onDeleteGoal(goalId);
    setDeleteGoalId(null);
    toast({
      title: t('goals.deleted'),
      description: t('goals.deleted_description'),
    });
  };

  const handleEditGoal = (goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => {
    if (editGoal) {
      onUpdateGoal(editGoal.id, goal);
      setEditGoal(undefined);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('goals.title')}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-1" />
            {t('goals.add')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('goals.no_goals')}</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => setShowAddModal(true)}
              >
                {t('goals.create_first')}
              </Button>
            </div>
          ) : (
            <>
              {goals.map((goal) => {
                const IconComponent = getGoalIcon(goal.title);
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                const daysLeft = calculateDaysLeft(goal.deadline);
                const monthlyNeed = calculateMonthlyNeed(
                  goal.targetAmount, 
                  goal.currentAmount, 
                  goal.deadline
                );
                
                return (
                  <div key={goal.id} className="space-y-3 p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/20">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{goal.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {daysLeft > 0 
                                ? `${daysLeft} ${t('goals.days_left')}`
                                : t('goals.overdue')
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {formatCurrency(goal.currentAmount)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t('common.from')} {formatCurrency(goal.targetAmount)}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditGoal(goal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setDeleteGoalId(goal.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Progress 
                        value={Math.min(progress, 100)} 
                        className="h-2"
                      />
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {Math.round(progress)}% {t('common.used')}
                        </span>
                        {monthlyNeed > 0 && (
                          <span className="font-medium text-primary">
                            {formatCurrency(monthlyNeed)}{t('goals.per_month')}
                          </span>
                        )}
                      </div>
                    </div>

                    {progress >= 100 && (
                      <div className="text-sm text-income font-medium flex items-center gap-1">
                        🎉 {t('goals.completed')}
                      </div>
                    )}
                  </div>
                );
              })}
              
              <div className="pt-4 border-t">
                <div className="text-center text-sm text-muted-foreground">
                  {t('common.total_progress')}: {goals.filter(g => (g.currentAmount / g.targetAmount) >= 1).length} {t('common.of')} {goals.length} {t('common.goals_achieved')}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Add Goal Modal */}
        <AddGoalModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={onAddGoal}
        />
        
        {/* Edit Goal Modal */}
        <AddGoalModal
          open={!!editGoal}
          onClose={() => setEditGoal(undefined)}
          onSave={handleEditGoal}
          editGoal={editGoal}
        />
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteGoalId} onOpenChange={() => setDeleteGoalId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-destructive" />
                {t('goals.delete_confirm')}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t('goals.delete_description')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteGoalId && handleDeleteGoal(deleteGoalId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t('actions.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};