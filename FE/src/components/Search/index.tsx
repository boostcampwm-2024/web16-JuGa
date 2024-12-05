import { useEffect } from 'react';
import useSearchModalStore from 'store/useSearchModalStore';
import Overlay from 'components/ModalOveray.tsx';
import { SearchInput } from './SearchInput';
import { SearchHistoryList } from './SearchHistoryList';
import SearchList from './SearchList.tsx';
import useSearchInputStore from 'store/useSearchInputStore.ts';
import { useDebounce } from 'hooks/useDebounce.ts';
import { useQuery } from '@tanstack/react-query';
import Lottie from 'lottie-react';
import searchAnimation from 'assets/searchAnimation.json';
import { useSearchHistory } from 'hooks/useSearchHistoryHook.ts';
import { getSearchResults } from 'service/search.ts';
import { formatNoSpecialChar } from 'utils/format.ts';
import { SimpleKoreanConverter } from './KoreanMapping.ts';
import * as Hangul from 'hangul-js';

export default function SearchModal() {
  const { isOpen, toggleSearchModal } = useSearchModalStore();
  const { searchInput, setSearchInput } = useSearchInputStore();
  const { searchHistory, addSearchHistory, deleteSearchHistory } =
    useSearchHistory();
  const shouldSearch = searchInput.trim().length >= 2;
  const converter = new SimpleKoreanConverter();

  const { debounceValue, isDebouncing } = useDebounce(
    shouldSearch ? searchInput : '',
    500,
  );

  const {
    data: originalData,
    isLoading: isOriginalLoading,
    isFetching: isOriginalFetching,
  } = useQuery({
    queryKey: ['search', debounceValue],
    queryFn: () => getSearchResults(formatNoSpecialChar(debounceValue)),
    enabled: !!debounceValue && !isDebouncing,
    staleTime: 10000,
    cacheTime: 1000 * 60,
  });
  const convertedSearch = debounceValue
    ? Hangul.assemble(converter.convert(debounceValue))
    : '';

  const {
    data: convertedData,
    isLoading: isConvertedLoading,
    isFetching: isConvertedFetching,
  } = useQuery({
    queryKey: ['search', convertedSearch],
    queryFn: () => getSearchResults(formatNoSpecialChar(convertedSearch)),
    enabled:
      !isOriginalLoading &&
      !isOriginalFetching &&
      !!convertedSearch &&
      originalData !== undefined &&
      originalData.length === 0,
    staleTime: 10000,
    cacheTime: 1000 * 60,
  });

  const data = originalData?.length ? originalData : convertedData || [];
  const isLoading = isOriginalLoading || isConvertedLoading;
  const isFetching = isOriginalFetching || isConvertedFetching;

  useEffect(() => {
    if (data && data.length > 0 && debounceValue && !isLoading) {
      addSearchHistory(formatNoSpecialChar(debounceValue));
    }
  }, [data, debounceValue, addSearchHistory, isLoading]);

  if (!isOpen) return null;

  const isSearching = isLoading || isFetching || isDebouncing;
  const showSearchResults = searchInput && !isSearching && data;

  return (
    <div className='z-30'>
      <Overlay onClick={() => toggleSearchModal()} />
      <section
        className={`${searchInput.length ? 'h-[520px]' : ''} fixed left-1/2 top-3 w-4/5 -translate-x-1/2 rounded-2xl bg-white shadow-xl md:w-[640px]`}
      >
        <div
          className={'absolute left-0 right-0 top-0 rounded-t-2xl bg-white p-3'}
        >
          <SearchInput value={searchInput} onChange={setSearchInput} />
        </div>

        <div className={'h-full px-3 pb-3 pt-[68px]'}>
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
                  <div
                    className={
                      'flex h-[320px] flex-col items-center justify-center'
                    }
                  >
                    <Lottie
                      animationData={searchAnimation}
                      className='h-[200px]'
                    />
                    <p className='font-bold text-juga-grayscale-black'>
                      두 글자 이상의 검색어를 입력해주세요.
                    </p>
                  </div>
                ) : (
                  showSearchResults && <SearchList searchData={data} />
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
