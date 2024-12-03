export const BookmarkSkeleton = () => {
  return (
    <div className='mx-auto flex min-h-[500px] w-full flex-1 flex-col rounded-md bg-white p-4 shadow-md'>
      {/* 헤더 */}
      <div className='flex border-b pb-2 text-sm font-bold'>
        <div className='w-1/2'>
          <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
        </div>
        <div className='w-1/4 text-center'>
          <div className='mx-auto h-4 w-16 animate-pulse rounded bg-gray-200' />
        </div>
        <div className='flex w-1/4 justify-end'>
          <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
        </div>
      </div>

      {/* 북마크 리스트 */}
      <ul className='flex flex-col divide-y text-sm'>
        {Array.from({ length: 8 }).map((_, index) => (
          <li key={index} className='flex py-2'>
            {/* 종목명과 코드 */}
            <div className='flex w-1/2 gap-2'>
              <div className='h-4 w-24 animate-pulse rounded bg-gray-200' />
              <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
            </div>
            {/* 현재가 */}
            <div className='flex w-1/4 justify-center'>
              <div className='h-4 w-20 animate-pulse rounded bg-gray-200' />
            </div>
            {/* 등락률 */}
            <div className='flex w-1/4 justify-end'>
              <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
