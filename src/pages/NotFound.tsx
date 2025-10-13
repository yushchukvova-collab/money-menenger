import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl sm:text-8xl font-bold text-primary">{t('error.404')}</h1>
        <p className="text-xl sm:text-2xl text-muted-foreground">{t('error.page_not_found')}</p>
        <Button 
          onClick={() => window.location.href = '/'} 
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          {t('error.return_home')}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
