import { Padding, StockChartUnit } from 'types';

export function drawLineChart(
  ctx: CanvasRenderingContext2D,
  data: number[],
  x: number,
  y: number,
  width: number,
  height: number,
  padding: Padding,
  weight: number = 0, // 0~1 y축 범위 가중치
  lineWidth: number = 1,
) {
  if (data.length === 0) return;

  ctx.beginPath();

  const n = data.length;
  const yMax = Math.round(Math.max(...data.map((d) => d)) * (1 + weight));
  const yMin = Math.round(Math.min(...data.map((d) => d)) * (1 - weight));

  data.forEach((e, i) => {
    const cx = x + padding.left + (width * i) / (n - 1);
    const cy = y + padding.top + height - (height * (e - yMin)) / (yMax - yMin);

    if (i === 0) {
      ctx.moveTo(cx, cy);
    } else {
      ctx.lineTo(cx, cy);
    }
  });

  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

export function drawBarChart(
  ctx: CanvasRenderingContext2D,
  data: StockChartUnit[],
  x: number,
  y: number,
  width: number,
  height: number,
  padding: Padding,
) {
  if (data.length === 0) return;
  const n = data.length;

  ctx.beginPath();

  const yMax = Math.round(Math.max(...data.map((d) => +d.acml_vol)) * 1.2);
  const yMin = Math.round(Math.min(...data.map((d) => +d.acml_vol)) * 0.8);

  const gap = Math.floor(width / n);

  const blue = '#2175F3';
  const red = '#FF3700';

  data.forEach((e, i) => {
    const cx = x + padding.left + (width * i) / (n - 1);
    const cy =
      padding.top + ((height - y) * (+e.acml_vol - yMin)) / (yMax - yMin);

    ctx.fillStyle = +e.stck_oprc < +e.stck_clpr ? red : blue;
    ctx.fillRect(cx, height, gap, -cy);
  });

  ctx.stroke();
}

export function drawCandleChart(
  ctx: CanvasRenderingContext2D,
  data: StockChartUnit[],
  x: number,
  y: number,
  width: number,
  height: number,
  padding: Padding,
  weight: number = 0, // 0~1 y축 범위 가중치
) {
  ctx.beginPath();

  const n = data.length;

  const arr = data.map((d) =>
    Math.max(+d.stck_clpr, +d.stck_oprc, +d.stck_hgpr, +d.stck_lwpr),
  );

  const yMax = Math.round(Math.max(...arr) * (1 + weight));
  const yMin = Math.round(Math.min(...arr) * (1 - weight));

  data.forEach((e, i) => {
    ctx.beginPath();

    const { stck_oprc, stck_clpr, stck_hgpr, stck_lwpr } = e;
    const gap = Math.floor(width / n);
    const cx = x + padding.left + (width * i) / (n - 1);

    const openY =
      y + padding.top + height - (height * (+stck_oprc - yMin)) / (yMax - yMin);
    const closeY =
      y + padding.top + height - (height * (+stck_clpr - yMin)) / (yMax - yMin);
    const highY =
      y + padding.top + height - (height * (+stck_hgpr - yMin)) / (yMax - yMin);
    const lowY =
      y + padding.top + height - (height * (+stck_lwpr - yMin)) / (yMax - yMin);

    const blue = '#2175F3';
    const red = '#FF3700';

    if (+stck_oprc > +stck_clpr) {
      ctx.fillStyle = blue;
      ctx.strokeStyle = blue;
      ctx.fillRect(cx, closeY, gap, openY - closeY);
    } else {
      ctx.fillStyle = red;
      ctx.strokeStyle = red;
      ctx.fillRect(cx, openY, gap, closeY - openY);
    }

    const middle = cx + Math.floor(gap / 2);

    ctx.moveTo(middle, highY);
    ctx.lineTo(middle, lowY);
    ctx.stroke();
  });
}

export const drawChart = (
  ctx: CanvasRenderingContext2D,
  data: { time: string; value: string; diff: string }[],
  xLength: number,
) => {
  const n = data.length;

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

  const MIDDLE =
    n > 0
      ? Number(
          (parseFloat(data[0].value) - parseFloat(data[0].diff)).toFixed(2),
        )
      : 50;

  const yMax = Math.max(
    Math.round(Math.max(...data.map((d) => Number(d.value))) * 1.006 * 100),
    MIDDLE * 100,
  );
  const yMin = Math.min(
    Math.round(Math.min(...data.map((d) => Number(d.value))) * 0.994 * 100),
    MIDDLE * 100,
  );

  data.sort((a, b) => {
    if (a.time < b.time) return -1;
    if (a.time > b.time) return 1;
    return 0;
  });

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
  if (n > 1) {
    ctx.beginPath();
    data.forEach((point, i) => {
      const value = Math.round(Number(point.value) * 100);
      const x = padding.left + (chartWidth * i) / (xLength - 1);
      const y =
        padding.top +
        chartHeight -
        (chartHeight * (value - yMin)) / (yMax - yMin);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    const currentValue = Number(data[n - 1].value);
    if (currentValue >= MIDDLE) {
      ctx.strokeStyle = '#FF3700';
    } else {
      ctx.strokeStyle = '#2175F3';
    }
    ctx.lineWidth = 3;
    ctx.stroke();
  }
};

export const drawYLabel = (
  ctx: CanvasRenderingContext2D,
  data: StockChartUnit[],
  width: number,
  height: number,
  padding: Padding,
  weight: number = 0,
) => {
  const values = data
    .map((d) => [+d.stck_hgpr, +d.stck_lwpr, +d.stck_clpr, +d.stck_oprc])
    .flat();

  const yMax = Math.round(Math.max(...values) * (1 + weight));
  const yMin = Math.round(Math.min(...values) * (1 - weight));

  ctx.clearRect(
    0,
    0,
    width + padding.left + padding.right,
    height + padding.top + padding.bottom,
  );

  // 라벨 갯수
  const step = Math.ceil((yMax - yMin) / 3);
  const labels = [];
  for (let value = yMin; value <= yMax; value += step) {
    labels.push(Math.round(value));
  }
  if (!labels.includes(yMax)) {
    labels.push(yMax);
  }

  ctx.font = '24px sans-serif';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  labels.forEach((label) => {
    const yPos =
      padding.top + height - ((label - yMin) / (yMax - yMin)) * height;

    const formattedValue = label.toLocaleString();
    ctx.fillText(formattedValue, width / 2, yPos);
  });
};
