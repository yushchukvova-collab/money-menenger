import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage, Currency } from "@/contexts/LanguageContext";

export const CurrencySelector = () => {
  const { currency, setCurrency, t } = useLanguage();

  const currencies = [
    { code: 'USD' as Currency, name: t('currency.usd'), symbol: '$' },
    { code: 'EUR' as Currency, name: t('currency.eur'), symbol: '€' },
    { code: 'UAH' as Currency, name: t('currency.uah'), symbol: '₴' },
    { code: 'PLN' as Currency, name: t('currency.pln'), symbol: 'zł' },
    { code: 'GBP' as Currency, name: t('currency.gbp'), symbol: '£' },
  ];

  const currentCurrency = currencies.find(curr => curr.code === currency);

  return (
    <Select value={currency} onValueChange={setCurrency}>
      <SelectTrigger className="gap-2 min-w-[100px] md:min-w-[120px] h-9 px-3 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentCurrency?.symbol} {currentCurrency?.code}
          </span>
          <span className="sm:hidden">
            {currentCurrency?.symbol}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-popover border-border">
        {currencies.map((curr) => (
          <SelectItem 
            key={curr.code} 
            value={curr.code}
            className="cursor-pointer hover:bg-accent"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono">{curr.symbol}</span>
              <span>{curr.code}</span>
              <span className="text-muted-foreground text-sm hidden md:inline">
                - {curr.name}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};