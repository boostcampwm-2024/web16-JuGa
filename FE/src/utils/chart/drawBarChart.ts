import { Padding, StockChartUnit } from '../../types.ts';

export function drawBarChart(
  ctx: CanvasRenderingContext2D,
  data: StockChartUnit[],
  width: number,
  height: number,
  padding: Padding,
) {
  if (data.length === 0) return;

  const volumes = data.map((d) => +d.acml_vol);
  const yMax = Math.round(Math.max(...volumes) * 1.2);
  const yMin = Math.round(Math.min(...volumes) * 0.8);
  const barWidth = Math.floor(width / data.length);

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
