import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useTabDetection = (studentId: string | undefined) => {
  const countRef = useRef(0);

  useEffect(() => {
    if (!studentId) return;

    const handleVisibility = () => {
      if (document.hidden) {
        countRef.current++;
        supabase.from('violations').insert({ student_id: studentId, type: 'tab_switch' });
        if (countRef.current === 1) {
          toast({ title: '⚠️ Warning', description: 'Tab switching detected! This has been logged.', variant: 'destructive' });
        }
      }
    };

    const handleBlur = () => {
      countRef.current++;
      supabase.from('violations').insert({ student_id: studentId, type: 'window_blur' });
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
    };
  }, [studentId]);
};
