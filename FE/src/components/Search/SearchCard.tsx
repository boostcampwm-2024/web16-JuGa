export default function SearchCard() {
  const companyName = '회사명';
  const previousClose = 50000;
  const priceChange = 2.5;

  return (
    <li className='h-[52px] w-full rounded-xl hover:cursor-pointer hover:bg-gray-50'>
      <div className='my-2 flex w-full items-center justify-between px-4'>
        <div className='flex-1'>
          <p className='text-left font-medium text-juga-grayscale-black'>
            {companyName}
          </p>
        </div>

        <div className='flex flex-col items-end justify-center gap-0.5'>
          <p className='text-right text-sm font-medium text-gray-900'>
            {previousClose.toLocaleString()}
          </p>

          <p className={'text-right text-xs font-medium text-red-500'}>
            +{Math.abs(priceChange).toFixed(2)}%
          </p>
        </div>
      </div>
    </li>
  );
}
