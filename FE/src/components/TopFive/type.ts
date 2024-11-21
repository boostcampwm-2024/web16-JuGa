export type StockData = {
  stck_shrn_iscd: string;
  hts_kor_isnm: string;
  stck_prpr: string;
  prdy_vrss: string;
  prdy_vrss_sign: string;
  prdy_ctrt: string;
};

export type MarketType = '전체' | '코스피' | '코스닥' | '코스피200';

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
