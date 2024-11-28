export type LoginSuccessResponse = {
  accessToken: string;
};

export type LoginFailResponse = {
  error: string;
  message: string[];
  statusCode: number;
};

export type TiemCategory = 'D' | 'W' | 'M' | 'Y';

export type Padding = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export type StockDetailType = {
  hts_kor_isnm: string;
  stck_shrn_iscd: string;
  stck_prpr: string;
  prdy_vrss: string;
  prdy_vrss_sign: string;
  prdy_ctrt: string;
  hts_avls: string;
  per: string;
  stck_mxpr: string;
  stck_llam: string;
  is_bookmarked: boolean;
};

export type StockChartUnit = {
  stck_bsop_date: string;
  stck_clpr: string;
  stck_oprc: string;
  stck_hgpr: string;
  stck_lwpr: string;
  acml_vol: string;
  prdy_vrss_sign: string;
  mov_avg_5?: string;
  mov_avg_20?: string;
};

export type MypageSectionType = 'account' | 'order' | 'bookmark' | 'info';

export type Asset = {
  cash_balance: string;
  stock_balance: string;
  total_asset: string;
  total_profit: string;
  total_profit_rate: string;
  is_positive: boolean;
};

export type MyStockListUnit = {
  avg_price: number;
  code: string;
  name: string;
  stck_prpr: string;
  prdy_vrss: string;
  prdy_vrss_sign: string;
  prdy_ctrt: string;
  quantity: number;
};

export type AssetsResponse = {
  asset: Asset;
  stocks: MyStockListUnit[];
};

export type Order = {
  id: number;
  stock_code: string;
  stock_name: string;
  amount: number;
  price: number;
  trade_type: 'BUY' | 'SELL';
  created_at: string;
};

export type ChartSizeConfigType = {
  upperHeight: number;
  lowerHeight: number;
  chartWidth: number;
  yAxisWidth: number;
  xAxisHeight: number;
};

export type Profile = {
  name: string;
  email: string;
};

export type BookmakredStock = {
  name: string;
  code: string;
  stck_prpr: string;
  prdy_vrss: string;
  prdy_vrss_sign: string;
  prdy_ctrt: string;
};
