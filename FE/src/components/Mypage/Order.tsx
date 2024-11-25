import useOrders from 'hooks/useOrder';
import { parseTimestamp } from 'utils/common';

export default function Order() {
  const { orderQuery, removeOrder } = useOrders();

  const { data, isLoading, isError } = orderQuery;

  if (isLoading) return <div>loading</div>;
  if (!data) return <div>No data</div>;
  if (isError) return <div>error</div>;

  const handleCancelOrder = (id: number) => {
    removeOrder.mutate(id);
  };

  return (
    <div className='flex flex-col w-full p-4 mx-auto bg-white rounded-md shadow-md'>
      <div className='flex pb-2 text-sm font-bold border-b'>
        <p className='w-1/3 text-left truncate'>종목</p>
        <p className='w-1/4 text-center'>요청 유형</p>
        <p className='w-1/4 text-center'>수량</p>
        <p className='w-1/4 text-center'>요청 가격</p>
        <p className='w-1/4 text-right'>요청 시간</p>
        <p className='w-1/6 text-right'></p>
      </div>

      <ul className='flex flex-col text-sm divide-y min-h-48'>
        {data.map((order) => {
          const {
            id,
            stock_code,
            stock_name,
            price,
            amount,
            trade_type,
            created_at,
          } = order;

          return (
            <li className='flex py-2' key={id}>
              <div className='flex w-1/3 gap-2 text-left truncate'>
                <p className='font-semibold'>{stock_name}</p>
                <p className='text-gray-500'>{stock_code}</p>
              </div>
              <p className='w-1/4 text-center'>
                {trade_type === 'BUY' ? '매수' : '매도'}
              </p>
              <p className='w-1/4 text-center truncate'>{amount}</p>
              <p className='w-1/4 text-center'>{price.toLocaleString()}원</p>
              <p className='w-1/4 text-right truncate'>
                {parseTimestamp(created_at)}
              </p>
              <p className='w-1/6 text-right'>
                <button
                  onClick={() => handleCancelOrder(id)}
                  className='px-2 py-1 text-xs text-white transition rounded-lg bg-juga-red-60 hover:bg-red-600'
                >
                  취소
                </button>
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
