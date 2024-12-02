import { Padding, StockChartUnit } from '../../types.ts';
import { makeXLabels, makeYLabels } from './makeLabels.ts';

export const drawChartGrid = (
  upperChartCtx: CanvasRenderingContext2D,
  upperChartWidth: number,
  upperChartHeight: number,
  upperLabelsNum: number,
  lowerChartCtx: CanvasRenderingContext2D,
  lowerChartWidth: number,
  lowerChartHeight: number,
  lowerLabelsNum: number,
  data: StockChartUnit[],
  padding: Padding,
) => {
  const xAxisLabels = makeXLabels(data);
  const barWidth = Math.floor(lowerChartWidth / data.length);
  lowerChartCtx.beginPath();
  upperChartCtx.beginPath();
  data.forEach((item, i) => {
    if (xAxisLabels.includes(item.stck_bsop_date) || i === data.length - 1) {
      lowerChartCtx.moveTo(
        padding.left + (lowerChartWidth * i) / (data.length - 1) + barWidth / 2,
        0,
      );
      lowerChartCtx.lineTo(
        padding.left + (lowerChartWidth * i) / (data.length - 1) + barWidth / 2,
        lowerChartHeight + padding.bottom,
      );
      upperChartCtx.moveTo(
        padding.left + (upperChartWidth * i) / (data.length - 1) + barWidth / 2,
        padding.top,
      );
      upperChartCtx.lineTo(
        padding.left + (upperChartWidth * i) / (data.length - 1) + barWidth / 2,
        upperChartHeight + padding.top + padding.bottom,
      );
    }
  });

  const volumes = data.map((d) => +d.acml_vol);
  const volumeMax = Math.round(Math.max(...volumes) * 1.2);
  const volumeMin = Math.round(Math.min(...volumes) * 0.8);
  const lowerLabels = makeYLabels(volumeMax, volumeMin, lowerLabelsNum);

  lowerLabels.forEach((label) => {
    const valueRatio = (label - volumeMin) / (volumeMax - volumeMin);
    const yPos = lowerChartHeight - valueRatio * lowerChartHeight;

    lowerChartCtx.moveTo(0, yPos + padding.top);
    lowerChartCtx.lineTo(
      lowerChartWidth + padding.left + padding.right,
      yPos + padding.top,
    );
  });

  lowerChartCtx.moveTo(0, lowerChartHeight + padding.top);
  lowerChartCtx.lineTo(
    lowerChartWidth + padding.left + padding.right,
    lowerChartHeight + padding.top,
  );
  lowerChartCtx.lineTo(lowerChartWidth + padding.left + padding.right, 0);
  lowerChartCtx.strokeStyle = '#D2DAE0';
  lowerChartCtx.lineWidth = 1;
  lowerChartCtx.stroke();

  const values = data
    .map((d) => [+d.stck_hgpr, +d.stck_lwpr, +d.stck_clpr, +d.stck_oprc])
    .flat();
  const valueMax = Math.round(Math.max(...values) * (1 + 0.1));
  const valueMin = Math.round(Math.min(...values) * (1 - 0.1));

  const upperLabels = makeYLabels(valueMax, valueMin, upperLabelsNum);
  upperLabels.forEach((label) => {
    const yPos =
      padding.top +
      upperChartHeight -
      ((label - valueMin) / (valueMax - valueMin)) * upperChartHeight;
    upperChartCtx.moveTo(0, yPos);
    upperChartCtx.lineTo(upperChartWidth + padding.left + padding.right, yPos);
  });
  upperChartCtx.moveTo(
    upperChartWidth + padding.left + padding.right,
    upperChartHeight + padding.top + padding.bottom,
  );
  upperChartCtx.lineTo(
    upperChartWidth + padding.left + padding.right,
    padding.top,
  );
  upperChartCtx.strokeStyle = '#D2DAE0';
  upperChartCtx.lineWidth = 1;
  upperChartCtx.stroke();
};
