import { useEffect } from 'react';
import useSearchModalStore from 'store/useSearchModalStore';
import Overlay from 'components/ModalOveray.tsx';
import { SearchInput } from './SearchInput';
import { SearchHistoryList } from './SearchHistoryList';
import SearchList from './SearchList.tsx';
import useSearchInputStore from 'store/useSearchInputStore.ts';
import { useDebounce } from 'utils/useDebounce.ts';
import { useQuery } from '@tanstack/react-query';
import { getSearchResults } from 'service/getSearchResults.ts';
import Lottie from 'lottie-react';
import searchAnimation from 'assets/searchAnimation.json';
import { useSearchHistory } from './searchHistoryHook.ts';
import { formatNoSpecialChar } from '../../utils/formatNoSpecialChar.ts';

export default function SearchModal() {
  const { isOpen, toggleSearchModal } = useSearchModalStore();
  const { searchInput, setSearchInput } = useSearchInputStore();
  const { searchHistory, addSearchHistory, deleteSearchHistory } =
    useSearchHistory();
  const shouldSearch = searchInput.trim().length >= 2;

  const { debounceValue, isDebouncing } = useDebounce(
    shouldSearch ? searchInput : '',
    500,
  );
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', debounceValue],
    queryFn: () => getSearchResults(formatNoSpecialChar(debounceValue)),
    enabled: !!debounceValue && !isDebouncing,
    staleTime: 1000,
    cacheTime: 1000 * 60,
  });

  useEffect(() => {
    if (data && data.length > 0 && debounceValue && !isLoading) {
      addSearchHistory(formatNoSpecialChar(debounceValue));
    }
  }, [data, debounceValue]);

  if (!isOpen) return null;

  const isSearching = isLoading || isFetching || isDebouncing;
  const showSearchResults = searchInput && !isSearching && data;

  return (
    <>
      <Overlay onClick={() => toggleSearchModal()} />
      <section
        className={`${searchInput.length ? 'h-[520px]' : 'h-[140px]'} fixed left-1/2 top-3 z-20 w-[640px] -translate-x-1/2 rounded-2xl bg-white shadow-xl`}
      >
        <div
          className={'absolute left-0 right-0 top-0 rounded-t-2xl bg-white p-3'}
        >
          <SearchInput value={searchInput} onChange={setSearchInput} />
        </div>

        <div className={'h-full px-3 pb-3 pt-[68px]'}>
          {' '}
          {!searchInput ? (
            <SearchHistoryList
              searchHistory={searchHistory}
              onDeleteItem={deleteSearchHistory}
            />
          ) : (
            <div className={'h-full'}>
              <div className={'mb-4 text-start text-sm font-bold'}>
                검색 결과
              </div>

              <div className={'h-[400px] overflow-y-auto'}>
                {isSearching ? (
                  <div className={'flex h-full items-center justify-center'}>
                    <Lottie animationData={searchAnimation} />
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
