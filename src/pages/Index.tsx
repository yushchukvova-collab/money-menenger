import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, Target, PiggyBank, Settings, Menu, X } from "lucide-react";
import { BalanceCard } from "@/components/BalanceCard";
import { QuickAddTransaction } from "@/components/QuickAddTransaction";
import { CategoryOverview } from "@/components/CategoryOverview";
import { RecentTransactions } from "@/components/RecentTransactions";
import { FinancialGoals } from "@/components/FinancialGoals";
import { ExpenseChart } from "@/components/ExpenseChart";
import { InitialBalanceModal } from "@/components/InitialBalanceModal";
import { ManagementActions } from "@/components/ManagementActions";
import { CategoryManagement } from "@/components/CategoryManagement";
import { LanguageSelector } from "@/components/LanguageSelector";
import { CurrencySelector } from "@/components/CurrencySelector";
import { UserCounter } from "@/components/UserCounter";
import { useFinanceData } from "@/hooks/useFinanceData";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showInitialBalance, setShowInitialBalance] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { t, formatCurrency } = useLanguage();
  
  const { 
    data, 
    setInitialBalance, 
    addTransaction, 
    clearAllData, 
    startNewMonth, 
    getMonthlyStats,
    addGoal,
    updateGoal,
    deleteGoal,
    addAmountToGoal,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategorySpending
  } = useFinanceData();

  const monthlyStats = getMonthlyStats();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-balance bg-clip-text text-transparent">
                {t('app.title')}
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <LanguageSelector />
              <CurrencySelector />
              <ManagementActions 
                onClearAll={clearAllData}
                onNewMonth={startNewMonth}
              />
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowInitialBalance(true)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                {t('header.balance')}
              </Button>
              <Button 
                size="sm"
                onClick={() => setShowAddTransaction(true)}
                className="bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('header.add')}
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-3 space-y-3">
              <div className="flex gap-2">
                <LanguageSelector />
                <CurrencySelector />
              </div>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowInitialBalance(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start gap-2"
              >
                <Settings className="h-4 w-4" />
                {t('header.balance')}
              </Button>
              <div className="flex gap-2">
                <ManagementActions 
                  onClearAll={() => {
                    clearAllData();
                    setMobileMenuOpen(false);
                  }}
                  onNewMonth={() => {
                    startNewMonth();
                    setMobileMenuOpen(false);
                  }}
                  isMobile={true}
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-20 md:pb-6">
        {/* Balance Overview */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <BalanceCard
            title={t('balance.total')}
            amount={formatCurrency(monthlyStats.balance)}
            icon={PiggyBank}
            trend="+5.2%"
            type="balance"
          />
          <BalanceCard
            title={t('balance.income.month')}
            amount={formatCurrency(monthlyStats.totalIncome)}
            icon={TrendingUp}
            trend="+12.4%"
            type="income"
          />
          <BalanceCard
            title={t('balance.expenses.month')}
            amount={formatCurrency(monthlyStats.totalExpenses)}
            icon={TrendingDown}
            trend="-3.1%"
            type="expense"
          />
          <BalanceCard
            title={t('balance.savings.rate')}
            amount={`${monthlyStats.savingsRate}%`}
            icon={Target}
            trend="+2.1%"
            type="savings"
          />
        </div>

        {/* Charts and Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <ExpenseChart transactions={data.transactions} expenseCategories={data.expenseCategories} />
          <CategoryOverview transactions={data.transactions} expenseCategories={data.expenseCategories} />
        </div>

        {/* Category Management and Financial Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <CategoryManagement 
            incomeCategories={data.incomeCategories}
            expenseCategories={data.expenseCategories}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
            getCategorySpending={getCategorySpending}
          />
          <FinancialGoals
            goals={data.goals}
            onAddGoal={addGoal}
            onUpdateGoal={updateGoal}
            onDeleteGoal={deleteGoal}
          />
        </div>

        {/* Recent Transactions */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <RecentTransactions transactions={data.transactions} />
        </div>
      </main>

      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-6 right-4 md:hidden z-40">
        <Button
          onClick={() => setShowAddTransaction(true)}
          size="lg"
          className="rounded-full w-14 h-14 p-0 bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg shadow-xl transition-all duration-300"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* User Counter */}
      <UserCounter />

      {/* Quick Add Transaction Modal */}
      {showAddTransaction && (
        <QuickAddTransaction 
          onClose={() => setShowAddTransaction(false)} 
          onAdd={addTransaction}
          goals={data.goals}
          incomeCategories={data.incomeCategories}
          expenseCategories={data.expenseCategories}
        />
      )}

      {/* Initial Balance Modal */}
      <InitialBalanceModal
        open={showInitialBalance}
        onClose={() => setShowInitialBalance(false)}
        onSave={setInitialBalance}
        currentBalance={data.initialBalance}
      />
    </div>
  );
};

export default Index;