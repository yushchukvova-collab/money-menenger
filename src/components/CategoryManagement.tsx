import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit, Plus, ShoppingBag, Car, Home, Gamepad2, Heart, Coffee, Shirt, BookOpen, Wallet, Briefcase, TrendingUp, Gift } from "lucide-react";
import { Category } from "@/hooks/useFinanceData";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const iconOptions = [
  { value: 'ShoppingBag', icon: ShoppingBag },
  { value: 'Car', icon: Car },
  { value: 'Home', icon: Home },
  { value: 'Gamepad2', icon: Gamepad2 },
  { value: 'Heart', icon: Heart },
  { value: 'Coffee', icon: Coffee },
  { value: 'Shirt', icon: Shirt },
  { value: 'BookOpen', icon: BookOpen },
  { value: 'Wallet', icon: Wallet },
  { value: 'Briefcase', icon: Briefcase },
  { value: 'TrendingUp', icon: TrendingUp },
  { value: 'Gift', icon: Gift }
];

const colorOptions = [
  { value: 'bg-category-food', color: 'bg-green-500' },
  { value: 'bg-category-transport', color: 'bg-blue-500' },
  { value: 'bg-category-housing', color: 'bg-purple-500' },
  { value: 'bg-category-entertainment', color: 'bg-pink-500' },
  { value: 'bg-category-health', color: 'bg-red-500' },
  { value: 'bg-category-shopping', color: 'bg-yellow-500' }
];

interface CategoryManagementProps {
  incomeCategories: Category[];
  expenseCategories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>, type: 'income' | 'expense') => void;
  onUpdateCategory: (categoryId: string, updates: Partial<Category>, type: 'income' | 'expense') => void;
  onDeleteCategory: (categoryId: string, type: 'income' | 'expense') => void;
  getCategorySpending: (categoryId: string) => number;
}

export const CategoryManagement = ({
  incomeCategories,
  expenseCategories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  getCategorySpending
}: CategoryManagementProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryType, setCategoryType] = useState<'income' | 'expense'>('expense');
  const [formData, setFormData] = useState({
    name: '',
    limit: '',
    icon: 'ShoppingBag',
    color: 'bg-category-food'
  });

  const { t, formatCurrency } = useLanguage();

  const getIconLabel = (iconName: string) => {
    const iconMap: Record<string, string> = {
      ShoppingBag: t('icons.shopping_bag'),
      Car: t('icons.car'),
      Home: t('icons.house'),
      Gamepad2: t('icons.games'),
      Heart: t('icons.health'),
      Coffee: t('icons.coffee'),
      Shirt: t('icons.clothing'),
      BookOpen: t('icons.education'),
      Wallet: 'Wallet',
      Briefcase: 'Briefcase',
      TrendingUp: 'Investment',
      Gift: 'Gift'
    };
    return iconMap[iconName] || iconName;
  };

  const getColorLabel = (colorValue: string) => {
    const colorMap: Record<string, string> = {
      'bg-category-food': t('colors.green'),
      'bg-category-transport': t('colors.blue'),
      'bg-category-housing': t('colors.purple'),
      'bg-category-entertainment': t('colors.pink'),
      'bg-category-health': t('colors.red'),
      'bg-category-shopping': t('colors.yellow')
    };
    return colorMap[colorValue] || colorValue;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      limit: '',
      icon: 'ShoppingBag',
      color: 'bg-category-food'
    });
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error(t('categories.fill_all_fields'));
      return;
    }

    // Validate limit only for expense categories
    if (categoryType === 'expense' && !formData.limit) {
      toast.error(t('categories.fill_all_fields'));
      return;
    }

    const categoryData: Omit<Category, 'id'> = {
      name: formData.name.trim(),
      icon: formData.icon,
      color: formData.color,
      ...(categoryType === 'expense' && { limit: parseFloat(formData.limit) })
    };

    if (editingCategory) {
      onUpdateCategory(editingCategory.id, categoryData, categoryType);
      toast.success(t('categories.updated'));
    } else {
      onAddCategory(categoryData, categoryType);
      toast.success(t('categories.added'));
    }

    resetForm();
    setShowAddDialog(false);
  };

  const handleEdit = (category: Category, type: 'income' | 'expense') => {
    setEditingCategory(category);
    setCategoryType(type);
    setFormData({
      name: category.name,
      limit: category.limit?.toString() || '',
      icon: category.icon,
      color: category.color
    });
    setShowAddDialog(true);
  };

  const handleDelete = (categoryId: string, type: 'income' | 'expense') => {
    if (type === 'expense') {
      const spending = getCategorySpending(categoryId);
      if (spending > 0) {
        toast.error(t('categories.cannot_delete'));
        return;
      }
    }
    
    onDeleteCategory(categoryId, type);
    toast.success(t('categories.deleted'));
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : ShoppingBag;
  };

  const renderCategoryList = (categories: Category[], type: 'income' | 'expense') => (
    <div className="space-y-3">
      {categories.map((category) => {
        const IconComponent = getIconComponent(category.icon);
        const spent = type === 'expense' ? getCategorySpending(category.id) : 0;
        const percentage = category.limit ? (spent / category.limit) * 100 : 0;
        const isOverLimit = percentage > 100;
        
        return (
          <div 
            key={category.id} 
            className={`p-3 rounded-lg border ${isOverLimit ? 'border-expense bg-expense/5' : 'border-border'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${category.color}/20`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">{category.name}</div>
                  {type === 'expense' && category.limit && (
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(spent)} / {formatCurrency(category.limit)}
                      {isOverLimit && (
                        <span className="text-expense font-medium ml-2">
                          {t('categories.over_limit')}!
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(category, type)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(category.id, type)}
                  className="h-8 w-8 p-0 text-expense hover:text-expense"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
      
      {categories.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <p>{t('categories.no_categories')}</p>
          <p className="text-sm">{t('categories.add_first')}</p>
        </div>
      )}
    </div>
  );

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t('categories.title')}</CardTitle>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                {t('categories.add')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? t('categories.edit') : t('categories.add')}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Tabs value={categoryType} onValueChange={(v) => setCategoryType(v as 'income' | 'expense')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="expense">{t('transactions.expense')}</TabsTrigger>
                    <TabsTrigger value="income">{t('transactions.income')}</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-2">
                  <Label htmlFor="name">{t('categories.name')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t('categories.placeholder')}
                    className="h-11"
                  />
                </div>

                {categoryType === 'expense' && (
                  <div className="space-y-2">
                    <Label htmlFor="limit">{t('categories.limit')} ({t('common.per_month')})</Label>
                    <Input
                      id="limit"
                      type="number"
                      value={formData.limit}
                      onChange={(e) => setFormData(prev => ({ ...prev, limit: e.target.value }))}
                      placeholder="3000"
                      className="h-11"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('categories.icon')}</Label>
                    <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                {getIconLabel(option.value)}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('categories.color')}</Label>
                    <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded ${option.color}`} />
                              {getColorLabel(option.value)}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1">
                    {editingCategory ? t('actions.edit') : t('actions.add')}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddDialog(false)}
                    className="flex-1"
                  >
                    {t('actions.cancel')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="expense" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense">{t('transactions.expense')}</TabsTrigger>
            <TabsTrigger value="income">{t('transactions.income')}</TabsTrigger>
          </TabsList>
          <TabsContent value="expense" className="mt-4">
            {renderCategoryList(expenseCategories, 'expense')}
          </TabsContent>
          <TabsContent value="income" className="mt-4">
            {renderCategoryList(incomeCategories, 'income')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};