import { XMarkIcon } from '@heroicons/react/16/solid';

interface SearchHistoryItemProps {
  item: string;
  onDelete?: (item: string) => void;
}

export function SearchHistoryItem({ item, onDelete }: SearchHistoryItemProps) {
  return (
    <div className='group flex items-center gap-1 rounded-full bg-gray-100 py-[2px] pl-3 pr-1'>
      <span className='text-sm'>{item}</span>
      <button
        className='h-4 w-4 rounded-2xl p-0.5'
        onClick={() => onDelete?.(item)}
      >
        <XMarkIcon />
      </button>
    </div>
  );
}
