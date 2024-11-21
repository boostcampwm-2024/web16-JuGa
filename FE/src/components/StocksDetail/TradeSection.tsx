import { useEffect, useRef, useState } from 'react';
import { StockDetailType } from 'types';
import SellSection from './SellSection';
import BuySection from './buySection';

type TradeSectionProps = {
  code: string;
  data: StockDetailType;
};

export default function TradeSection({ code, data }: TradeSectionProps) {
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
    <>
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
              category === 'buy'
                ? 'text-juga-red-60'
                : 'text-juga-grayscale-400'
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
          <BuySection code={code} data={data} />
        ) : (
          <SellSection />
        )}
      </section>
    </>
  );
}
