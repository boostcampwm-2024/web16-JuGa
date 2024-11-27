import { MyStockListUnit } from 'types';
import { calcYield } from 'utils/common';

type MyStocksListProps = {
  stocks: MyStockListUnit[];
};

export default function MyStocksList({ stocks }: MyStocksListProps) {
  return (
    <div className='flex flex-col flex-1 w-full p-4 mx-auto bg-white rounded-md shadow-md'>
      <div className='flex pb-2 text-sm font-bold border-b'>
        <p className='w-1/2 text-left truncate'>종목</p>
        <p className='w-1/6 text-center'>보유 수량</p>
        <p className='w-1/6 text-center'>현재가</p>
        <p className='w-1/6 text-center'>평균 매수가</p>
        <p className='w-1/6 text-right'>수익률</p>
      </div>

      <ul className='flex flex-col text-sm divide-y'>
        {stocks.map((stock) => {
          const { code, name, avg_price, quantity, stck_prpr } = stock;

          const stockYield = calcYield(avg_price, +stck_prpr);

          return (
            <li className='flex py-2' key={code}>
              <div className='flex w-1/2 gap-2 text-left truncate'>
                <p className='font-semibold'>{name}</p>
                <p className='text-gray-500'>{code}</p>
              </div>
              <p className='w-1/6 text-center'>{quantity}</p>
              <p className='w-1/6 text-center truncate'>
                {(+stck_prpr).toLocaleString()}원
              </p>
              <p className='w-1/6 text-center'>
                {avg_price.toLocaleString()}원
              </p>
              <p
                className={`w-1/6 truncate text-right ${stockYield < 0 ? 'text-juga-blue-50' : 'text-juga-red-60'}`}
              >
                {stockYield.toFixed(2)}%
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
