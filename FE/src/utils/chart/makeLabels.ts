import { StockChartUnit } from '../../types.ts';

export const makeYLabels = (
  yMax: number,
  yMin: number,
  divideNumber: number,
) => {
  const labels = [];
  const rawTickInterval = Math.ceil((yMax - yMin) / divideNumber);
  const magnitude = 10 ** (String(rawTickInterval).length - 1);
  const tickInterval = Math.round(rawTickInterval / magnitude) * magnitude;
  const startValue = Math.ceil(yMin / tickInterval) * tickInterval;

  for (let value = startValue; value <= yMax; value += tickInterval) {
    labels.push(Math.round(value));
  }

  return labels;
};

export const makeXLabels = (data: StockChartUnit[]) => {
  const totalData = data.length;

  // 데이터 양에 따른 표시 간격 결정
  let interval: number;
  if (totalData <= 10) {
    interval = 1;
  } else if (totalData <= 20) {
    interval = 2;
  } else if (totalData <= 30) {
    interval = 5;
  } else {
    interval = 6;
  }

  // 선택된 날짜만 라벨로 반환
  return data
    .filter((_, index) => index % interval === 0)
    .map((item) => item.stck_bsop_date);
};
