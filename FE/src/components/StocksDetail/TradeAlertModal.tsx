import Overay from 'components/ModalOveray';
import { orderBuyStock } from 'service/orders';
import useTradeAlertModalStore from 'store/tradeAlertModalStore';

type TradeAlertModalProps = {
  code: string;
  stockName: string;
  price: string;
  count: number;
};

export default function TradeAlertModal({
  code,
  stockName,
  price,
  count,
}: TradeAlertModalProps) {
  const { toggleModal } = useTradeAlertModalStore();

  const charge = 55; // 수수료 임시

  const handleBuy = async () => {
    const res = await orderBuyStock(code, +price, count);
    if (res.ok) toggleModal();
  };

  return (
    <>
      <Overay onClick={() => toggleModal()} />
      <section className='fixed left-1/2 top-1/2 flex w-[500px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-white p-5 shadow-lg'>
        <div className='self-start text-lg font-bold'>
          {stockName} 매수 {count}주
        </div>
        <div className='flex flex-col gap-2 my-5 text-juga-grayscale-500'>
          <div className='flex justify-between'>
            <p>{count}주 희망가격</p>
            <p>{(+price).toLocaleString()}원</p>
          </div>
          <div className='flex justify-between'>
            <p>예상 수수료</p>
            <p>{charge}원</p>
          </div>
          <div className='flex justify-between'>
            <p>총 주문 금액</p>
            <p>{(+price + charge).toLocaleString()}원</p>
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
            className='px-6 py-2 text-white rounded-xl bg-juga-red-60'
            onClick={handleBuy}
          >
            구매
          </button>
        </div>
      </section>
    </>
  );
}
