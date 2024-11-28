import { Padding, StockChartUnit } from '../../types.ts';

export function drawLineChart(
  ctx: CanvasRenderingContext2D,
  data: StockChartUnit[],
  x: number,
  y: number,
  width: number,
  height: number,
  padding: Padding,
  weight: number = 0,
  lineWidth: number = 4,
) {
  if (data.length === 0) return;

  ctx.beginPath();

  const n = data.length;
  const gap = Math.floor(width / n);

  const values = data
    .map((d) => {
      if (d.mov_avg_20 && d.mov_avg_5) {
        return [
          +d.stck_hgpr,
          +d.stck_lwpr,
          +d.stck_clpr,
          +d.stck_oprc,
          Math.floor(+d.mov_avg_5),
          Math.floor(+d.mov_avg_20),
        ];
      } else if (d.mov_avg_5) {
        return [
          +d.stck_hgpr,
          +d.stck_lwpr,
          +d.stck_clpr,
          +d.stck_oprc,
          Math.floor(+d.mov_avg_5),
        ];
      } else if (d.mov_avg_20) {
        return [
          +d.stck_hgpr,
          +d.stck_lwpr,
          +d.stck_clpr,
          +d.stck_oprc,
          Math.floor(+d.mov_avg_20),
        ];
      } else {
        return [+d.stck_hgpr, +d.stck_lwpr, +d.stck_clpr, +d.stck_oprc];
      }
    })
    .flat();
  const yMax = Math.round(Math.max(...values) * (1 + weight));
  const yMin = Math.round(Math.min(...values) * (1 - weight));

  data.forEach((e, i) => {
    if (e.mov_avg_5) {
      const cx = x + padding.left + (width * i) / (n - 1) + gap / 2;
      const cy =
        y +
        padding.top +
        height -
        (height * (+e.mov_avg_5 - yMin)) / (yMax - yMin);

      if (i === 0) {
        ctx.moveTo(cx, cy);
      } else {
        ctx.lineTo(cx, cy);
      }
    }
  });
  ctx.strokeStyle = 'rgb(249 115 22)';
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  ctx.beginPath();
  data.forEach((e, i) => {
    if (e.mov_avg_20) {
      const cx = x + padding.left + (width * i) / (n - 1) + gap / 2;
      const cy =
        y +
        padding.top +
        height -
        (height * (+e.mov_avg_20 - yMin)) / (yMax - yMin);

      if (i === 0) {
        ctx.moveTo(cx, cy);
      } else {
        ctx.lineTo(cx, cy);
      }
    }
  });
  ctx.strokeStyle = 'rgb(22 163 74)';
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}
