import { MousePositionType, Padding, StockChartUnit } from 'types.ts';
import { makeXLabels } from './makeLabels.ts';
import { formatTime } from 'utils/format.ts';

export const drawXAxis = (
  ctx: CanvasRenderingContext2D,
  data: StockChartUnit[],
  width: number,
  height: number,
  padding: Padding,
  mousePosition: MousePositionType,
  parentHeight: number,
  setMouseIndex: (
    value: ((prevState: number | null) => number | null) | number | null,
  ) => void,
) => {
  const labels = makeXLabels(data);

  ctx.clearRect(
    0,
    0,
    width + padding.left + padding.right,
    height + padding.top + padding.bottom,
  );

  ctx.font = '22px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#000';

  const barWidth = Math.floor(width / data.length);
  data.forEach((item, i) => {
    if (labels.includes(item.stck_bsop_date)) {
      ctx.fillText(
        formatTime(item.stck_bsop_date),
        padding.left + (width * i) / (data.length - 1) + barWidth / 2,
        height / 2,
      );
    }
  });

  if (
    mousePosition.x > 0 &&
    mousePosition.x < width + padding.left + padding.right &&
    mousePosition.y > padding.top &&
    mousePosition.y < parentHeight
  ) {
    const mouseX = mousePosition.x - padding.left;
    const dataIndex = Math.floor((mouseX / width) * (data.length - 1));
    if (dataIndex >= 0 && dataIndex < data.length) {
      setMouseIndex(dataIndex);
      const boxPadding = 10;
      const boxHeight = 30;
      const mouseDate = data[dataIndex].stck_bsop_date;
      const dateText = formatTime(mouseDate);

      ctx.font = '22px Arial ';
      const textWidth = ctx.measureText(dateText).width;

      const boxX =
        padding.left +
        (width * dataIndex) / (data.length - 1) -
        textWidth / 2 +
        15;
      const boxY = height / 2 - 20;

      ctx.fillStyle = '#2175F3';
      ctx.fillRect(boxX, boxY, textWidth + boxPadding * 2, boxHeight);

      ctx.fillStyle = '#FFF';
      ctx.fillText(
        dateText,
        padding.left + (width * dataIndex) / (data.length - 1) + 24,
        boxY + boxHeight / 2 + 8,
      );
    }
  } else setMouseIndex(null);
};
