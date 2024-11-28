import { Padding, StockChartUnit } from '../../types.ts';

export function drawCandleChart(
  ctx: CanvasRenderingContext2D,
  data: StockChartUnit[],
  x: number,
  y: number,
  width: number,
  height: number,
  padding: Padding,
  weight: number = 0,
) {
  const n = data.length;

  const values = data
    .map((d) => {
      if (d.mov_avg_20) {
        return [
          +d.stck_hgpr,
          +d.stck_lwpr,
          +d.stck_clpr,
          +d.stck_oprc,
          Math.floor(+d.mov_avg_5),
          Math.floor(+d.mov_avg_20),
        ];
      } else {
        return [
          +d.stck_hgpr,
          +d.stck_lwpr,
          +d.stck_clpr,
          +d.stck_oprc,
          Math.floor(+d.mov_avg_5),
        ];
      }
    })
    .flat();
  const yMax = Math.round(Math.max(...values) * (1 + weight));
  const yMin = Math.round(Math.min(...values) * (1 - weight));

  data.forEach((e, i) => {
    ctx.beginPath();

    const { stck_oprc, stck_clpr, stck_hgpr, stck_lwpr } = e;
    const gap = Math.floor(width / n);
    const cx = x + padding.left + (width * i) / (n - 1);

    const openY =
      y + padding.top + height - (height * (+stck_oprc - yMin)) / (yMax - yMin);
    const closeY =
      y + padding.top + height - (height * (+stck_clpr - yMin)) / (yMax - yMin);
    const highY =
      y + padding.top + height - (height * (+stck_hgpr - yMin)) / (yMax - yMin);
    const lowY =
      y + padding.top + height - (height * (+stck_lwpr - yMin)) / (yMax - yMin);

    const blue = '#2175F3';
    const red = '#FF3700';

    if (+stck_oprc > +stck_clpr) {
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
