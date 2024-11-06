import { useEffect, useState } from 'react';
import { drawChart } from './drawChart.ts';

type ChartData = [string, number][];

export function Chart() {
  const initialData: ChartData = [
    ['09:00', 50],
    ['09:05', 54],
  ];

  const [data, setData] = useState<ChartData>(initialData);

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
    const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawChart(ctx, data);
  }, [data]);

  return (
    <div className='flex h-[200px] w-[500px] items-center justify-between rounded-lg bg-juga-grayscale-50 px-5 py-[18px]'>
      <div className={'w-[50px] text-sm'}>
        <div>코스피</div>
        <div>100,000</div>
        <div>-10.0%</div>
      </div>
      <canvas
        id='lineChart'
        width={600}
        height={300}
        className='h-[150px] w-[300px]'
      />
    </div>
  );
}
