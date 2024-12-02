import { useCallback, useEffect, useRef, useState } from 'react';
import TableColumn from './TableColumn.tsx';
import TableLiveCard from './TableLiveCard.tsx';
import TableDayCard from './TableDayCard.tsx';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTradeHistory } from 'service/tradeHistory.ts';
import { socket } from 'utils/socket.ts';
import { DailyPriceDataType, PriceDataType } from './type.ts';
import { PriceSectionViewType } from 'types.ts';

export default function PriceSection() {
  const { id } = useParams();
  const [viewMode, setViewMode] = useState<PriceSectionViewType>('today');
  const indicatorRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const queryClient = useQueryClient();

  const { data: tradeData = [], isLoading } = useQuery({
    queryKey: ['detail', id, viewMode],
    queryFn: () => getTradeHistory(id as string, viewMode),
    staleTime: 1000 * 60 * 3,
  });

  const addData = useCallback(
    (newData: PriceDataType) => {
      queryClient.setQueryData(
        ['detail', id, viewMode],
        (old: PriceDataType[] = []) => {
          return [newData, ...old].slice(0, 30);
        },
      );
    },
    [id, viewMode, queryClient],
  );

  useEffect(() => {
    if (viewMode === 'daily') return;
    const handleTradeHistory = (chartData: PriceDataType) => {
      addData(chartData);
    };
    socket.on(`trade-history/${id}`, handleTradeHistory);

    return () => {
      socket.off(`trade-history/${id}`, handleTradeHistory);
    };
  }, [id, addData, viewMode]);

  useEffect(() => {
    const tmpIndex = viewMode === 'today' ? 0 : 1;
    const currentButton = buttonRefs.current[tmpIndex];
    const indicator = indicatorRef.current;

    if (currentButton && indicator) {
      indicator.style.left = `${currentButton.offsetLeft}px`;
      indicator.style.width = `${currentButton.offsetWidth}px`;
    }
  }, [viewMode]);

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
              viewMode ? 'text-juga-grayscale-black' : 'text-juga-grayscale-400'
            }`}
            onClick={() => setViewMode('today')}
            ref={(el) => (buttonRefs.current[0] = el)}
          >
            실시간
          </button>
          <button
            className={`z-7 relative w-full rounded-lg ${
              !viewMode
                ? 'text-juga-grayscale-black'
                : 'text-juga-grayscale-400'
            } z-7 relative w-full rounded-lg px-4 py-1`}
            onClick={() => setViewMode('daily')}
            ref={(el) => (buttonRefs.current[1] = el)}
          >
            일별
          </button>
        </div>

        <div className={'flex-1 overflow-y-auto'}>
          <table className={'w-full table-fixed text-xs font-normal'}>
            <TableColumn viewMode={viewMode} />
            <tbody>
              {isLoading ? (
                <tr>
                  <td>Loading...</td>
                </tr>
              ) : !tradeData ? (
                <tr>
                  <td>No data available</td>
                </tr>
              ) : viewMode === 'today' ? (
                tradeData.map((eachData: PriceDataType, index: number) => (
                  <TableLiveCard
                    key={`${eachData.stck_cntg_hour}-${index}`}
                    data={eachData}
                  />
                ))
              ) : (
                tradeData.map((eachData: DailyPriceDataType, index: number) => (
                  <TableDayCard
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
