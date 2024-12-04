export const StockIndexSkeleton = () => {
  return (
    <div className='my-2 flex w-full items-center justify-between gap-2'>
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className='flex h-[100px] w-full items-center justify-between rounded-lg bg-juga-grayscale-50 p-3'
        >
          <div className='flex h-full w-[108px] flex-1 flex-col items-start justify-center gap-2'>
            {/* 종목명 스켈레톤 */}
            <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
            {/* 가격 스켈레톤 */}
            <div className='h-6 w-24 animate-pulse rounded bg-gray-200' />
            {/* 등락률 스켈레톤 */}
            <div className='h-4 w-20 animate-pulse rounded bg-gray-200' />
          </div>
          {/* 차트 영역 스켈레톤 */}
          <div className='h-[52px] flex-1 animate-pulse rounded bg-gray-200' />
        </div>
      ))}
    </div>
  );
};
