type SearchCardProps = {
  companyName: string;
  previousClose: number;
  priceChange: number;
};

export default function SearchCard({
  companyName = '회사명',
  previousClose = 50000,
  priceChange = 2.5,
}: SearchCardProps) {
  const isPositive = priceChange > 0;
  const isNegative = priceChange < 0;

  const getPriceChangeColor = () => {
    if (isPositive) return 'text-red-500';
    if (isNegative) return 'text-blue-500';
    return 'text-gray-500';
  };

  const formattedPreviousClose = previousClose.toLocaleString();
  const formattedPriceChange = Math.abs(priceChange).toFixed(2);
  const priceChangeSymbol = isPositive ? '+' : isNegative ? '-' : '';

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
            {formattedPreviousClose}
          </p>

          <p
            className={`text-right text-xs font-medium ${getPriceChangeColor()}`}
          >
            {priceChangeSymbol}
            {formattedPriceChange}%
          </p>
        </div>
      </div>
    </li>
  );
}
