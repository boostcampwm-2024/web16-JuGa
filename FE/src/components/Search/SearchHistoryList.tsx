import { SearchHistoryItem } from './SearchHistoryItem.tsx';

type SearchHistoryListProps = {
  searchHistory: string[];
  onDeleteItem?: (item: string) => void;
};

export function SearchHistoryList({
  searchHistory,
  onDeleteItem,
}: SearchHistoryListProps) {
  return (
    <div className={'flex w-full flex-col pb-2'}>
      <div className={'mb-2 flex items-center justify-between'}>
        <div className={'text-start text-sm font-bold'}>최근 검색</div>
      </div>
      <div className='flex flex-wrap gap-2'>
        {searchHistory.map((item) => (
          <SearchHistoryItem key={item} item={item} onDelete={onDeleteItem} />
        ))}
      </div>
    </div>
  );
}
