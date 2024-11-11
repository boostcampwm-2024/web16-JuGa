import {
  ChartData,
  StockIndexData,
  StockIndexValue,
} from 'components/TopFive/type';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
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

  const socket = io('http://223.130.151.42:3000/socket');

  socket.on(id, (stockIndex) => {
    setStockIndexValue(stockIndex);
  });

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (prices.length === X_LENGTH) {
  //       clearInterval(interval);
  //       return;
  //     }
  //     setPrices((prev) => [...prev, Math.floor(Math.random() * 50) + 25]);
  //   }, 500);

  //   return () => clearInterval(interval);
  // }, [prices.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    drawChart(ctx, prices);
  }, [prices]);

  return (
    <div className='flex h-[100px] w-[260px] items-center gap-4 rounded-lg bg-juga-grayscale-50 p-5'>
      <div className='flex flex-col items-start justify-center flex-1 h-full text-sm'>
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
