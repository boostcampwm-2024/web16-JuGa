export interface InquireCCNLOutputData {
  stck_cntg_hour: string;
  stck_prpr: string;
  prdy_vrss: string;
  prdy_vrss_sign: string;
  cntg_vol: string;
  tday_rltv: string;
  prdy_ctrt: string;
}

export interface InquireCCNLApiResponse {
  output: InquireCCNLOutputData[];
  rt_cd: string;
  msg_cd: string;
  msg1: string;
}
