import { Padding, StockChartUnit } from '../../types.ts';
import { makeXLabels } from './makeLabels.ts';

export const drawXAxis = (
  ctx: CanvasRenderingContext2D,
  data: StockChartUnit[],
  width: number,
  height: number,
  padding: Padding,
) => {
  const labels = makeXLabels(data);

  ctx.clearRect(
    0,
    0,
    width + padding.left + padding.right,
    height + padding.top + padding.bottom,
  );

  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#000';

  const barWidth = Math.floor(width / data.length);
  data.forEach((item, i) => {
    if (labels.includes(item.stck_bsop_date) || i === data.length - 1) {
      ctx.fillText(
        item.stck_bsop_date,
        padding.left + (width * i) / (data.length - 1) + barWidth / 2,
        height / 2,
      );
    }
  });
};
