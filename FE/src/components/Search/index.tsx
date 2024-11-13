import { useState, useEffect } from 'react';
import useSearchModalStore from 'store/useSearchModalStore';
import Overlay from '../ModalOveray.tsx';
import { SearchInput } from './SearchInput';
import { SearchHistoryList } from './SearchHistoryList';
import SearchList from './SearchList.tsx';
import useSearchInputStore from '../../store/useSearchInputStore.ts';
import { useDebounce } from '../../utils/useDebounce.ts';

export default function SearchModal() {
  const { isOpen, toggleSearchModal } = useSearchModalStore();
  const { searchInput, setSearchInput } = useSearchInputStore();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const debouncedSearch = useDebounce({ value: searchInput, delay: 500 });

  useEffect(() => {
    setSearchHistory(['서산증권', '삼성화재', '삼성전기']);
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      fetchSearchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  const handleDeleteHistoryItem = (item: string) => {
    setSearchHistory((prev) => prev.filter((history) => history !== item));
  };

  const fetchSearchResults = async (searchInput: string) => {
    console.log(searchInput);
  };

  if (!isOpen) return null;

  return (
    <>
      <Overlay onClick={() => toggleSearchModal()} />
      <section
        className={`${searchInput === '' ? '' : 'h-[520px]'} fixed left-1/2 top-3 flex w-[640px] -translate-x-1/2 flex-col rounded-2xl bg-white shadow-lg`}
      >
        <div className='flex h-full flex-col p-3'>
          <div className='mb-5'>
            <SearchInput value={searchInput} onChange={setSearchInput} />
          </div>
          <div className='flex-1 overflow-hidden'>
            <SearchHistoryList
              searchHistory={searchHistory}
              onDeleteItem={handleDeleteHistoryItem}
            />
            {searchInput === '' ? (
              <></>
            ) : (
              <div className='h-full overflow-y-auto'>
                <SearchList />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
