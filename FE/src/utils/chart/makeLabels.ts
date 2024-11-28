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

  let desiredLabelCount: number;
  if (totalData < 10) {
    desiredLabelCount = 1;
  } else if (totalData < 20) {
    desiredLabelCount = 2;
  } else if (totalData < 30) {
    desiredLabelCount = 3;
  } else {
    desiredLabelCount = 5;
  }

  if (totalData === 1) {
    return [data[0].stck_bsop_date];
  }

  const interval = Math.max(
    1,
    Math.floor((totalData - 1) / (desiredLabelCount - 1)),
  );
  const labels: string[] = [];

  labels.push(data[0].stck_bsop_date);

  for (let i = interval; i < totalData - interval; i += interval) {
    labels.push(data[i].stck_bsop_date);
  }

  if (totalData > 1) {
    labels.push(data[totalData - 1].stck_bsop_date);
  }

  return labels;
};
