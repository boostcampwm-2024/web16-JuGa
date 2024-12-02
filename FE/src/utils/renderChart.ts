import { MousePositionType, StockChartUnit } from 'types.ts';
import { drawChartGrid } from './chart/drawChartGrid.ts';
import { padding } from 'constants.ts';
import { drawLineChart } from './chart/drawLineChart.ts';
import { drawCandleChart } from './chart/drawCandleChart.ts';
import { drawBarChart } from './chart/drawBarChart.ts';
import { drawUpperYAxis } from './chart/drawUpperYAxis.ts';
import { drawLowerYAxis } from './chart/drawLowerYAxis.ts';
import { drawXAxis } from './chart/drawXAxis.ts';
import { drawMouseGrid } from './chart/drawMouseGrid.ts';

export const renderChart = (
  upperChartCanvas: HTMLCanvasElement,
  lowerChartCanvas: HTMLCanvasElement,
  upperChartYCanvas: HTMLCanvasElement,
  lowerChartYCanvas: HTMLCanvasElement,
  chartXCanvas: HTMLCanvasElement,
  chartData: StockChartUnit[],
  mousePosition: MousePositionType,
  dataRange: { start: number; end: number },
  upperLabelNum: number,
  lowerLabelNum: number,
  moveAverageToggle: boolean,
  setMouseIndex: (
    value: ((prevState: number | null) => number | null) | number | null,
  ) => void,
) => {
  const UpperChartCtx = upperChartCanvas.getContext('2d');
  const LowerChartCtx = lowerChartCanvas.getContext('2d');
  const UpperYCtx = upperChartYCanvas.getContext('2d');
  const LowerYCtx = lowerChartYCanvas.getContext('2d');
  const ChartXCtx = chartXCanvas.getContext('2d');
  const displayData = chartData.slice(dataRange.start, dataRange.end + 1);
  if (
    !UpperChartCtx ||
    !LowerChartCtx ||
    !UpperYCtx ||
    !LowerYCtx ||
    !ChartXCtx
  )
    return;

  drawChartGrid(
    UpperChartCtx,
    upperChartCanvas.width - padding.left - padding.right,
    upperChartCanvas.height - padding.top - padding.bottom,
    upperLabelNum,
    LowerChartCtx,
    lowerChartCanvas.width - padding.left - padding.right,
    lowerChartCanvas.height - padding.top - padding.bottom,
    lowerLabelNum,
    displayData,
    padding,
  );

  if (moveAverageToggle) {
    drawLineChart(
      UpperChartCtx,
      displayData,
      0,
      0,
      upperChartCanvas.width - padding.left - padding.right,
      upperChartCanvas.height - padding.top - padding.bottom,
      padding,
      0.1,
    );
  }

  drawCandleChart(
    UpperChartCtx,
    displayData,
    0,
    0,
    upperChartCanvas.width - padding.left - padding.right,
    upperChartCanvas.height - padding.top - padding.bottom,
    padding,
    0.1,
  );

  drawBarChart(
    LowerChartCtx,
    displayData,
    lowerChartCanvas.width - padding.left - padding.right,
    lowerChartCanvas.height - padding.top - padding.bottom,
    padding,
  );

  drawUpperYAxis(
    UpperYCtx,
    displayData,
    upperChartYCanvas.width - padding.left - padding.right,
    upperChartYCanvas.height - padding.top - padding.bottom,
    upperLabelNum,
    padding,
    0.1,
    mousePosition,
    upperChartCanvas.width,
    upperChartCanvas.height,
  );

  drawLowerYAxis(
    LowerYCtx,
    displayData,
    lowerChartYCanvas.width - padding.left - padding.right,
    lowerChartYCanvas.height - padding.top - padding.bottom,
    lowerLabelNum,
    padding,
    mousePosition,
    lowerChartCanvas.width,
    lowerChartCanvas.height,
    upperChartCanvas.height,
  );

  drawXAxis(
    ChartXCtx,
    displayData,
    chartXCanvas.width - padding.left - padding.right,
    chartXCanvas.height,
    padding,
    mousePosition,
    upperChartCanvas.height + lowerChartCanvas.height,
    setMouseIndex,
  );

  if (
    mousePosition.x > padding.left &&
    mousePosition.x < upperChartCanvas.width &&
    mousePosition.y > padding.top &&
    mousePosition.y < upperChartCanvas.height + lowerChartCanvas.height
  ) {
    drawMouseGrid(
      UpperChartCtx,
      upperChartCanvas.width - padding.left - padding.right,
      upperChartCanvas.height - padding.top - padding.bottom,
      LowerChartCtx,
      lowerChartCanvas.width - padding.left - padding.right,
      lowerChartCanvas.height - padding.top - padding.bottom,
      padding,
      mousePosition,
    );
  }
};
