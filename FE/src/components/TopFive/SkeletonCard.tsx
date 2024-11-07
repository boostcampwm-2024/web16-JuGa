export function SkeletonCard() {
  return (
    <li className='animate-pulse px-4 py-3'>
      <div className='flex items-center space-x-4'>
        <div className='h-4 w-4 rounded bg-gray-200'></div>
        <div className='h-4 w-[200px] rounded bg-gray-200'></div>
        <div className='ml-auto h-4 w-[100px] rounded bg-gray-200'></div>
        <div className='h-4 w-[80px] rounded bg-gray-200'></div>
      </div>
    </li>
  );
}
