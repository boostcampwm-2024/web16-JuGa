export type StockData = {
  stck_shrn_iscd: string;
  hts_kor_isnm: string;
  stck_prpr: string;
  prdy_vrss: string;
  prdy_vrss_sign: string;
  prdy_ctrt: string;
};

export type MarketType = '전체' | '코스피' | '코스닥' | '코스피200';
