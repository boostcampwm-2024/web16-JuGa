import { useNavigate } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/16/solid';
import useBookmark from 'hooks/useBookmark';

export default function BookMark() {
  const navigation = useNavigate();

  const handleClick = (code: string) => {
    navigation(`/stocks/${code}`);
  };

  const { bookmarkQuery, unlike } = useBookmark();

  const { data } = bookmarkQuery;

  return (
    <div className='mx-auto flex min-h-[500px] w-full flex-1 flex-col rounded-md bg-white p-4 shadow-md'>
      <div className='flex pb-2 text-sm font-bold border-b'>
        <p className='w-1/2 text-left truncate'>종목</p>
        <p className='w-1/4 text-center'>현재가</p>
        <p className='w-1/4 text-right'>등락률</p>
        <p className='w-1/6 text-right'></p>
      </div>

      <ul className='flex flex-col text-sm divide-y'>
        {data?.map((stock) => {
          const { code, name, stck_prpr, prdy_ctrt, prdy_vrss_sign } = stock;

          return (
            <li
              className='flex py-2 transition-colors hover:cursor-pointer hover:bg-gray-50'
              key={code}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('button')) return;
                handleClick(code);
              }}
            >
              <div className='flex w-1/2 gap-2 text-left truncate'>
                <p className='font-semibold'>{name}</p>
                <p className='text-gray-500'>{code}</p>
              </div>
              <p className='w-1/4 text-center truncate'>
                {(+stck_prpr).toLocaleString()}원
              </p>
              <p
                className={`w-1/4 truncate text-right ${+prdy_vrss_sign > 3 ? 'text-juga-blue-50' : 'text-juga-red-60'}`}
              >
                {+prdy_vrss_sign < 3 && '+'}
                {prdy_ctrt}%
              </p>
              <p className='w-1/6 text-right'>
                <button onClick={() => unlike.mutate(code)}>
                  <HeartIcon className='size-6 fill-juga-red-60' />
                </button>
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
