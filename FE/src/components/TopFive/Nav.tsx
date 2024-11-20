import { useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { MarketType } from './type.ts';

const markets: MarketType[] = ['전체', '코스피', '코스닥', '코스피200'];

export default function Nav() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentMarket = searchParams.get('top') || '전체';
  const indicatorRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleMarketChange = (market: MarketType) => {
    if (market === '전체') {
      searchParams.delete('top');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ top: market });
    }
  };

  useEffect(() => {
    const currentButton =
      buttonRefs.current[markets.indexOf(currentMarket as MarketType)];
    const indicator = indicatorRef.current;

    if (currentButton && indicator) {
      indicator.style.left = `${currentButton.offsetLeft}px`;
      indicator.style.width = `${currentButton.offsetWidth}px`;
    }
  }, [currentMarket, markets]);

  return (
    <div className='relative flex gap-1 text-xl font-bold'>
      <div
        ref={indicatorRef}
        className='absolute bottom-0 h-1 bg-juga-grayscale-black transition-all duration-300'
        style={{ height: '4px' }}
      />

      {markets.map((market, index) => (
        <button
          key={market}
          ref={(el) => (buttonRefs.current[index] = el)}
          onClick={() => handleMarketChange(market)}
          className={'relative px-2 py-2'}
        >
          {market}
        </button>
      ))}
    </div>
  );
}
