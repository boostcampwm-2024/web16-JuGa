import { useEffect, useRef, useState } from 'react';
import PriceTableColumn from './PriceTableColumn.tsx';
import PriceTableLiveCard from './PriceTableLiveCard.tsx';
import PriceTableDayCard from './PriceTableDayCard.tsx';

export default function PriceSection() {
  const [buttonFlag, setButtonFlag] = useState(true);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const tmpIndex = buttonFlag ? 0 : 1;
    const currentButton = buttonRefs.current[tmpIndex];
    const indicator = indicatorRef.current;

    if (currentButton && indicator) {
      indicator.style.left = `${currentButton.offsetLeft}px`;
      indicator.style.width = `${currentButton.offsetWidth}px`;
    }
  }, [buttonFlag]);

  return (
    <div className={'flex flex-1 flex-col rounded-2xl bg-white p-2 shadow-sm'}>
      <div className={'px-4 py-[6px] text-left text-sm font-semibold'}>
        일별 · 실시간 시세
      </div>
      <div
        className={
          'flex flex-1 flex-col overflow-hidden rounded-xl text-sm font-medium'
        }
      >
        <div
          className={'relative flex w-full rounded-xl bg-juga-grayscale-50 p-1'}
        >
          <div
            ref={indicatorRef}
            className='absolute bottom-1 rounded-xl bg-white transition-all duration-300'
            style={{ height: '36px' }}
          />
          <button
            className={`${
              buttonFlag
                ? 'text-juga-grayscale-black'
                : 'text-juga-grayscale-400'
            } relative z-10 w-full rounded-lg px-4 py-2`}
            onClick={() => setButtonFlag(true)}
            ref={(el) => (buttonRefs.current[0] = el)}
          >
            실시간
          </button>
          <button
            className={`relative z-10 w-full rounded-lg ${
              !buttonFlag
                ? 'text-juga-grayscale-black'
                : 'text-juga-grayscale-400'
            } px-4 py-2`}
            onClick={() => setButtonFlag(false)}
            ref={(el) => (buttonRefs.current[1] = el)}
          >
            일별
          </button>
        </div>

        <div className={'max-h-[400px] flex-1 overflow-y-auto'}>
          <table className={'w-full table-fixed text-xs font-normal'}>
            <PriceTableColumn viewMode={buttonFlag} />
            <tbody>
              {Array(30)
                .fill(null)
                .map((_, index) =>
                  buttonFlag ? (
                    <PriceTableLiveCard key={index} />
                  ) : (
                    <PriceTableDayCard key={index} />
                  ),
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
