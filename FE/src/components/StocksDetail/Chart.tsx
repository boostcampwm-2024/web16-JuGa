import { useEffect, useRef, useState } from 'react';
import { TiemCategory } from 'types';
import { drawBarChart, drawCandleChart, drawLineChart } from 'utils/chart';
import { useQuery } from '@tanstack/react-query';
import { getStocksChartDataByCode } from 'service/stocks';

const categories: { label: string; value: TiemCategory }[] = [
  { label: '일', value: 'D' },
  { label: '주', value: 'W' },
  { label: '월', value: 'M' },
  { label: '년', value: 'Y' },
];

type StocksDeatailChartProps = {
  code: string;
};

export default function Chart({ code }: StocksDeatailChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeCategory, setTimeCategory] = useState<TiemCategory>('D');

  const { data, isLoading } = useQuery(
    ['stocksChartData', code, timeCategory],
    () => getStocksChartDataByCode(code, timeCategory),
  );

  useEffect(() => {
    if (isLoading) return;
    if (!data) return;

    const parent = containerRef.current;
    const canvas = canvasRef.current;

    if (!canvas || !parent) return;

    const displayWidth = parent.clientWidth;
    const displayHeight = parent.clientHeight;

    // 해상도 높이기
    canvas.width = displayWidth * 2;
    canvas.height = displayHeight * 2;

    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight * 0.8}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const padding = {
      top: 20,
      right: 80,
      bottom: 10,
      left: 20,
    };

    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    const boundary = chartHeight * 0.8; // chartHeight의 80%

    const arr = data.map((e) => +e.stck_oprc);

    drawLineChart(ctx, arr, 0, 0, chartWidth, boundary, padding, 0.1);
    drawBarChart(ctx, data, 0, boundary, chartWidth, chartHeight, padding);
    drawCandleChart(ctx, data, 0, 0, chartWidth, boundary, padding, 0.1);
  }, [timeCategory, data, isLoading]);

  return (
    <div
      className='flex flex-col items-center flex-1 p-3 rounded-lg bg-juga-grayscale-50'
      ref={containerRef}
    >
      <div className='flex items-center justify-between w-full'>
        <p className='font-semibold'>차트</p>
        <nav className='flex gap-4 text-sm'>
          {categories.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setTimeCategory(value)}
              className={`${timeCategory === value ? 'bg-gray-200' : ''} h-7 w-7 rounded-lg p-1 transition hover:bg-juga-grayscale-100`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
      <canvas ref={canvasRef} className='p-3' />
    </div>
  );
}
