import { useState, useEffect } from 'react';
import useSearchModalStore from '../../store/useSearchModalStore';
import Overlay from '../../utils/ModalOveray';
import { SearchInput } from './SearchInput';
import { SearchHistoryList } from './SearchHistoryList';

export default function SearchModal() {
  const { isOpen, toggleSearchModal } = useSearchModalStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    setSearchHistory(['서산증권', '삼성화재', '삼성전기']);
  }, []);

  const handleDeleteHistoryItem = (item: string) => {
    setSearchHistory((prev) => prev.filter((history) => history !== item));
  };

  if (!isOpen) return;

  return (
    <>
      <Overlay onClick={() => toggleSearchModal()} />
      <section className='fixed left-1/2 top-3 flex w-[640px] -translate-x-1/2 flex-col rounded-2xl bg-white shadow-lg'>
        <div className={'flex flex-col gap-5 p-3'}>
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
          <SearchHistoryList
            searchHistory={searchHistory}
            onDeleteItem={handleDeleteHistoryItem}
          />
        </div>
      </section>
    </>
  );
}
