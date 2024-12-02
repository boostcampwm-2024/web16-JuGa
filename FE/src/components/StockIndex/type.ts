export type ChartData = { time: string; value: string; diff: string };

export type StockIndexValue = {
  curr_value: string;
  diff: string;
  diff_rate: string;
  sign: string;
};

export type StockIndexData = {
  chart: ChartData[];
  value: StockIndexValue;
};

export type MarketType = 'KOSPI' | 'KOSDAQ' | 'KOSPI200' | 'KSQ150';
