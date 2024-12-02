import { useState, useEffect } from 'react';
import { HistoryType } from '../components/Search/type.ts';

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY;
const MAX_HISTORY_ITEMS = import.meta.env.VITE_MAX_HISTORY_ITEMS;
export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<HistoryType[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem(STORAGE_KEY);
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  const addSearchHistory = (keyword: string) => {
    if (!keyword.trim()) return;

    setSearchHistory((prev) => {
      const filteredHistory = prev.filter(
        (item) => item.text.trim() !== keyword.trim(),
      );
      const newItem: HistoryType = {
        id: `${keyword}-${Date.now()}`,
        text: keyword.trim(),
        timestamp: new Date().toISOString(),
      };
      const newHistory = [newItem, ...filteredHistory].slice(
        0,
        MAX_HISTORY_ITEMS,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const deleteSearchHistory = (text: string) => {
    setSearchHistory((prev) => {
      const newHistory = prev.filter((item) => item.text !== text);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  return {
    searchHistory,
    addSearchHistory,
    deleteSearchHistory,
  };
}
