export const RankingSkeleton = () => {
  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
      {/* Left List */}
      <div className='flex flex-col gap-4'>
        <div className='w-full rounded-lg bg-white p-2 shadow-lg'>
          <div className='mb-1 border-b pb-1'>
            <div className='h-5 w-24 animate-pulse rounded bg-gray-200' />
          </div>

          <div className='space-y-1'>
            {Array(10)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between rounded p-1.5'
                >
                  <div className='flex items-center gap-2'>
                    <div className='h-5 w-5 animate-pulse rounded-full bg-gray-200' />
                    <div className='h-3.5 w-20 animate-pulse rounded bg-gray-200' />
                  </div>
                  <div className='h-3.5 w-16 animate-pulse rounded bg-gray-200' />
                </div>
              ))}
          </div>
        </div>

        <div className='w-full rounded-lg bg-white px-2 pb-1 pt-1.5 shadow-lg'>
          <div className='border-b'>
            <div className='h-5 w-32 animate-pulse rounded bg-gray-200' />
          </div>

          <div className='space-y-1'>
            <div className='flex items-center justify-between rounded p-1.5'>
              <div className='flex items-center gap-2'>
                <div className='h-5 w-5 animate-pulse rounded-full bg-gray-200' />
                <div className='h-3.5 w-20 animate-pulse rounded bg-gray-200' />
              </div>
              <div className='h-3.5 w-16 animate-pulse rounded bg-gray-200' />
            </div>
          </div>
        </div>
      </div>

      {/* Right List */}
      <div className='flex flex-col gap-4'>
        <div className='w-full rounded-lg bg-white p-2 shadow-lg'>
          <div className='mb-1 border-b pb-1'>
            <div className='h-5 w-24 animate-pulse rounded bg-gray-200' />
          </div>

          <div className='space-y-1'>
            {Array(10)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between rounded p-1.5'
                >
                  <div className='flex items-center gap-2'>
                    <div className='h-5 w-5 animate-pulse rounded-full bg-gray-200' />
                    <div className='h-3.5 w-20 animate-pulse rounded bg-gray-200' />
                  </div>
                  <div className='h-3.5 w-16 animate-pulse rounded bg-gray-200' />
                </div>
              ))}
          </div>
        </div>

        <div className='w-full rounded-lg bg-white px-2 pb-1 pt-1.5 shadow-lg'>
          <div className='border-b'>
            <div className='h-5 w-32 animate-pulse rounded bg-gray-200' />
          </div>

          <div className='space-y-1'>
            <div className='flex items-center justify-between rounded p-1.5'>
              <div className='flex items-center gap-2'>
                <div className='h-5 w-5 animate-pulse rounded-full bg-gray-200' />
                <div className='h-3.5 w-20 animate-pulse rounded bg-gray-200' />
              </div>
              <div className='h-3.5 w-16 animate-pulse rounded bg-gray-200' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
