import Lottie from 'lottie-react';
import { useEffect, useRef, useState } from 'react';
import emptyAnimation from 'assets/emptyAnimation.json';

type TradeSectionProps = {
  price: string;
};

export default function TradeSection({ price }: TradeSectionProps) {
  const [category, setCategory] = useState<'buy' | 'sell'>('buy');
  const [currPrice, setCurrPrice] = useState<string>(price);
  const [count, setCount] = useState<number>(0);

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
    <section className='flex flex-col w-full p-4 ml-2 text-sm rounded-lg min-w-72 bg-juga-grayscale-50'>
      <h2 className='self-start mb-4 font-semibold'>주문하기</h2>
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
            <div className='flex items-center justify-between h-12'>
              <p className='mr-3 w-14'>매수 가격</p>
              <input
                type='text'
                value={currPrice}
                onChange={(e) => {
                  if (!isNumericString(e.target.value)) return;
                  setCurrPrice(e.target.value);
                }}
                className='flex-1 py-1 rounded-lg'
              />
            </div>
            <div className='flex items-center justify-between h-12'>
              <p className='mr-3 w-14'> 수량</p>
              <input
                type='number'
                value={count}
                onChange={(e) => setCount(+e.target.value)}
                className='flex-1 py-1 rounded-lg'
              />
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
              <p>{(+currPrice * count).toLocaleString()}원</p>
            </div>
          </div>

          <button className='py-2 mt-10 text-white rounded-lg bg-juga-red-60'>
            매수하기
          </button>
        </form>
      ) : (
        <div className='flex flex-col items-center justify-center h-full'>
          <Lottie
            animationData={emptyAnimation}
            className='w-40 h-40'
            loop={false}
          />
          <p>매도할 주식이 없어요</p>
        </div>
      )}
    </section>
  );
}

function isNumericString(str: string) {
  return str.length === 0 || /^[0-9]+$/.test(str);
}
