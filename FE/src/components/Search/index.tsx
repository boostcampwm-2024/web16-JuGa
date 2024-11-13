import { useState, useEffect } from 'react';
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
        className={`${searchInput.length ? 'h-[520px]' : 'h-[160px]'} fixed left-1/2 top-3 w-[640px] -translate-x-1/2 rounded-2xl bg-white shadow-xl`}
      >
        <div
          className={
            'absolute left-0 right-0 top-0 z-10 rounded-t-2xl bg-white p-3'
          }
        >
          <SearchInput value={searchInput} onChange={setSearchInput} />
        </div>

        <div className={'h-full px-3 pb-3 pt-[68px]'}>
          {' '}
          {!searchInput ? (
            <SearchHistoryList
              searchHistory={searchHistory}
              onDeleteItem={handleDeleteHistoryItem}
            />
          ) : (
            <div className={'h-full'}>
              <div className={'mb-4 text-start text-sm font-bold'}>
                검색 결과
              </div>

              <div className={'h-[400px] overflow-y-auto'}>
                {isSearching ? (
                  <div className={'flex h-full items-center justify-center'}>
                    <span className={'text-gray-500'}>검색 중...</span>
                  </div>
                ) : (
                  showSearchResults && <SearchList searchData={data} />
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
