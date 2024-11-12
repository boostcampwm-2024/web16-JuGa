import { useEffect, useRef } from 'react';
import { dummy, DummyStock } from './dummy';

type Padding = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export default function Chart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const parent = containerRef.current;
    const canvas = canvasRef.current;

    if (!canvas || !parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

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
  }, []);

  return (
    <div className='flex-1' ref={containerRef}>
      <canvas ref={canvasRef} />
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

  data.forEach((e, i) => {
    const value = Math.round(e.volume * 100);
    const cx = x + padding.left + (width * i) / (dummy.length - 1);
    const cy = ((height - y) * (value - yMin)) / (yMax - yMin);

    ctx.fillStyle = e.open < e.close ? 'red' : 'blue';
    ctx.fillRect(cx, height, gap, -cy);
  });

  ctx.lineWidth = 2;
  ctx.stroke();
}
