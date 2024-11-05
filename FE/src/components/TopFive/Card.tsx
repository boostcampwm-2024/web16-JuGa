type CardProps = {
  name: string;
  price: number;
  change: number;
  index: number;
};

export default function Card({ name, price, change, index }: CardProps) {
  const changeColor = change > 0 ? 'text-juga-red-60' : 'text-juga-blue-50';

  return (
    <div className='flex flex-row items-center px-4 py-3'>
      <div className={'mx-0 font-medium text-juga-blue-50'}>{index + 1}</div>
      <div className='ml-4 w-[260px] text-start'>
        <p className='font-medium text-juga-grayscale-black'>{name}</p>
      </div>
      <div className='w-[130px] text-right'>
        <p className='font-medium text-juga-grayscale-black'>
          {price?.toLocaleString()}
        </p>
      </div>
      <div className={`w-[130px] text-right ${changeColor}`}>
        <p className='font-medium'>{change > 0 ? `+${change}` : `${change}`}</p>
      </div>
    </div>
  );
}
