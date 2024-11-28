import { Padding, StockChartUnit } from '../../types.ts';
import { makeYLabels } from './makeLabels.ts';
import { MousePositionType } from '../../components/StocksDetail/Chart.tsx';

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
    ctx.fillText(formattedValue, width / 2 + padding.left, yPos + padding.top);
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
    const boxX = width / 2 + padding.left - 12;
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

const formatNumber = (value: number) => {
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000) {
    const inBillions = value / 1_000_000_000;
    const rounded = Math.round(inBillions * 10) / 10;
    return rounded % 1 === 0
      ? `${rounded.toFixed(0)}B`
      : `${rounded.toFixed(1)}B`;
  }

  if (absValue >= 1_000_000) {
    const inMillions = value / 1_000_000;
    const rounded = Math.round(inMillions * 10) / 10;
    return rounded % 1 === 0
      ? `${rounded.toFixed(0)}M`
      : `${rounded.toFixed(1)}M`;
  }

  if (absValue >= 1_000) {
    const inThousands = value / 1_000;
    const rounded = Math.round(inThousands * 10) / 10;
    return rounded % 1 === 0
      ? `${rounded.toFixed(0)}K`
      : `${rounded.toFixed(1)}K`;
  }

  return value.toString();
};
