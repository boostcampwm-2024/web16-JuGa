import { Injectable } from '@nestjs/common';
import { StockIndexListChartElementDto } from './dto/stock.index.list.chart.element.dto';
import { StockIndexListElementDto } from './dto/stock.index.list.element.dto';
import { StockIndexValueElementDto } from './dto/stock.index.value.element.dto';

@Injectable()
export class StockIndexService {
  private accessToken: string;
  private expireDateTime: number;

  async getDomesticStockIndexListByCode(code: string, accessToken: string) {
    const url = `${process.env.KOREA_INVESTMENT_BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-index-timeprice`;
    const queryParams = `?FID_INPUT_HOUR_1=300&FID_COND_MRKT_DIV_CODE=U&FID_INPUT_ISCD=${code}`;

    const response = await fetch(url + queryParams, {
      method: 'GET',
      headers: {
        'content-type': 'application/json; charset=utf-8',
        authorization: `Bearer ${accessToken}`,
        appkey: process.env.KOREA_INVESTMENT_APP_KEY,
        appsecret: process.env.KOREA_INVESTMENT_APP_SECRET,
        tr_id: 'FHPUP02110200',
        custtype: 'P',
      },
    });

    const result: StockIndexChartInterface = await response.json();
    if (result.rt_cd !== '0') throw new Error('유효하지 않은 토큰');

    return new StockIndexListElementDto(
      code,
      result.output.map((element) => {
        return new StockIndexListChartElementDto(
          element.bsop_hour,
          element.bstp_nmix_prpr,
        );
      }),
    );
  }

  async getDomesticStockIndexValueByCode(code: string, accessToken: string) {
    const url = `${process.env.KOREA_INVESTMENT_BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-index-price`;
    const queryParams = `?FID_COND_MRKT_DIV_CODE=U&FID_INPUT_ISCD=${code}`;

    const response = await fetch(url + queryParams, {
      method: 'GET',
      headers: {
        'content-type': 'application/json; charset=utf-8',
        authorization: `Bearer ${accessToken}`,
        appkey: process.env.KOREA_INVESTMENT_APP_KEY,
        appsecret: process.env.KOREA_INVESTMENT_APP_SECRET,
        tr_id: 'FHPUP02100000',
        custtype: 'P',
      },
    });

    const result: StockIndexValueInterface = await response.json();
    return new StockIndexValueElementDto(
      code,
      result.output.bstp_nmix_prpr,
      result.output.bstp_nmix_prdy_vrss,
      result.output.bstp_nmix_prdy_vrss,
      result.output.prdy_vrss_sign,
    );
  }

  async getAccessToken() {
    if (!this.accessToken || this.expireDateTime <= Date.now()) {
      const url = 'https://openapivts.koreainvestment.com:29443/oauth2/tokenP';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          appkey: process.env.KOREA_INVESTMENT_APP_KEY,
          appsecret: process.env.KOREA_INVESTMENT_APP_SECRET,
        }),
      });
      const result: AccessTokenInterface = await response.json();
      this.accessToken = result.access_token;
      this.expireDateTime = new Date(
        result.access_token_token_expired,
      ).getTime();
      return result.access_token;
    }

    return this.accessToken;
  }
}

// interfaces

interface AccessTokenInterface {
  access_token: string;
  access_token_token_expired: string;
  token_type: string;
  expires_in: number;
}

interface StockIndexChartInterface {
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

interface StockIndexValueInterface {
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
