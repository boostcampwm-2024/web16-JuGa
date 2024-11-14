import { DummyStock } from 'components/StocksDetail/dummy';
import { Padding } from 'types';

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
  data: DummyStock[],
  x: number,
  y: number,
  width: number,
  height: number,
  padding: Padding,
  weight: number = 0, // 0~1 y축 범위 가중치
) {
  if (data.length === 0) return;
  const n = data.length;

  ctx.beginPath();

  const yMax = Math.round(Math.max(...data.map((d) => d.volume)) * 1 + weight);
  const yMin = Math.round(Math.min(...data.map((d) => d.volume)) * 1 - weight);

  const gap = Math.floor((width / n) * 0.8);

  const blue = '#2175F3';
  const red = '#FF3700';

  data.forEach((e, i) => {
    const cx = x + padding.left + (width * i) / (n - 1);
    const cy = padding.top + ((height - y) * (e.volume - yMin)) / (yMax - yMin);

    ctx.fillStyle = e.open < e.close ? red : blue;
    ctx.fillRect(cx, height, gap, -cy);
  });

  ctx.stroke();
}

export function drawCandleChart(
  ctx: CanvasRenderingContext2D,
  data: DummyStock[],
  x: number,
  y: number,
  width: number,
  height: number,
  padding: Padding,
  weight: number = 0, // 0~1 y축 범위 가중치
) {
  ctx.beginPath();

  const n = data.length;

  const yMax = Math.round(
    Math.max(...data.map((d) => Math.max(d.close, d.open, d.high, d.low))) *
      (1 + weight),
  );
  const yMin = Math.round(
    Math.min(...data.map((d) => Math.max(d.close, d.open, d.high, d.low))) *
      (1 - weight),
  );

  const labels = getYAxisLabels(yMin, yMax);
  labels.forEach((label) => {
    const yPos =
      padding.top + height - ((label - yMin) / (yMax - yMin)) * height;

    // 라벨 텍스트 그리기
    ctx.font = '20px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'start';
    ctx.fillText(label.toLocaleString(), padding.left + width + 10, yPos + 5);

    // Y축 눈금선 그리기
    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    ctx.moveTo(0, yPos);
    ctx.lineTo(padding.left + width, yPos);
    ctx.stroke();
  });

  data.forEach((e, i) => {
    ctx.beginPath();

    const { open, close, high, low } = e;
    const gap = Math.floor((width / n) * 0.8);
    const cx = x + padding.left + (width * i) / (n - 1);

    const openY =
      y + padding.top + height - (height * (open - yMin)) / (yMax - yMin);
    const closeY =
      y + padding.top + height - (height * (close - yMin)) / (yMax - yMin);
    const highY =
      y + padding.top + height - (height * (high - yMin)) / (yMax - yMin);
    const lowY =
      y + padding.top + height - (height * (low - yMin)) / (yMax - yMin);

    const blue = '#2175F3';
    const red = '#FF3700';

    if (open > close) {
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

function getYAxisLabels(min: number, max: number) {
  let a = min.toString().length - 1;
  let k = 1;
  while (a--) k *= 10;

  const start = Math.ceil(min / k) * k;
  const end = Math.floor(max / k) * k;
  const labels = [];
  for (let value = start; value <= end; value += k) {
    labels.push(value);
  }
  return labels;
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
    n > 0
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
