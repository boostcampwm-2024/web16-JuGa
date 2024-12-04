import { PencilSquareIcon } from '@heroicons/react/16/solid';
import Toast from 'components/Toast';

import useUser from 'hooks/useUser';
import { useEffect, useState } from 'react';

export default function MyInfo() {
  const [isEditMode, setIsEditMode] = useState(false);
  const { userQuery, updateNickname } = useUser();

  const { data } = userQuery;

  const [nickname, setNickname] = useState('');

  useEffect(() => {
    if (!data) return;
    setNickname(data.name);
  }, [data]);

  const handleEditBtnClick = () => {
    if (nickname === data?.name) {
      setIsEditMode(false);
      return;
    }

    updateNickname.mutate(nickname, {
      onSuccess: (res) => {
        if (res.statusCode === 400) {
          Toast({ message: res.message, type: 'error' });
          return;
        }
        setIsEditMode(false);
      },
    });
  };

  return (
    <div className='flex flex-col items-center p-6 text-lg'>
      <div className='flex w-full max-w-[600px] items-center gap-2 py-2 sm:w-[80%] lg:w-[50%]'>
        <div className='flex w-full items-center justify-between'>
          <p className='w-28 min-w-[80px] truncate font-medium text-juga-grayscale-black sm:min-w-[100px]'>
            닉네임
          </p>
          <div className='flex items-center gap-2'>
            {isEditMode ? (
              <>
                <input
                  type='text'
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className='w-24 min-w-[60px] flex-1 text-right font-semibold text-juga-grayscale-500 sm:w-auto sm:min-w-[80px]'
                  autoFocus
                />
                <button
                  onClick={handleEditBtnClick}
                  className='w-10 rounded-lg bg-juga-blue-40 p-1 text-sm font-semibold text-white'
                >
                  수정
                </button>
                <button
                  onClick={() => {
                    if (data) {
                      setNickname(data.name);
                    }
                    setIsEditMode(false);
                  }}
                  className='w-10 rounded-lg bg-juga-grayscale-500 p-1 text-sm font-semibold text-white'
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <p className='min-w-[60px] truncate font-semibold text-juga-grayscale-500 sm:min-w-[80px]'>
                  {nickname}
                </p>
                <div className='flex w-9 items-center justify-end'>
                  <button onClick={() => setIsEditMode(true)}>
                    <PencilSquareIcon className='h-5 w-5' />
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
