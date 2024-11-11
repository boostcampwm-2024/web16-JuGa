const X_LENGTH = 79; // 9:00 ~ 15:30 까지 5분 단위의 총 개수

export const drawChart = (
  ctx: CanvasRenderingContext2D,
  data: { time: string; value: string; diff: string }[],
) => {
  const canvas = ctx.canvas;
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  const padding = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const yMax = Math.round(
    Math.max(...data.map((d) => Number(d.value))) * 1.006 * 100,
  );
  const yMin = Math.round(
    Math.min(...data.map((d) => Number(d.value))) * 0.994 * 100,
  );

  data.sort((a, b) => {
    if (a.time < b.time) return -1;
    if (a.time > b.time) return 1;
    return 0;
  });

  const MIDDLE =
    data.length > 0
      ? Number(
          (parseFloat(data[0].value) - parseFloat(data[0].diff)).toFixed(2),
        )
      : 50;

  const middleY =
    padding.top +
    chartHeight -
    (chartHeight * (MIDDLE * 100 - yMin)) / (yMax - yMin);
  ctx.beginPath();
  ctx.setLineDash([10, 10]);
  ctx.moveTo(padding.left, middleY);
  ctx.lineTo(width - padding.right, middleY);
  ctx.strokeStyle = '#6E8091';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([]);

  // 데이터 선 그리기
  if (data.length > 1) {
    ctx.beginPath();
    data.forEach((point, i) => {
      const value = Math.round(Number(point.value) * 100);
      const x = padding.left + (chartWidth * i) / (X_LENGTH - 1);
      const y =
        padding.top +
        chartHeight -
        (chartHeight * (value - yMin)) / (yMax - yMin);

      // console.log(((value - yMin) / (yMax - yMin)));
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    const currentValue = Number(data[data.length - 1].value);
    if (currentValue >= MIDDLE) {
      ctx.strokeStyle = '#FF3700';
    } else {
      ctx.strokeStyle = '#2175F3';
    }
    ctx.lineWidth = 3;
    ctx.stroke();
  }
};
