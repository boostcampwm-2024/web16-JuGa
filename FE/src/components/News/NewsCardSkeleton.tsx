export const NewsCardSkeleton = () => {
  return (
    <div className='flex flex-col rounded-lg border p-4'>
      <div className='mb-2 flex w-full flex-row items-center justify-between'>
        <div className='flex flex-row items-center gap-3'>
          {/* 제목 스켈레톤 */}
          <div className='h-5 w-[320px] animate-pulse rounded bg-gray-200' />
        </div>
        {/* 날짜 스켈레톤 */}
        <div className='h-4 w-20 animate-pulse rounded bg-gray-200' />
      </div>
      <div className='flex w-full items-center justify-between gap-4'>
        {/* 본문 스켈레톤 */}
        <div className='h-4 w-96 animate-pulse rounded bg-gray-200' />
        {/* 태그 스켈레톤 */}
        <div className='h-5 w-16 animate-pulse rounded-full bg-gray-200' />
      </div>
    </div>
  );
};
