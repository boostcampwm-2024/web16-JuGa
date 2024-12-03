const AccountConditionSkeleton = () => {
  return (
    <div className='flex flex-col gap-4 rounded-lg bg-white p-4'>
      <div className='flex items-center justify-between'>
        {/* 계좌 정보 타이틀 */}
        <div className='h-6 w-24 animate-pulse rounded bg-gray-200' />
        {/* 날짜 정보 */}
        <div className='h-5 w-32 animate-pulse rounded bg-gray-200' />
      </div>

      <div className='flex flex-col gap-2'>
        {/* 총자산, 수익률 등의 정보 */}
        <div className='flex items-center justify-between'>
          <div className='h-5 w-20 animate-pulse rounded bg-gray-200' />
          <div className='h-7 w-32 animate-pulse rounded bg-gray-200' />
        </div>
        <div className='flex items-center justify-between'>
          <div className='h-5 w-20 animate-pulse rounded bg-gray-200' />
          <div className='h-7 w-32 animate-pulse rounded bg-gray-200' />
        </div>
      </div>
    </div>
  );
};

const MyStocksListSkeleton = () => {
  return (
    <div className='flex flex-col gap-2 rounded-lg bg-white p-4'>
      {/* 보유종목 타이틀 */}
      <div className='mb-2 h-6 w-24 animate-pulse rounded bg-gray-200' />

      {/* 테이블 헤더 */}
      <div className='flex items-center justify-between border-b pb-2'>
        <div className='h-4 w-32 animate-pulse rounded bg-gray-200' />
        <div className='h-4 w-20 animate-pulse rounded bg-gray-200' />
        <div className='h-4 w-24 animate-pulse rounded bg-gray-200' />
      </div>

      {/* 보유주식 리스트 */}
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className='flex items-center justify-between border-b py-3'
        >
          <div className='h-5 w-40 animate-pulse rounded bg-gray-200' />
          <div className='h-5 w-24 animate-pulse rounded bg-gray-200' />
          <div className='h-5 w-28 animate-pulse rounded bg-gray-200' />
        </div>
      ))}
    </div>
  );
};

export const AccountSkeleton = () => {
  return (
    <div className='flex min-h-[500px] flex-col gap-3'>
      <AccountConditionSkeleton />
      <MyStocksListSkeleton />
    </div>
  );
};
