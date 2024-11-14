import { useEffect, useRef, useState } from 'react';
import PriceTableColumn from './PriceTableColumn.tsx';
import PriceTableLiveCard from './PriceTableLiveCard.tsx';
import PriceTableDayCard from './PriceTableDayCard.tsx';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DailyPriceDataType, PriceDataType } from './PriceDataType.ts';
import { getTradeHistory } from 'service/getTradeHistory.ts';

export default function PriceSection() {
  const [buttonFlag, setButtonFlag] = useState(true);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['detail', id, buttonFlag],
    queryFn: () => getTradeHistory(id as string, buttonFlag),
    refetchInterval: 1000,
    cacheTime: 30000,
    staleTime: 1000,
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
              {isLoading ? (
                <tr>
                  <td>Loading...</td>
                </tr>
              ) : !data ? (
                <tr>
                  <td>No data available</td>
                </tr>
              ) : buttonFlag ? (
                data.map((eachData: PriceDataType, index: number) => (
                  <PriceTableLiveCard
                    key={`${eachData.stck_cntg_hour}-${index}`}
                    data={eachData}
                  />
                ))
              ) : (
                data.map((eachData: DailyPriceDataType, index: number) => (
                  <PriceTableDayCard
                    key={`${eachData.stck_bsop_date}-${index}`}
                    data={eachData}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
