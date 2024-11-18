export interface InquireDailyPriceOutputData {
  stck_bsop_date: string;
  stck_oprc: string;
  stck_hgpr: string;
  stck_lwpr: string;
  stck_clpr: string;
  acml_vol: string;
  prdy_vrss_vol_rate: string;
  prdy_vrss: string;
  prdy_vrss_sign: string;
  prdy_ctrt: string;
  hts_frgn_ehrt: string;
  frgn_ntby_qty: string;
  flng_cls_code: string;
  acml_prtt_rate: string;
}

export interface InquireDailyPriceApiResponse {
  output: InquireDailyPriceOutputData[];
  rt_cd: string;
  msg_cd: string;
  msg1: string;
}
