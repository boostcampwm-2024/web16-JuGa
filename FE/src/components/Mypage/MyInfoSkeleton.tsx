export const MyInfoSkeleton = () => {
  return (
    <div className='flex flex-col items-center p-6 text-lg'>
      <div className='flex w-full max-w-[600px] items-center gap-2 py-2 sm:w-[80%] lg:w-[50%]'>
        <div className='flex w-full items-center justify-between'>
          {/* 닉네임 라벨 */}
          <div className='w-28 min-w-[80px] sm:min-w-[100px]'>
            <div className='h-6 w-16 animate-pulse rounded bg-gray-200' />
          </div>

          <div className='flex items-center gap-2'>
            {/* 닉네임 값 */}
            <div className='min-w-[60px] sm:min-w-[80px]'>
              <div className='h-6 w-24 animate-pulse rounded bg-gray-200' />
            </div>

            {/* 편집 아이콘 */}
            <div className='flex w-9 items-center justify-end'>
              <div className='h-5 w-5 animate-pulse rounded bg-gray-200' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
