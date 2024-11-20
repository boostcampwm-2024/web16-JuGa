import { Padding, StockChartUnit } from '../../types.ts';
import { makeYLabels } from './makeLabels.ts';

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
  const volumes = data.map((d) => +d.acml_vol);
  const volumeMax = Math.round(Math.max(...volumes) * 1.2);
  const volumeMin = Math.round(Math.min(...volumes) * 0.8);
  const lowerLabels = makeYLabels(volumeMax, volumeMin, lowerLabelsNum);

  lowerChartCtx.beginPath();

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
  lowerChartCtx.lineWidth = 2;
  lowerChartCtx.stroke();

  const values = data
    .map((d) => [+d.stck_hgpr, +d.stck_lwpr, +d.stck_clpr, +d.stck_oprc])
    .flat();
  const yMax = Math.round(Math.max(...values) * (1 + 0.1));
  const yMin = Math.round(Math.min(...values) * (1 - 0.1));

  const labels = makeYLabels(yMax, yMin, upperLabelsNum);
  upperChartCtx.beginPath();
  labels.forEach((label) => {
    const yPos =
      padding.top +
      upperChartHeight -
      ((label - yMin) / (yMax - yMin)) * upperChartHeight;
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
  upperChartCtx.lineWidth = 2;
  upperChartCtx.stroke();
};
