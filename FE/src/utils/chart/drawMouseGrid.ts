import { MousePositionType, Padding } from 'types.ts';

export const drawMouseGrid = (
  upperChartCtx: CanvasRenderingContext2D,
  upperChartWidth: number,
  upperChartHeight: number,
  lowerChartCtx: CanvasRenderingContext2D,
  lowerChartWidth: number,
  lowerChartHeight: number,
  padding: Padding,
  mousePosition: MousePositionType,
) => {
  if (
    mousePosition.x > 0 &&
    mousePosition.x < upperChartWidth + padding.left + padding.right
  ) {
    upperChartCtx.beginPath();
    upperChartCtx.setLineDash([10, 10]);
    upperChartCtx.moveTo(mousePosition.x, padding.top);
    upperChartCtx.lineTo(
      mousePosition.x,
      padding.top + upperChartHeight + padding.bottom,
    );

    upperChartCtx.strokeStyle = '#6E8091';
    upperChartCtx.lineWidth = 1;
    upperChartCtx.stroke();

    lowerChartCtx.beginPath();
    lowerChartCtx.setLineDash([10, 10]);
    lowerChartCtx.moveTo(mousePosition.x, 0);
    lowerChartCtx.lineTo(mousePosition.x, lowerChartHeight + padding.top);

    lowerChartCtx.strokeStyle = '#6E8091';
    lowerChartCtx.lineWidth = 1;
    lowerChartCtx.stroke();
  }

  if (
    mousePosition.y > 0 &&
    mousePosition.y < upperChartHeight + padding.top + padding.bottom
  ) {
    upperChartCtx.beginPath();
    upperChartCtx.moveTo(0, mousePosition.y);
    upperChartCtx.lineTo(
      upperChartWidth + padding.left + padding.right,
      mousePosition.y,
    );

    upperChartCtx.strokeStyle = '#6E8091';
    upperChartCtx.lineWidth = 1;
    upperChartCtx.stroke();
  }

  if (
    mousePosition.y > upperChartHeight + padding.top + padding.bottom &&
    mousePosition.y <
      upperChartHeight +
        padding.top +
        padding.bottom +
        lowerChartHeight +
        padding.top +
        padding.bottom
  ) {
    lowerChartCtx.beginPath();
    lowerChartCtx.moveTo(
      0,
      mousePosition.y - (upperChartHeight + padding.top + padding.bottom),
    );
    lowerChartCtx.lineTo(
      lowerChartWidth + padding.left + padding.right,
      mousePosition.y -
        (upperChartHeight + padding.top + padding.bottom + padding.bottom),
    );

    lowerChartCtx.strokeStyle = '#6E8091';
    lowerChartCtx.lineWidth = 1;
    lowerChartCtx.stroke();
  }
};
