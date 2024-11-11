import { ChartData, StockIndexData } from 'components/TopFive/type';
import { useEffect, useRef, useState } from 'react';
import { drawChart } from 'utils/chart';

// const X_LENGTH = 79;

type StockIndexChartProps = {
  name: string;
  initialData: StockIndexData;
};

export function Card({ name, initialData }: StockIndexChartProps) {
  const { chart, value } = initialData;

  const [prices, setPrices] = useState<ChartData[]>(chart);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const changeColor =
    Number(value.diff) > 0 ? 'text-juga-red-60' : 'text-juga-blue-50';

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
        <p className='text-lg font-bold'>{value.curr_value}</p>
        <p className={`font-semibold ${changeColor}`}>
          {value.diff}({value.diff_rate}%)
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
