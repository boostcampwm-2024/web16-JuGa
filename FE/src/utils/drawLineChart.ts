import { Padding, StockChartUnit } from '../types.ts';

export function drawLineChart(
  ctx: CanvasRenderingContext2D,
  data: StockChartUnit[],
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
  const yMax = Math.round(
    Math.max(...data.map((d: StockChartUnit) => +d.stck_oprc)) * (1 + weight),
  );
  const yMin = Math.round(
    Math.min(...data.map((d: StockChartUnit) => +d.stck_oprc)) * (1 - weight),
  );

  data.forEach((e, i) => {
    const cx = x + padding.left + (width * i) / (n - 1);
    const cy =
      y +
      padding.top +
      height -
      (height * (+e.stck_oprc - yMin)) / (yMax - yMin);

    if (i === 0) {
      ctx.moveTo(cx, cy);
    } else {
      ctx.lineTo(cx, cy);
    }
  });

  ctx.lineWidth = lineWidth;
  ctx.stroke();
}
