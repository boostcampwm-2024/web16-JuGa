import { NewsCardSkeleton } from './NewsCardSkeleton.tsx';

export const NewsSkeleton = () => {
  return (
    <div className='w-full'>
      <div className='mb-4 flex items-center justify-between'>
        {/* 제목 스켈레톤 */}
        <div className='h-7 w-32 animate-pulse rounded bg-gray-200' />
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2'>
        {Array.from({ length: 4 }).map((_, index) => (
          <NewsCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
