import { useEffect, useRef, useState } from 'react';
import PriceTableColumn from './PriceTableColumn.tsx';
import PriceTableLiveCard from './PriceTableLiveCard.tsx';
import PriceTableDayCard from './PriceTableDayCard.tsx';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PriceDataType } from './PriceDataType.ts';

export const tradeHistoryApi = async (id: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/stocks/${id}/trade-history`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default function PriceSection() {
  const [buttonFlag, setButtonFlag] = useState(true);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: ['detail', id],
    queryFn: () => tradeHistoryApi(id as string),
    enabled: !!id,
  });

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
    <div
      className={
        'flex max-h-[240px] flex-1 flex-col rounded-2xl bg-white p-2 shadow-sm'
      }
    >
      <div className={'px-4 pb-0.5 pt-[6px] text-left text-sm font-semibold'}>
        일별 · 실시간 시세
      </div>
      <div
        className={
          'flex flex-1 flex-col overflow-hidden rounded-xl text-sm font-medium'
        }
      >
        <div
          className={
            'relative flex w-full rounded-xl bg-juga-grayscale-50 p-0.5'
          }
        >
          <div
            ref={indicatorRef}
            className='absolute bottom-0.5 rounded-xl bg-white shadow transition-all duration-300'
            style={{ height: '28px' }}
          />
          <button
            className={`z-7 relative w-full rounded-lg px-4 py-1 ${
              buttonFlag
                ? 'text-juga-grayscale-black'
                : 'text-juga-grayscale-400'
            }`}
            onClick={() => setButtonFlag(true)}
            ref={(el) => (buttonRefs.current[0] = el)}
          >
            실시간
          </button>
          <button
            className={`z-7 relative w-full rounded-lg ${
              !buttonFlag
                ? 'text-juga-grayscale-black'
                : 'text-juga-grayscale-400'
            } z-7 relative w-full rounded-lg px-4 py-1`}
            onClick={() => setButtonFlag(false)}
            ref={(el) => (buttonRefs.current[1] = el)}
          >
            일별
          </button>
        </div>

        <div className={'flex-1 overflow-y-auto'}>
          <table className={'w-full table-fixed text-xs font-normal'}>
            <PriceTableColumn viewMode={buttonFlag} />
            <tbody>
              {data?.map((eachData: PriceDataType, index: number) =>
                buttonFlag ? (
                  <PriceTableLiveCard key={index} data={eachData} />
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
