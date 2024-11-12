type CardProps = {
  name: string;
  price: string;
  changePercentage: string;
  changePrice: string;
  index: number;
};

export default function Card({
  name,
  price,
  changePercentage,
  changePrice,
  index,
}: CardProps) {
  const changeValue =
    typeof changePercentage === 'string'
      ? Number(changePercentage)
      : changePercentage;
  const changeColor =
    changeValue > 0 ? 'text-juga-red-60' : 'text-juga-blue-50';

  return (
    <div className='flex flex-row items-center justify-between py-3 hover:cursor-pointer'>
      <div className={'ml-2 font-medium text-juga-blue-50'}>{index + 1}</div>
      <div className='ml-4 w-[180px] text-start'>
        <p className='font-medium text-juga-grayscale-black'>{name}</p>
      </div>
      <div className='w-[120px] text-right'>
        <p className='font-normal text-juga-grayscale-black'>
          {price?.toLocaleString()}
        </p>
      </div>
      <div className={`w-[150px] text-right ${changeColor}`}>
        <p className='font-normal'>
          {changeValue > 0
            ? `${changePrice}(${changeValue}%)`
            : `${changePrice}(${Math.abs(changeValue)}%)`}
        </p>
      </div>
    </div>
  );
}
