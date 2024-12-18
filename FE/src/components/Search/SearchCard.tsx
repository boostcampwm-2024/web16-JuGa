import { useNavigate } from 'react-router-dom';
import useSearchModalStore from 'store/useSearchModalStore.ts';
import useSearchInputStore from 'store/useSearchInputStore.ts';
import { SearchCardHighLight } from './SearchCardHighlight.tsx';
import { SearchDataType } from './type.ts';

type SearchCardProps = {
  data: SearchDataType;
};

export default function SearchCard({ data }: SearchCardProps) {
  const { code, name, market } = data;
  const { isOpen, toggleSearchModal } = useSearchModalStore();
  const { searchInput } = useSearchInputStore();

  const navigation = useNavigate();

  const handleClick = () => {
    navigation(`/stocks/${code}`);
    if (isOpen) toggleSearchModal();
  };

  return (
    <li
      className={
        'h-[52px] w-full rounded-xl hover:cursor-pointer hover:bg-gray-100'
      }
      onMouseDown={handleClick}
    >
      <div className={'my-2 flex w-full items-center justify-between px-4'}>
        <div className={'flex-1 flex-col'}>
          <div className='text-left font-medium text-gray-900'>
            <SearchCardHighLight text={name} highlight={searchInput} />
          </div>
          <div className={'text-left text-xs font-normal text-gray-500'}>
            {code}
          </div>
        </div>

        <div className={'flex flex-col items-end justify-center gap-0.5'}>
          <p className={'text-right text-xs font-medium text-gray-600'}>
            {market}
          </p>
        </div>
      </div>
    </li>
  );
}
