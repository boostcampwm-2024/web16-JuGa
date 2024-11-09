const X_LENGTH = 79; // 9:00 ~ 15:30 까지 5분 단위의 총 개수
const MIDDLE = 50; // 상한가, 하한가를 나누는 기준

export const drawChart = (ctx: CanvasRenderingContext2D, data: number[]) => {
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

  const yMax = Math.max(...data.map((d) => d)) * 1.1;
  const yMin = Math.min(...data.map((d) => d)) * 0.9;

  const middleY =
    padding.top + chartHeight - (chartHeight * (MIDDLE - yMin)) / (yMax - yMin);
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
      const x = padding.left + (chartWidth * i) / (X_LENGTH - 1);
      const y =
        padding.top +
        chartHeight -
        (chartHeight * (point - yMin)) / (yMax - yMin);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    const currentValue = data[data.length - 1];
    if (currentValue >= MIDDLE) {
      ctx.strokeStyle = '#FF3700';
    } else {
      ctx.strokeStyle = '#2175F3';
    }
    ctx.lineWidth = 3;
    ctx.stroke();
  }
};
