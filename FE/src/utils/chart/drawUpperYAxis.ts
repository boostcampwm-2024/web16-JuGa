import { Padding, StockChartUnit } from '../../types.ts';
import { makeYLabels } from './makeLabels.ts';
import { MousePositionType } from '../../components/StocksDetail/Chart.tsx';

export const drawUpperYAxis = (
  ctx: CanvasRenderingContext2D,
  data: StockChartUnit[],
  width: number,
  height: number,
  labelsNum: number,
  padding: Padding,
  weight: number = 0,
  mousePosition: MousePositionType,
  upperChartWidth: number,
  upperChartHeight: number,
) => {
  const values = data
    .map((d) => [
      +d.stck_hgpr,
      +d.stck_lwpr,
      +d.stck_clpr,
      +d.stck_oprc,
      Math.floor(+d.mov_avg_5),
      Math.floor(+d.mov_avg_20),
    ])
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

  if (
    mousePosition.x > padding.left &&
    mousePosition.x < upperChartWidth &&
    mousePosition.y > padding.top &&
    mousePosition.y < upperChartHeight
  ) {
    const relativeY = mousePosition.y - padding.top;

    const valueRatio = 1 - relativeY / height;
    const mouseValue = yMin + valueRatio * (yMax - yMin);

    const boxPadding = 10;
    const boxHeight = 30;
    const valueText = Math.round(mouseValue).toLocaleString();

    ctx.font = '24px Arial';
    const textWidth = ctx.measureText(valueText).width;

    ctx.fillStyle = '#2175F3';
    const boxX = width / 2 + padding.left - 12;
    const boxY = mousePosition.y - boxHeight / 2;

    ctx.fillRect(boxX, boxY, textWidth + boxPadding * 2, boxHeight);

    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'center';
    ctx.fillText(
      valueText,
      boxX + (textWidth + boxPadding * 2) / 2,
      boxY + boxHeight / 2 + 2,
    );
  }
};
