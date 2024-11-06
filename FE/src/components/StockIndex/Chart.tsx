import { useEffect, useRef, useState } from 'react';
import { drawChart } from '../drawChart.ts';

type StockIndexChartProps = {
  name: string;
};

type ChartData = [string, number][];

export function Chart({ name }: StockIndexChartProps) {
  const initialData: ChartData = [
    ['09:00', 50],
    ['09:05', 54],
  ];

  const [data, setData] = useState<ChartData>(initialData);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getNextTime = (currentTime: string): string => {
    const [hours, minutes] = currentTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + 5;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  };

  useEffect(() => {
    let currentTime = data[data.length - 1][0];

    const interval = setInterval(() => {
      if (typeof currentTime === 'string') {
        currentTime = getNextTime(currentTime);
      }

      if (currentTime > '15:30') {
        clearInterval(interval);
        return;
      }

      setData((prev) => [
        ...prev,
        [currentTime, Math.floor(Math.random() * 50) + 25],
      ]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    drawChart(ctx, data);
  }, [data]);

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
