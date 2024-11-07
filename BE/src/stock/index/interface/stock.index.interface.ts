export interface AccessTokenInterface {
  access_token: string;
  access_token_token_expired: string;
  token_type: string;
  expires_in: number;
}

export interface StockIndexChartInterface {
  output: StockIndexChartElementInterface[];
  rt_cd: string;
  msg_cd: string;
  msg1: string;
}

interface StockIndexChartElementInterface {
  bsop_hour: string;
  bstp_nmix_prpr: string;
  bstp_nmix_prdy_vrss: string;
  prdy_vrss_sign: string;
  bstp_nmix_prdy_ctrt: string;
  acml_tr_pbmn: string;
  acml_vol: string;
  cntg_vol: string;
}

export interface StockIndexValueInterface {
  output: {
    bstp_nmix_prpr: string;
    bstp_nmix_prdy_vrss: string;
    prdy_vrss_sign: string;
    bstp_nmix_prdy_ctrt: string;
    acml_vol: string;
    prdy_vol: string;
    acml_tr_pbmn: string;
    prdy_tr_pbmn: string;
    bstp_nmix_oprc: string;
    prdy_nmix_vrss_nmix_oprc: string;
    oprc_vrss_prpr_sign: string;
    bstp_nmix_oprc_prdy_ctrt: string;
    bstp_nmix_hgpr: string;
    prdy_nmix_vrss_nmix_hgpr: string;
    hgpr_vrss_prpr_sign: string;
    bstp_nmix_hgpr_prdy_ctrt: string;
    bstp_nmix_lwpr: string;
    prdy_clpr_vrss_lwpr: string;
    lwpr_vrss_prpr_sign: string;
    prdy_clpr_vrss_lwpr_rate: string;
    ascn_issu_cnt: string;
    uplm_issu_cnt: string;
    stnr_issu_cnt: string;
    down_issu_cnt: string;
    lslm_issu_cnt: string;
    dryy_bstp_nmix_hgpr: string;
    dryy_hgpr_vrss_prpr_rate: string;
    dryy_bstp_nmix_hgpr_date: string;
    dryy_bstp_nmix_lwpr: string;
    dryy_lwpr_vrss_prpr_rate: string;
    dryy_bstp_nmix_lwpr_date: string;
    total_askp_rsqn: string;
    total_bidp_rsqn: string;
    seln_rsqn_rate: string;
    shnu_rsqn_rate: string;
    ntby_rsqn: string;
  };
  rt_cd: string;
  msg_cd: string;
  msg1: string;
}
