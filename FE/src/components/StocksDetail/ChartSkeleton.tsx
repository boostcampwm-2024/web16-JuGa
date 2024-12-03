const ChartSkeleton = () => {
  return (
    <div className='box-border flex h-[260px] flex-col items-center rounded-lg bg-white p-3'>
      {/* 상단 헤더 영역 */}
      <div className='flex h-fit w-full items-center justify-between'>
        {/* 차트 제목 */}
        <div className='h-5 w-12 animate-pulse rounded bg-gray-200' />

        {/* 카테고리 버튼들 */}
        <nav className='flex gap-4'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className='h-7 w-7 animate-pulse rounded-lg bg-gray-200'
            />
          ))}
        </nav>
      </div>

      {/* 차트 컨테이너 */}
      <div className='mt-2 flex h-[200px] w-full flex-col'>
        {/* Upper 차트 영역 */}
        <div className='relative flex flex-1 flex-row'>
          {/* 메인 차트 영역 */}
          <div className='flex-1 animate-pulse bg-gray-200' />
          {/* Y축 */}
          <div className='ml-1 h-full w-12 animate-pulse bg-gray-200' />
        </div>

        {/* 구분선 */}
        <div className='h-[1px] w-full bg-juga-grayscale-100' />

        {/* Lower 차트 영역 */}
        <div className='relative flex h-[60px] flex-row'>
          {/* 메인 차트 영역 */}
          <div className='flex-1 animate-pulse bg-gray-200' />
          {/* Y축 */}
          <div className='ml-1 h-full w-12 animate-pulse bg-gray-200' />
        </div>

        {/* X축 영역 */}
        <div className='mt-1 h-5 w-full animate-pulse bg-gray-200' />
      </div>
    </div>
  );
};

export default ChartSkeleton;
