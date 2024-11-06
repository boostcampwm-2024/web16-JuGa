import { useEffect, useRef, useState } from 'react';
import { drawChart } from 'utils/chart';

const X_LENGTH = 79;

type StockIndexChartProps = {
  name: string;
};

export function Chart({ name }: StockIndexChartProps) {
  const [prices, setPrices] = useState<number[]>([50, 54]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (prices.length === X_LENGTH) {
        clearInterval(interval);
        return;
      }
      setPrices((prev) => [...prev, Math.floor(Math.random() * 50) + 25]);
    }, 500);

    return () => clearInterval(interval);
  }, [prices.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    drawChart(ctx, prices);
  }, [prices]);

  return (
    <div className='flex h-[200px] w-[500px] items-center rounded-lg bg-juga-grayscale-50 p-5'>
      <div className='flex flex-col items-start justify-center flex-1 h-full gap-1 text-sm'>
        <p className='text-lg font-semibold'>{name}</p>
        <p className='text-2xl font-bold'>2562.4</p>
        <p className='font-semibold text-juga-blue-40'>-31.55(-1.2%)</p>
      </div>
      <canvas
        id='lineChart'
        ref={canvasRef}
        width={600}
        height={300}
        className='flex-1 h-full'
      />
    </div>
  );
}
