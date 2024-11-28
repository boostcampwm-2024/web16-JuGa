import { PencilSquareIcon } from '@heroicons/react/16/solid';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getMyProfile } from 'service/user';

export default function MyInfo() {
  const [isEditMode, setIsEditMode] = useState(false);
  const { data, isLoading, isError } = useQuery(
    ['myInfo', 'profile'],
    () => getMyProfile(),
    { staleTime: 1000 },
  );

  const [nickname, setNickname] = useState('');

  useEffect(() => {
    if (!data) return;
    setNickname(data.name);
  }, [data]);

  if (isLoading) return <div>loading</div>;
  if (!data) return <div>No data</div>;
  if (isError) return <div>error</div>;

  return (
    <div className='flex flex-col items-center p-6 text-lg'>
      <div className='flex w-[50%] items-center gap-2 py-2'>
        <div className='flex items-center justify-between w-full'>
          <p className='w-28 min-w-[100px] truncate font-medium text-juga-grayscale-black'>
            닉네임
          </p>
          <div className='flex items-center gap-2'>
            {isEditMode ? (
              <>
                <input
                  type='text'
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className='min-w-[50px] text-right font-semibold text-juga-grayscale-500'
                  autoFocus
                />
                <button
                  onClick={() => setIsEditMode(false)}
                  className='w-10 p-1 text-sm font-semibold text-white rounded-lg bg-juga-blue-40'
                >
                  수정
                </button>
              </>
            ) : (
              <>
                <p className='min-w-[50px] truncate font-semibold text-juga-grayscale-500'>
                  {nickname}
                </p>
                <div className='flex items-center justify-end w-9'>
                  <button onClick={() => setIsEditMode(true)}>
                    <PencilSquareIcon className='w-5 h-5' />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
