import useOrders from 'hooks/useOrder';
import useOrderCancelAlertModalStore from 'store/useOrderCancleAlertModalStore';
import CancelAlertModal from './CancelAlertModal.tsx';
import { formatTimestamp } from 'utils/format';

export default function Order() {
  const { orderQuery, removeOrder } = useOrders();

  const { data } = orderQuery;
  const { isOpen, open } = useOrderCancelAlertModalStore();

  return (
    <div className='mx-auto flex min-h-[500px] w-full flex-col rounded-md bg-white p-4 shadow-md'>
      <div className='flex border-b pb-2 text-sm font-bold'>
        <p className='w-1/3 truncate text-left'>종목</p>
        <p className='w-1/4 text-center'>요청 유형</p>
        <p className='w-1/4 text-center'>수량</p>
        <p className='w-1/4 text-center'>요청 가격</p>
        <p className='w-1/4 text-right'>요청 시간</p>
        <p className='w-1/6 text-right'></p>
      </div>

      <ul className='flex flex-col divide-y text-sm'>
        {data?.map((order) => {
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
              <div className='flex w-1/3 gap-2 truncate text-left'>
                <p className='font-semibold'>{stock_name}</p>
                <p className='text-gray-500'>{stock_code}</p>
              </div>
              <p
                className={`w-1/4 text-center ${
                  trade_type === 'BUY'
                    ? 'text-juga-red-60'
                    : 'text-juga-blue-50'
                }`}
              >
                {trade_type === 'BUY' ? '매수' : '매도'}
              </p>
              <p className='w-1/4 truncate text-center'>{amount}</p>
              <p className='w-1/4 text-center'>{price.toLocaleString()}원</p>
              <p className='w-1/4 truncate text-right'>
                {formatTimestamp(created_at)}
              </p>
              <p className='w-1/6 text-right'>
                <button
                  onClick={() => open(order, () => removeOrder.mutate(id))}
                  className='rounded-lg bg-juga-grayscale-500 px-2 py-1 text-xs text-white transition hover:bg-juga-grayscale-black'
                >
                  취소
                </button>
              </p>
            </li>
          );
        })}
      </ul>
      {isOpen && <CancelAlertModal />}
    </div>
  );
}
