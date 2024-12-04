import { useNavigate } from 'react-router-dom';

type CardProps = {
  code: string;
  name: string;
  price: string;
  changePercentage: string;
  changePrice: string;
  flag: string;
  index: number;
};

export default function Card({
  code,
  name,
  price,
  changePercentage,
  changePrice,
  flag,
  index,
}: CardProps) {
  const color =
    flag === '3' ? '' : flag < '3' ? 'text-juga-red-60' : 'text-juga-blue-40';
  const percentAbsolute = Math.abs(Number(changePercentage)).toFixed(2);

  const plusOrMinus = flag === '3' ? '' : flag < '3' ? '+' : '-';

  const navigation = useNavigate();

  const handleClick = () => {
    navigation(`/stocks/${code}`);
  };

  return (
    <div
      className='flex flex-row items-center justify-between py-3 hover:cursor-pointer'
      onClick={handleClick}
    >
      <div className={'ml-2 font-medium text-juga-blue-50'}>{index + 1}</div>
      <div className='ml-4 w-[180px] text-start'>
        <p className='overflow-hidden text-ellipsis whitespace-nowrap font-medium text-juga-grayscale-black'>
          {name}
        </p>
      </div>
      <div className='w-[120px] text-right'>
        <p className='font-normal text-juga-grayscale-black'>
          {Number(price).toLocaleString()}
        </p>
      </div>
      <div className={`w-[150px] text-right ${color}`}>
        <p className='font-normal'>
          {plusOrMinus}
          {Math.abs(Number(changePrice)).toLocaleString()}({percentAbsolute}
          %)
        </p>
      </div>
    </div>
  );
}
