import { create } from 'zustand';

interface SearchInputStore {
  searchInput: string;
  setSearchInput: (input: string) => void;
  resetSearchInput: () => void;
}

const useSearchInputStore = create<SearchInputStore>((set) => ({
  searchInput: '',

  setSearchInput: (input: string) => {
    set({ searchInput: input });
  },

  resetSearchInput: () => {
    set({ searchInput: '' });
  },
}));

export default useSearchInputStore;
