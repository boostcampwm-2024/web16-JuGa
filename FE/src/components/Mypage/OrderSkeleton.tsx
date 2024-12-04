export const OrderSkeleton = () => {
  return (
    <div className='mx-auto flex min-h-[500px] w-full flex-col rounded-md bg-white p-4 shadow-md'>
      {/* 헤더 */}
      <div className='flex border-b pb-2 text-sm font-bold'>
        <div className='w-1/3'>
          <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
        </div>
        <div className='flex w-1/4 justify-center'>
          <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
        </div>
        <div className='flex w-1/4 justify-center'>
          <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
        </div>
        <div className='flex w-1/4 justify-center'>
          <div className='h-4 w-20 animate-pulse rounded bg-gray-200' />
        </div>
        <div className='flex w-1/4 justify-end'>
          <div className='h-4 w-20 animate-pulse rounded bg-gray-200' />
        </div>
        <div className='w-1/6'></div>
      </div>

      {/* 주문 리스트 */}
      <ul className='flex flex-col divide-y text-sm'>
        {Array.from({ length: 5 }).map((_, index) => (
          <li className='flex py-2' key={index}>
            {/* 종목명과 코드 */}
            <div className='flex w-1/3 gap-2'>
              <div className='h-4 w-24 animate-pulse rounded bg-gray-200' />
              <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
            </div>
            {/* 요청 유형 */}
            <div className='flex w-1/4 justify-center'>
              <div className='h-4 w-12 animate-pulse rounded bg-gray-200' />
            </div>
            {/* 수량 */}
            <div className='flex w-1/4 justify-center'>
              <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
            </div>
            {/* 요청 가격 */}
            <div className='flex w-1/4 justify-center'>
              <div className='h-4 w-20 animate-pulse rounded bg-gray-200' />
            </div>
            {/* 요청 시간 */}
            <div className='flex w-1/4 justify-end'>
              <div className='h-4 w-24 animate-pulse rounded bg-gray-200' />
            </div>
            {/* 취소 버튼 */}
            <div className='flex w-1/6 justify-end'>
              <div className='h-6 w-12 animate-pulse rounded-lg bg-gray-200' />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
