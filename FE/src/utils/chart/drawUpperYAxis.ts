import { Padding, StockChartUnit } from '../../types.ts';
import { makeYLabels } from './makeLabels.ts';

export const drawUpperYAxis = (
  ctx: CanvasRenderingContext2D,
  data: StockChartUnit[],
  width: number,
  height: number,
  labelsNum: number,
  padding: Padding,
  weight: number = 0,
) => {
  const values = data
    .map((d) => [+d.stck_hgpr, +d.stck_lwpr, +d.stck_clpr, +d.stck_oprc])
    .flat();
  const yMax = Math.round(Math.max(...values) * (1 + weight));
  const yMin = Math.round(Math.min(...values) * (1 - weight));
  ctx.clearRect(
    0,
    0,
    width + padding.left + padding.right,
    height + padding.top + padding.bottom,
  );

  const labels = makeYLabels(yMax, yMin, labelsNum);
  ctx.font = '24px sans-serif';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.beginPath();

  labels.forEach((label) => {
    const valueRatio = (label - yMin) / (yMax - yMin);
    const yPos = height - valueRatio * height;
    const formattedValue = label.toLocaleString();
    ctx.fillText(formattedValue, width / 2 + padding.left, yPos + padding.top);
  });
};
