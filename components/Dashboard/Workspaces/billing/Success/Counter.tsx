// components/BillingSuccess/Counter.tsx
import { useEffect, useState } from 'react';
import type { CounterProps } from '@/types/billing.success.types';

export function Counter({ to, suffix = '' }: CounterProps) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / 40);
    const timer = setInterval(() => {
      start = Math.min(start + step, to);
      setVal(start);
      if (start >= to) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [to]);

  return (
    <span>
      {val}
      {suffix}
    </span>
  );
}