import { Padding, StockChartUnit } from '../../types.ts';
import { makeYLabels } from './makeLabels.ts';

export const drawLowerYAxis = (
  ctx: CanvasRenderingContext2D,
  data: StockChartUnit[],
  width: number,
  height: number,
  padding: Padding,
) => {
  ctx.clearRect(
    0,
    0,
    width + padding.left + padding.right,
    height + padding.top + padding.bottom,
  );

  ctx.beginPath();
  ctx.moveTo(padding.left, 0);
  ctx.lineTo(padding.left, height + padding.top);
  ctx.strokeStyle = '#D2DAE0';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, height + padding.top);
  ctx.lineTo(padding.left, height + padding.top);
  ctx.stroke();

  const yMax = Math.round(Math.max(...data.map((d) => +d.acml_vol)) * 1.2);
  const yMin = Math.round(Math.min(...data.map((d) => +d.acml_vol)) * 0.8);

  const labels = makeYLabels(yMax, yMin, 2);
  ctx.font = '24px sans-serif';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  ctx.beginPath();
  labels.forEach((label) => {
    const valueRatio = (label - yMin) / (yMax - yMin);
    const yPos = height - valueRatio * height;
    const formattedValue = formatNumber(label);
    ctx.moveTo(0, yPos + padding.top);
    ctx.lineTo(padding.left, yPos + padding.top);
    ctx.fillText(formattedValue, width / 2 + padding.left, yPos + padding.top);
  });
  ctx.strokeStyle = '#D2DAE0';
  ctx.lineWidth = 2;
  ctx.stroke();
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
