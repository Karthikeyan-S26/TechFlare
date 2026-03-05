import { useState, useEffect, useCallback, useRef } from 'react';

export const useTimer = (seconds: number, onExpire: () => void) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpireRef.current();
      return;
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  const reset = useCallback((newSeconds?: number) => {
    setTimeLeft(newSeconds ?? seconds);
  }, [seconds]);

  return { timeLeft, reset, percentage: (timeLeft / seconds) * 100 };
};
