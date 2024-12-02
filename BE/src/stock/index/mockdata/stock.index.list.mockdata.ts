export const STOCK_INDEX_LIST_MOCK = {
  VALID_DATA: {
    data: {
      output: [
        {
          bsop_hour: '100600',
          bstp_nmix_prpr: '916.77',
          bstp_nmix_prdy_vrss: '11.27',
          prdy_vrss_sign: '2',
          bstp_nmix_prdy_ctrt: '1.24',
          acml_tr_pbmn: '3839797',
          acml_vol: '313374',
          cntg_vol: '870',
        },
      ],
      rt_cd: '0',
      msg_cd: 'MCA00000',
      msg1: '정상처리 되었습니다.',
    },
  },
  INVALID_DATA: {
    data: {
      output: [],
      rt_cd: '1',
      msg_cd: 'MCA00000',
      msg1: '유효하지 않은 토큰입니다.',
    },
  },
};
