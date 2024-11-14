import { useState, useEffect } from 'react';
import { HistoryType } from './searchDataType';

const STORAGE_KEY = 'searchHistory';
const MAX_HISTORY_ITEMS = 10;

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
      const filteredHistory = prev.filter((item) => item.text !== keyword);
      const newItem: HistoryType = {
        id: `${keyword}-${Date.now()}`,
        text: keyword,
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

  const clearSearchHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSearchHistory([]);
  };

  return {
    searchHistory,
    addSearchHistory,
    deleteSearchHistory,
    clearSearchHistory,
  };
}
