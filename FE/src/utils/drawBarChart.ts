import { Padding, StockChartUnit } from '../types.ts';
import { makeYLabels } from './makeLabels.ts';

export function drawBarChart(
  ctx: CanvasRenderingContext2D,
  data: StockChartUnit[],
  width: number,
  height: number,
  padding: Padding,
) {
  if (data.length === 0) return;

  ctx.clearRect(
    0,
    0,
    width + padding.left + padding.right,
    height + padding.top + padding.bottom,
  );

  const volumes = data.map((d) => +d.acml_vol);
  const yMax = Math.round(Math.max(...volumes) * 1.2);
  const yMin = Math.round(Math.min(...volumes) * 0.8);
  const barWidth = Math.floor(width / data.length);

  const labels = makeYLabels(yMax, yMin, 2);

  ctx.beginPath();

  labels.forEach((label) => {
    const valueRatio = (label - yMin) / (yMax - yMin);
    const yPos = height - valueRatio * height;

    ctx.moveTo(0, yPos + padding.top);
    ctx.lineTo(width + padding.left + padding.right, yPos + padding.top);
  });

  ctx.moveTo(0, height + padding.top);
  ctx.lineTo(width + padding.left + padding.right, height + padding.top);
  ctx.strokeStyle = '#D2DAE0';
  ctx.lineWidth = 2;
  ctx.stroke();

  data.forEach((item, i) => {
    const value = +item.acml_vol;
    const valueRatio = (value - yMin) / (yMax - yMin);

    const barX = padding.left + (width * i) / (data.length - 1);
    const barHeight = valueRatio * height;

    ctx.beginPath();
    ctx.fillStyle = +item.stck_oprc < +item.stck_clpr ? '#FF3700' : '#2175F3';

    ctx.fillRect(
      barX,
      height + padding.top,
      barWidth,
      -(barHeight + padding.bottom),
    );
  });
}
