import { StockChartUnit } from '../types.ts';

export const makeYLabels = (
  yMax: number,
  yMin: number,
  divideNumber: number,
) => {
  const labels = [];
  const rawTickInterval = Math.ceil((yMax - yMin) / divideNumber);
  const magnitude = 10 ** (String(rawTickInterval).length - 1);
  const tickInterval = Math.floor(rawTickInterval / magnitude) * magnitude;
  const startValue = Math.ceil(yMin / tickInterval) * tickInterval;

  for (let value = startValue; value <= yMax; value += tickInterval) {
    labels.push(Math.round(value));
  }

  return labels;
};

export const makeXLabels = (data: StockChartUnit[]) => {
  const totalDays = data.length;

  // 데이터 양에 따른 표시 간격 결정
  let interval: number;
  if (totalDays <= 10) {
    interval = 1; // 모든 날짜 표시
  } else if (totalDays <= 20) {
    interval = 2; // 2일 간격
  } else if (totalDays <= 30) {
    interval = 5; // 5일 간격
  } else {
    interval = Math.ceil(totalDays / 10); // 약 10개의 라벨 표시
  }

  // 선택된 날짜만 라벨로 반환
  return data
    .filter((_, index) => index % interval === 0)
    .map((item) => item.stck_bsop_date);
};
