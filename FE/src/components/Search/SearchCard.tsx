import { searchDataType } from './searchDataType.ts';

type SearchCardProps = {
  data: searchDataType;
};

export default function SearchCard({ data }: SearchCardProps) {
  const { code, name, market } = data;

  return (
    <li
      className={
        'h-[52px] w-full rounded-xl hover:cursor-pointer hover:bg-gray-100'
      }
    >
      <div className={'my-2 flex w-full items-center justify-between px-4'}>
        <div className={'flex-1 flex-col'}>
          <p className={'text-left font-medium text-gray-900'}>{name}</p>
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
