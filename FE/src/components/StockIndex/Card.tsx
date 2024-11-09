import { useEffect, useRef, useState } from 'react';
import { drawChart } from 'utils/chart';

const X_LENGTH = 79;

type StockIndexChartProps = {
  name: string;
};

export function Card({ name }: StockIndexChartProps) {
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
    <div className='flex h-[100px] w-[260px] items-center gap-4 rounded-lg bg-juga-grayscale-50 p-5'>
      <div className='flex h-full flex-1 flex-col items-start justify-center text-sm'>
        <p className='font-semibold'>{name}</p>
        <p className='text-lg font-bold'>2562.4</p>
        <p className='font-semibold text-juga-blue-40'>-31.55(-1.2%)</p>
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
