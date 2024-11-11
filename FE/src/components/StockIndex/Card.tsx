import {
  ChartData,
  StockIndexData,
  StockIndexValue,
} from 'components/TopFive/type';
import { useEffect, useRef, useState } from 'react';
import { socket } from 'socket';
import { drawChart } from 'utils/chart';

// const X_LENGTH = 79;

type StockIndexChartProps = {
  name: string;
  id: 'KOSPI' | 'KOSDAQ' | 'KOSPI200' | 'KSQ150';
  initialData: StockIndexData;
};

export function Card({ name, id, initialData }: StockIndexChartProps) {
  const { chart, value } = initialData;
  const [prices, setPrices] = useState<ChartData[]>(chart);
  const [stockIndexValue, setStockIndexValue] =
    useState<StockIndexValue>(value);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const changeColor =
    Number(value.diff) > 0 ? 'text-juga-red-60' : 'text-juga-blue-50';

  socket.on(id, (stockIndex) => {
    setStockIndexValue(stockIndex);
  });

  socket.on('chart', (chartData) => {
    setPrices(chartData.id);
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    drawChart(ctx, prices);
  }, [prices]);

  return (
    <div className='flex h-[100px] w-[260px] items-center justify-between rounded-lg bg-juga-grayscale-50 p-3'>
      <div className='flex h-full w-[108px] flex-1 flex-col items-start justify-center text-sm'>
        <p className='font-semibold'>{name}</p>
        <p className='text-lg font-bold'>{stockIndexValue.curr_value}</p>
        <p className={`font-semibold ${changeColor}`}>
          {stockIndexValue.diff}({stockIndexValue.diff_rate}%)
        </p>
      </div>
      <canvas
        ref={canvasRef}
        width={300}
        height={150}
        className='h-[52px] flex-1'
      />
    </div>
  );
}