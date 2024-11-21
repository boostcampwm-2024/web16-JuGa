import { MyStockListUnit } from 'types';

type MyStocksListProps = {
  stocks: MyStockListUnit[];
};

export default function MyStocksList({ stocks }: MyStocksListProps) {
  return (
    <div className='flex flex-col w-full p-4 mx-auto bg-white rounded-md shadow-md'>
      <div className='flex pb-2 text-sm font-bold border-b'>
        <p className='w-1/2 text-left truncate'>종목</p>
        <p className='w-1/4 text-center'>보유 수량</p>
        <p className='w-1/4 text-right'>평균 가격</p>
      </div>

      <ul className='flex flex-col text-sm divide-y min-h-48'>
        {stocks.map((stock) => {
          const { code, name, avg_price, quantity } = stock;
          return (
            <li className='flex py-2' key={code}>
              <div className='flex w-1/2 gap-2 text-left truncate'>
                <p className='font-semibold'>{name}</p>
                <p className='text-gray-500'>{code}</p>
              </div>
              <p className='w-1/4 text-center'>{quantity}</p>
              <p className='w-1/4 text-right truncate'>
                {Math.floor(avg_price).toLocaleString()}원
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
