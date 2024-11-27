import { useEffect, useState } from 'react';
import { formatNoSpecialChar } from './formatNoSpecialChar.ts';

export const useDebounce = (value: string, delay: number) => {
  const [debounceValue, setDebounceValue] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setIsDebouncing(true);

    const handler = setTimeout(() => {
      setDebounceValue(formatNoSpecialChar(value));
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return {
    debounceValue,
    isDebouncing,
  };
};
