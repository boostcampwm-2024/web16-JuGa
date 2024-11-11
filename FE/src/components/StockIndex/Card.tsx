import { useEffect, useRef, useState } from 'react';
import { drawChart } from 'utils/chart';

// const X_LENGTH = 79;

type initialDataType = {
  chart: {
    code: string;
    chart: { time: string; value: string }[];
  };
  code: string;
  value: {
    code: string;
    value: string;
    diff: string;
    diffRate: string;
    sign: string;
  };
};

type StockIndexChartProps = {
  name: string;
  initialData: initialDataType;
};

export function Card({ name, initialData }: StockIndexChartProps) {
  const { chart, value } = initialData;

  const [prices, setPrices] = useState<{ time: string; value: string }[]>(
    chart.chart,
  );
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
        <p className='text-lg font-bold'>{value.value}</p>
        <p className={`font-semibold ${changeColor}`}>
          {value.diff}({value.diffRate}%)
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
