import { SearchHistoryItem } from './SearchHistoryItem.tsx';
import { HistoryType } from './type.ts';

type SearchHistoryListProps = {
  searchHistory: HistoryType[];
  onDeleteItem: (item: string) => void;
};

export function SearchHistoryList({
  searchHistory,
  onDeleteItem,
}: SearchHistoryListProps) {
  if (searchHistory.length === 0) return;

  return (
    <div className={'flex w-full flex-col pb-2'}>
      <div className={'mb-2 flex items-center justify-between'}>
        <div className={'text-start text-sm font-bold'}>최근 검색</div>
      </div>
      <div className='flex flex-wrap gap-2'>
        {searchHistory.map((item: HistoryType) => (
          <SearchHistoryItem
            key={item.id}
            item={item.text}
            onDelete={onDeleteItem}
          />
        ))}
      </div>
    </div>
  );
}
