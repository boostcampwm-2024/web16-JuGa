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
      top: 20,
      right: 80,
      bottom: 10,
      left: 20,
    };

    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    const boundary = chartHeight * 0.8; // chartHeight의 80%

    const data = dummy.map((e) => e.low);

    drawLineChart(ctx, data, 0, 0, chartWidth, boundary, padding, 0.1);
    drawBarChart(ctx, dummy, 0, boundary, chartWidth, chartHeight, padding);
    drawCandleChart(ctx, dummy, 0, 0, chartWidth, boundary, padding, 0.1);
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
  data: number[],
  x: number,
  y: number,
  width: number,
  height: number,
  padding: Padding,
  weight: number = 0, // 0~1 y축 범위 가중치
  lineWidth: number = 1,
) {
  if (data.length === 0) return;

  ctx.beginPath();

  const n = data.length;
  const yMax = Math.round(Math.max(...data.map((d) => d)) * (1 + weight));
  const yMin = Math.round(Math.min(...data.map((d) => d)) * (1 - weight));

  data.forEach((e, i) => {
    const cx = x + padding.left + (width * i) / (n - 1);
    const cy = y + padding.top + height - (height * (e - yMin)) / (yMax - yMin);

    if (i === 0) {
      ctx.moveTo(cx, cy);
    } else {
      ctx.lineTo(cx, cy);
    }
  });

  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawBarChart(
  ctx: CanvasRenderingContext2D,
  data: DummyStock[],
  x: number,
  y: number,
  width: number,
  height: number,
  padding: Padding,
  weight: number = 0, // 0~1 y축 범위 가중치
) {
  if (data.length === 0) return;

  ctx.beginPath();

  const yMax = Math.round(Math.max(...data.map((d) => d.volume)) * 1 + weight);
  const yMin = Math.round(Math.min(...data.map((d) => d.volume)) * 1 - weight);

  const gap = Math.floor((width / dummy.length) * 0.8);

  const blue = '#2175F3';
  const red = '#FF3700';

  data.forEach((e, i) => {
    const cx = x + padding.left + (width * i) / (dummy.length - 1);
    const cy = padding.top + ((height - y) * (e.volume - yMin)) / (yMax - yMin);

    ctx.fillStyle = e.open < e.close ? red : blue;
    ctx.fillRect(cx, height, gap, -cy);
  });

  ctx.stroke();
}

function drawCandleChart(
  ctx: CanvasRenderingContext2D,
  data: DummyStock[],
  x: number,
  y: number,
  width: number,
  height: number,
  padding: Padding,
  weight: number = 0, // 0~1 y축 범위 가중치
) {
  ctx.beginPath();

  const yMax = Math.round(
    Math.max(...data.map((d) => Math.max(d.close, d.open, d.high, d.low))) *
      (1 + weight),
  );
  const yMin = Math.round(
    Math.min(...data.map((d) => Math.max(d.close, d.open, d.high, d.low))) *
      (1 - weight),
  );

  const labels = getYAxisLabels(yMin, yMax);
  labels.forEach((label) => {
    const yPos =
      padding.top + height - ((label - yMin) / (yMax - yMin)) * height;

    // 라벨 텍스트 그리기
    ctx.font = '20px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'start';
    ctx.fillText(label.toLocaleString(), padding.left + width + 10, yPos + 5);

    // Y축 눈금선 그리기
    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    ctx.moveTo(0, yPos);
    ctx.lineTo(padding.left + width, yPos);
    ctx.stroke();
  });

  data.forEach((e, i) => {
    ctx.beginPath();

    const { open, close, high, low } = e;
    const gap = Math.floor((width / dummy.length) * 0.8);
    const cx = x + padding.left + (width * i) / (dummy.length - 1);

    const openY =
      y + padding.top + height - (height * (open - yMin)) / (yMax - yMin);
    const closeY =
      y + padding.top + height - (height * (close - yMin)) / (yMax - yMin);
    const highY =
      y + padding.top + height - (height * (high - yMin)) / (yMax - yMin);
    const lowY =
      y + padding.top + height - (height * (low - yMin)) / (yMax - yMin);

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

function getYAxisLabels(min: number, max: number) {
  let a = min.toString().length - 1;
  let k = 1;
  while (a--) k *= 10;

  const start = Math.ceil(min / k) * k;
  const end = Math.floor(max / k) * k;
  const labels = [];
  for (let value = start; value <= end; value += k) {
    labels.push(value);
  }
  return labels;
}
