import { SkeletonCard } from './SkeletonCard.tsx';

export const SkeletonList = () => {
  return (
    <div className='flex flex-col gap-4'>
      {/* Nav 영역 스켈레톤 */}
      <div className='h-10 w-full animate-pulse rounded bg-gray-200' />

      <div className='flex flex-row justify-between gap-[64px]'>
        {/* 급상승 리스트 */}
        <div className='w-full rounded-lg bg-white px-1'>
          {/* 제목 */}
          <div className='my-5'>
            <div className='h-6 w-32 animate-pulse rounded bg-gray-200' />
          </div>

          {/* 헤더 */}
          <div className='flex flex-row items-center justify-between py-3'>
            <div className='w-[200px]'>
              <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
            </div>
            <div className='w-[140px] text-right'>
              <div className='ml-auto h-4 w-16 animate-pulse rounded bg-gray-200' />
            </div>
            <div className='w-[150px] text-right'>
              <div className='ml-auto h-4 w-16 animate-pulse rounded bg-gray-200' />
            </div>
          </div>

          {/* 카드 리스트 */}
          <ul>
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className='transition-colors'>
                <SkeletonCard />
              </li>
            ))}
          </ul>
        </div>

        {/* 급하락 리스트 */}
        <div className='w-full rounded-lg bg-white px-1'>
          {/* 제목 */}
          <div className='my-5'>
            <div className='h-6 w-32 animate-pulse rounded bg-gray-200' />
          </div>

          {/* 헤더 */}
          <div className='flex flex-row items-center justify-between py-3'>
            <div className='w-[200px]'>
              <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
            </div>
            <div className='w-[140px] text-right'>
              <div className='ml-auto h-4 w-16 animate-pulse rounded bg-gray-200' />
            </div>
            <div className='w-[150px] text-right'>
              <div className='ml-auto h-4 w-16 animate-pulse rounded bg-gray-200' />
            </div>
          </div>

          {/* 카드 리스트 */}
          <ul>
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className='transition-colors'>
                <SkeletonCard />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
