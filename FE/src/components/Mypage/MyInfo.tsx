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

  const { name, email } = data;

  return (
    <div className='flex flex-col items-center p-6 text-lg'>
      <div className='w-full px-40'>
        <div className='flex items-center justify-between py-2 border-b'>
          <p className='font-medium text-left text-jugagrayscale-400 w-28'>
            Username
          </p>
          <p className='font-semibold text-jugagrayscale-500'>{name}</p>
        </div>
        <div className='flex items-center justify-between py-2'>
          <p className='font-medium text-left text-jugagrayscale-400 w-28'>
            Email
          </p>
          <p className='font-semibold text-jugagrayscale-500'>{email}</p>
        </div>
      </div>
    </div>
  );
}
