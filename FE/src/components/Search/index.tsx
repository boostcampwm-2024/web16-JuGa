import { useState, useEffect, Suspense } from 'react';
import useSearchModalStore from 'store/useSearchModalStore';
import Overlay from '../ModalOveray.tsx';
import { SearchInput } from './SearchInput';
import { SearchHistoryList } from './SearchHistoryList';
import SearchList from './SearchList.tsx';
import useSearchInputStore from '../../store/useSearchInputStore.ts';
import { useDebounce } from '../../utils/useDebounce.ts';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../../service/searchApi.ts';

export default function SearchModal() {
  const { isOpen, toggleSearchModal } = useSearchModalStore();
  const { searchInput, setSearchInput } = useSearchInputStore();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const shouldSearch = searchInput.trim().length >= 2;

  const { debounceValue, isDebouncing } = useDebounce(
    shouldSearch ? searchInput : '',
    500,
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', debounceValue],
    queryFn: () => searchApi(debounceValue),
    enabled: !!debounceValue && !isDebouncing,
  });

  useEffect(() => {
    setSearchHistory(['서산증권', '삼성화재', '삼성전기']);
  }, []);

  const handleDeleteHistoryItem = (item: string) => {
    setSearchHistory((prev) => prev.filter((history) => history !== item));
  };

  if (!isOpen) return null;

  const isSearching = isLoading || isFetching || isDebouncing;
  const showSearchResults = searchInput && !isSearching && data;

  return (
    <>
      <Overlay onClick={() => toggleSearchModal()} />
      <section
        className={`${
          searchInput ? 'h-[520px]' : ''
        } fixed left-1/2 top-3 flex w-[640px] -translate-x-1/2 flex-col rounded-2xl bg-white shadow-lg`}
      >
        <div className='flex h-full flex-col p-3'>
          <div className='mb-5'>
            <SearchInput value={searchInput} onChange={setSearchInput} />
          </div>
          <div className='flex-1 overflow-hidden'>
            {!searchInput && (
              <SearchHistoryList
                searchHistory={searchHistory}
                onDeleteItem={handleDeleteHistoryItem}
              />
            )}
            {isSearching && (
              <div className='flex items-center justify-center'>
                <span>검색 중...</span>
              </div>
            )}
            {showSearchResults && (
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
