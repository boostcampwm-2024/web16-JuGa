export function SkeletonCard() {
  return (
    <div className='flex flex-row items-center justify-between py-3'>
      <div className='ml-2'>
        <div className='h-4 w-4 animate-pulse rounded bg-gray-200' />
      </div>

      <div className='ml-4 w-[180px]'>
        <div className='h-4 w-32 animate-pulse rounded bg-gray-200' />
      </div>

      <div className='w-[120px] text-right'>
        <div className='ml-auto h-4 w-24 animate-pulse rounded bg-gray-200' />
      </div>

      <div className='w-[150px] text-right'>
        <div className='ml-auto h-4 w-28 animate-pulse rounded bg-gray-200' />
      </div>
    </div>
  );
}
