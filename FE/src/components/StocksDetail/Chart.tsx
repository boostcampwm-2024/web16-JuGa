import { useEffect, useRef, useState } from 'react';
import { dummy, DummyStock } from './dummy';
import { TiemCategory } from 'types';

type Padding = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export default function Chart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeCategory, setTimeCategory] = useState<TiemCategory>('D');

  const categories: { label: string; value: TiemCategory }[] = [
    { label: '일', value: 'D' },
    { label: '주', value: 'W' },
    { label: '월', value: 'M' },
    { label: '년', value: 'Y' },
  ];

  useEffect(() => {
    const parent = containerRef.current;
    const canvas = canvasRef.current;

    if (!canvas || !parent) return;

    const displayWidth = parent.clientWidth;
    const displayHeight = parent.clientHeight;

    // 해상도 높이기
    canvas.width = displayWidth * 2;
    canvas.height = displayHeight * 2;

    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight * 0.83}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const padding = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    };

    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    const volumeBoundary = chartHeight * 0.2; // chartHeight의 20%
    const mainHeight = chartHeight - volumeBoundary;

    drawLineChart(ctx, dummy, chartWidth, mainHeight, padding);

    drawBarChart(
      ctx,
      dummy,
      chartWidth,
      chartHeight,
      padding,
      0,
      chartHeight * 0.8,
    );

    drawCandleChart(ctx, dummy, chartWidth, mainHeight, padding, 0, 0);
  }, []);

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

function drawLineChart(
  ctx: CanvasRenderingContext2D,
  data: DummyStock[],
  width: number,
  height: number,
  padding: Padding,
  x: number = 0,
  y: number = 0,
) {
  ctx.beginPath();

  const n = data.length;

  const yMax = Math.round(Math.max(...data.map((d) => d.low)) * 1.006 * 100);
  const yMin = Math.round(Math.min(...data.map((d) => d.low)) * 0.994 * 100);

  data.forEach((v, i) => {
    const value = Math.round(v.low * 100);
    const cx = x + padding.left + (width * i) / (n - 1);
    const cy =
      y + padding.top + height - (height * (value - yMin)) / (yMax - yMin);

    if (i === 0) {
      ctx.moveTo(cx, cy);
    } else {
      ctx.lineTo(cx, cy);
    }
  });

  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawBarChart(
  ctx: CanvasRenderingContext2D,
  data: DummyStock[],
  width: number,
  height: number,
  padding: Padding,
  x: number,
  y: number,
) {
  ctx.beginPath();

  const yMax = Math.round(Math.max(...data.map((d) => d.volume)) * 1.006 * 100);
  const yMin = Math.round(Math.min(...data.map((d) => d.volume)) * 0.994 * 100);

  const gap = Math.floor((width / dummy.length) * 0.8);

  const blue = '#2175F3';
  const red = '#FF3700';

  data.forEach((e, i) => {
    const value = Math.round(e.volume * 100);
    const cx = x + padding.left + (width * i) / (dummy.length - 1);
    const cy = padding.top + ((height - y) * (value - yMin)) / (yMax - yMin);

    ctx.fillStyle = e.open < e.close ? red : blue;
    ctx.fillRect(cx, height, gap, -cy);
  });

  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawCandleChart(
  ctx: CanvasRenderingContext2D,
  data: DummyStock[],
  width: number,
  height: number,
  padding: Padding,
  x: number,
  y: number,
) {
  ctx.beginPath();

  const yMax = Math.round(
    Math.max(...data.map((d) => Math.max(d.close, d.open, d.high, d.low))) *
      1.006 *
      100,
  );
  const yMin = Math.round(
    Math.min(...data.map((d) => Math.max(d.close, d.open, d.high, d.low))) *
      0.994 *
      100,
  );

  data.forEach((e, i) => {
    ctx.beginPath();

    const { open, close, high, low } = e;
    const gap = Math.floor((width / dummy.length) * 0.8);
    const cx = x + padding.left + (width * i) / (dummy.length - 1);

    const openValue = Math.round(open * 100);
    const closeValue = Math.round(close * 100);
    const highValue = Math.round(high * 100);
    const lowValue = Math.round(low * 100);

    const openY =
      y + padding.top + height - (height * (openValue - yMin)) / (yMax - yMin);
    const closeY =
      y + padding.top + height - (height * (closeValue - yMin)) / (yMax - yMin);
    const highY =
      y + padding.top + height - (height * (highValue - yMin)) / (yMax - yMin);
    const lowY =
      y + padding.top + height - (height * (lowValue - yMin)) / (yMax - yMin);

    const blue = '#2175F3';
    const red = '#FF3700';

    if (open > close) {
      ctx.fillStyle = blue;
      ctx.strokeStyle = blue;
      ctx.fillRect(cx, closeY, gap, openY - closeY);
    } else {
      ctx.fillStyle = red;
      ctx.strokeStyle = red;
      ctx.fillRect(cx, openY, gap, closeY - openY);
    }

    const middle = cx + Math.floor(gap / 2);

    ctx.moveTo(middle, highY);
    ctx.lineTo(middle, lowY);
    ctx.stroke();
  });
}
