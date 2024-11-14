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
};
