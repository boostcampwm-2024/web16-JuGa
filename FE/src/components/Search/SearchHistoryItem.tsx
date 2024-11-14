import { XMarkIcon } from '@heroicons/react/16/solid';
import useSearchInputStore from '../../store/useSearchInputStore.ts';

type SearchHistoryItemProps = {
  item: string;
  onDelete: (item: string) => void;
};

export function SearchHistoryItem({ item, onDelete }: SearchHistoryItemProps) {
  const { setSearchInput } = useSearchInputStore();
  return (
    <div className='group flex items-center gap-1 rounded-full bg-gray-100 py-[2px] pl-3 pr-1 hover:cursor-pointer'>
      <span className='text-sm' onClick={() => setSearchInput(item)}>
        {item}
      </span>
      <button
        className='h-4 w-4 rounded-2xl p-0.5'
        onClick={() => onDelete(item)}
      >
        <XMarkIcon />
      </button>
    </div>
  );
}
