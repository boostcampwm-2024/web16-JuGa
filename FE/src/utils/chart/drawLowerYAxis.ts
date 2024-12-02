import { MousePositionType, Padding, StockChartUnit } from 'types.ts';
import { makeYLabels } from './makeLabels.ts';
import { formatNumber } from 'utils/format.ts';

export const drawLowerYAxis = (
  ctx: CanvasRenderingContext2D,
  data: StockChartUnit[],
  width: number,
  height: number,
  labelsNum: number,
  padding: Padding,
  mousePosition: MousePositionType,
  lowerChartWidth: number,
  lowerChartHeight: number,
  upperChartHeight: number,
) => {
  ctx.clearRect(
    0,
    0,
    width + padding.left + padding.right,
    height + padding.top + padding.bottom,
  );

  const yMax = Math.round(Math.max(...data.map((d) => +d.acml_vol)) * 1.2);
  const yMin = Math.round(Math.min(...data.map((d) => +d.acml_vol)) * 0.8);

  const labels = makeYLabels(yMax, yMin, labelsNum);
  ctx.font = '24px sans-serif';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  ctx.beginPath();
  labels.forEach((label) => {
    const valueRatio = (label - yMin) / (yMax - yMin);
    const yPos = height - valueRatio * height;
    const formattedValue = formatNumber(label);
    ctx.fillText(
      formattedValue,
      width / 2 + padding.left / 2,
      yPos + padding.top,
    );
  });

  if (
    mousePosition.x > padding.left &&
    mousePosition.x < lowerChartWidth &&
    mousePosition.y > upperChartHeight &&
    mousePosition.y < upperChartHeight + lowerChartHeight
  ) {
    const relativeY =
      mousePosition.y - padding.top - padding.bottom - upperChartHeight;

    const valueRatio = 1 - relativeY / height;
    const mouseValue = yMin + valueRatio * (yMax - yMin);

    const boxPadding = 10;
    const boxHeight = 30;
    const valueText = formatNumber(Math.round(mouseValue));

    ctx.font = '24px Arial';
    const textWidth = ctx.measureText(valueText).width;

    ctx.fillStyle = '#2175F3';
    const boxX = width / 2 + padding.left / 2 - 12;
    const boxY =
      mousePosition.y - upperChartHeight - padding.bottom - boxHeight / 2;

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
