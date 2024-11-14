import Lottie from 'lottie-react';
import { useEffect, useRef, useState } from 'react';
import emptyAnimation from 'assets/emptyAnimation.json';

export default function TradeSection() {
  const [category, setCategory] = useState<'buy' | 'sell'>('buy');
  const indicatorRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const idx = category === 'buy' ? 0 : 1;
    const currentButton = buttonRefs.current[idx];
    const indicator = indicatorRef.current;

    if (currentButton && indicator) {
      indicator.style.left = `${currentButton.offsetLeft}px`;
      indicator.style.width = `${currentButton.offsetWidth}px`;
    }
  }, [category]);

  return (
    <section className='ml-2 flex w-full min-w-72 flex-col rounded-lg bg-juga-grayscale-50 p-4 text-sm'>
      <h2 className='mb-4 self-start font-semibold'>주문하기</h2>
      <div className='relative flex w-full rounded-xl bg-gray-200 p-0.5'>
        <div
          ref={indicatorRef}
          className='absolute bottom-0.5 rounded-xl bg-white shadow transition-all duration-300'
          style={{ height: '28px' }}
        />
        <button
          className={`z-7 relative w-full rounded-lg px-4 py-1 ${
            category === 'buy' ? 'text-juga-red-60' : 'text-juga-grayscale-400'
          }`}
          onClick={() => setCategory('buy')}
          ref={(el) => (buttonRefs.current[0] = el)}
        >
          매수
        </button>
        <button
          className={`z-7 relative w-full rounded-lg ${
            category === 'sell'
              ? 'text-juga-blue-50'
              : 'text-juga-grayscale-400'
          } z-7 relative w-full rounded-lg px-4 py-1`}
          onClick={() => setCategory('sell')}
          ref={(el) => (buttonRefs.current[1] = el)}
        >
          매도
        </button>
      </div>
      {category === 'buy' ? (
        <form className='flex flex-col'>
          <div className='my-4'>
            <div className='flex h-12 items-center justify-between'>
              <p className='mr-3 w-14'>매수 가격</p>
              <input type='number' className='flex-1 rounded-lg px-2 py-1' />
            </div>
            <div className='flex h-12 items-center justify-between'>
              <p className='mr-3 w-14'> 수량</p>
              <input type='number' className='flex-1 rounded-lg px-2 py-1' />
            </div>
          </div>

          <div className='my-5 h-[0.5px] w-full bg-juga-grayscale-200'></div>

          <div className='flex flex-col gap-2'>
            <div className='flex justify-between'>
              <p>매수 가능 금액</p>
              <p>0원</p>
            </div>
            <div className='flex justify-between'>
              <p>총 주문 금액</p>
              <p>0원</p>
            </div>
          </div>

          <button className='mt-10 rounded-lg bg-juga-red-60 py-2 text-white'>
            매수하기
          </button>
        </form>
      ) : (
        <div className='flex h-full items-center justify-center'>
          <Lottie animationData={emptyAnimation} className='h-40 w-40' />
        </div>
      )}
    </section>
  );
}
