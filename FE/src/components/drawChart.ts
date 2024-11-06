const timeLabels = (() => {
  const labels: string[] = [];
  let currentTime = '09:00';
  while (currentTime <= '15:30') {
    labels.push(currentTime);
    const [hours, minutes] = currentTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + 5;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    currentTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  }
  return labels;
})();

type ChartData = [string, number][];

export const drawChart = (ctx: CanvasRenderingContext2D, data: ChartData) => {
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

  const yMax = Math.max(...data.map((d) => d[1])) * 1.1;
  const yMin = Math.min(...data.map((d) => d[1])) * 0.9;

  // 데이터 선 그리기
  if (data.length > 1) {
    ctx.beginPath();
    data.forEach((point, i) => {
      const timeIndex = timeLabels.indexOf(point[0]);
      const x =
        padding.left + (chartWidth * timeIndex) / (timeLabels.length - 1);
      const y =
        padding.top +
        chartHeight -
        (chartHeight * (point[1] - yMin)) / (yMax - yMin);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.strokeStyle = '#2175F3';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
};
