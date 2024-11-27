import { PencilSquareIcon } from '@heroicons/react/16/solid';
import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from 'service/user';

export default function MyInfo() {
  const { data, isLoading, isError } = useQuery(
    ['myInfo', 'profile'],
    () => getMyProfile(),
    { staleTime: 1000 },
  );

  if (isLoading) return <div>loading</div>;
  if (!data) return <div>No data</div>;
  if (isError) return <div>error</div>;

  const { name } = data;

  return (
    <div className='flex flex-col items-center p-6 text-lg'>
      <div className='flex w-[50%] items-center gap-2 py-2'>
        <div className='flex items-center justify-between w-full'>
          <p className='w-28 min-w-[100px] truncate font-medium text-juga-grayscale-black'>
            username
          </p>
          <div className='flex items-center gap-2'>
            <p className='min-w-[50px] truncate font-semibold text-juga-grayscale-500'>
              {name}
            </p>
            <button>
              <PencilSquareIcon className='w-5 h-5' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
