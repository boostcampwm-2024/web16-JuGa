import Overay from 'components/ModalOveray';
import useOrders from 'hooks/useOrder';
import useTradeAlertModalStore from 'store/useTradeAlertModalStore';
import { getTradeCommision } from 'utils/common';

type TradeAlertModalProps = {
  code: string;
  stockName: string;
  price: string;
  count: number;
  type: 'SELL' | 'BUY';
};

export default function TradeAlertModal({
  code,
  stockName,
  price,
  count,
  type,
}: TradeAlertModalProps) {
  const { toggleModal } = useTradeAlertModalStore();
  const { orderBuy, orderSell } = useOrders();

  const totalPrice = +price * count;

  const tradeCommission = getTradeCommision(totalPrice); // 수수료 임시

  const handleTrade = async () => {
    if (type === 'BUY') {
      orderBuy.mutate({ code, price: +price, count });
      toggleModal();
    } else {
      orderSell.mutate({ code, price: +price, count });
      toggleModal();
    }
  };

  return (
    <div className='z-30'>
      <Overay onClick={() => toggleModal()} />
      <section className='fixed left-1/2 top-1/2 flex w-[500px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-white p-5 shadow-lg'>
        <div className='self-start text-lg font-bold'>
          {stockName} {type === 'BUY' ? '매수' : '매도'} {count}주
        </div>
        <div className='flex flex-col gap-2 my-5 text-juga-grayscale-500'>
          <div className='flex justify-between'>
            <p>{count}주 희망가격</p>
            <p>{totalPrice.toLocaleString()}원</p>
          </div>
          <div className='flex justify-between'>
            <p>예상 수수료</p>
            <p>{tradeCommission.toLocaleString()}원</p>
          </div>
          <div className='flex justify-between'>
            <p>총 주문 금액</p>
            <p>{(totalPrice + tradeCommission).toLocaleString()}원</p>
          </div>
        </div>

        <div className='flex justify-end gap-2'>
          <button
            className='px-6 py-2 text-gray-800 rounded-xl bg-juga-grayscale-100'
            onClick={toggleModal}
          >
            취소
          </button>
          <button
            className={`rounded-xl px-6 py-2 text-white ${type === 'BUY' ? 'bg-juga-red-60' : 'bg-juga-blue-50'}`}
            onClick={handleTrade}
          >
            {type === 'BUY' ? '매수' : '매도'}
          </button>
        </div>
      </section>
    </div>
  );
}
