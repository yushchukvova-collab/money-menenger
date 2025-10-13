import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

export const UserCounter = () => {
  const [count, setCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const registerVisitor = async () => {
      console.log('🔄 Starting visitor registration...');
      try {
        // Get or generate unique visitor ID
        let visitorId = localStorage.getItem('visitor_id');
        console.log('📝 Current visitor_id from localStorage:', visitorId);
        
        if (!visitorId) {
          // Generate new unique ID for new visitor
          visitorId = crypto.randomUUID();
          localStorage.setItem('visitor_id', visitorId);
          console.log('✨ Generated new visitor_id:', visitorId);
        }
        
        console.log('📞 Calling register_visitor function...');
        // Register visitor and get total count from database
        const { data, error } = await supabase.rpc('register_visitor', {
          visitor_id: visitorId
        });
        
        if (error) {
          console.error('❌ Error registering visitor:', error);
          // Fallback to getting count only
          console.log('📞 Trying get_visitor_count fallback...');
          const { data: countData, error: countError } = await supabase.rpc('get_visitor_count');
          if (countError) {
            console.error('❌ Error getting count:', countError);
          } else {
            console.log('✅ Count from fallback:', countData);
            setCount(countData || 0);
          }
        } else {
          console.log('✅ Successfully registered! Total count:', data);
          setCount(data || 0);
        }
      } catch (error) {
        console.error('❌ Error in visitor registration:', error);
      } finally {
        setIsLoading(false);
        console.log('✅ Registration complete');
      }
    };

    registerVisitor();
  }, []);

  // Animate number counting up
  useEffect(() => {
    if (count === 0) return;
    
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = count / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= count) {
        setDisplayCount(count);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [count]);

  // Show loading state or nothing if still loading
  if (isLoading) {
    console.log('⏳ Still loading...');
    return null;
  }

  // Show component only if count > 0
  if (count === 0) {
    console.log('⚠️ Count is 0, not showing component');
    return null;
  }

  console.log('✅ Rendering UserCounter with count:', count);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 md:bottom-6">
      <div className="bg-gradient-to-r from-primary/20 to-balance/20 backdrop-blur-md border border-primary/30 rounded-full px-4 py-2 md:px-6 md:py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center gap-2 md:gap-3">
          <Users className="h-4 w-4 md:h-5 md:w-5 text-primary animate-pulse" />
          <span className="text-sm md:text-base font-medium text-foreground">
            {t('userCounter.text').replace('{count}', displayCount.toString())}
          </span>
        </div>
      </div>
    </div>
  );
};
