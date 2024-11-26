import Overay from 'components/ModalOveray';
import useOrderAlertModalStore from 'store/orderCancleAlertModalStore';

export default function CancleAlertModal() {
  const { close, onSuccess, order } = useOrderAlertModalStore();
  if (!order) return;

  const { stock_name, amount, trade_type } = order;

  return (
    <>
      <Overay onClick={() => close()} />
      <section className='fixed left-1/2 top-1/2 flex w-[440px] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-2xl bg-white p-7 shadow-lg'>
        <div className='text-lg font-semibold'>
          {stock_name} {amount}주 {trade_type === 'BUY' ? '매수' : '매도'} 주문
          요청을 취소하시겠습니까?
        </div>
        <div className='flex justify-center gap-2'>
          <button
            className='w-24 px-6 py-2 text-white transition rounded-xl bg-juga-grayscale-500 hover:bg-juga-grayscale-black'
            onClick={() => {
              onSuccess();
              close();
            }}
          >
            네
          </button>
          <button
            className='w-24 px-6 py-2 text-gray-800 rounded-xl bg-juga-grayscale-100 hover:bg-juga-grayscale-200'
            onClick={close}
          >
            아니오
          </button>
        </div>
      </section>
    </>
  );
}
