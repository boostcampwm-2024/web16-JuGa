import { Injectable } from '@nestjs/common';

@Injectable()
export class StockIndexService {
  private accessToken: string;
  private expireDateTime: number;

  async getDomesticStockIndexListByCode(code: string) {
    const accessToken = await this.getAccessToken();

    const url =
      'https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-index-timeprice';
    const queryParams = `?FID_INPUT_HOUR_1=300&FID_COND_MRKT_DIV_CODE=U&FID_INPUT_ISCD=${code}`;

    const response = await fetch(url + queryParams, {
      method: 'GET',
      headers: {
        'content-type': 'application/json; charset=utf-8',
        authorization: `Bearer ${accessToken}`,
        appkey: process.env.APP_KEY,
        appsecret: process.env.APP_SECRET,
        tr_id: 'FHPUP02110200',
        custtype: 'P',
      },
    });

    const result = await response.json();
    return {
      code,
      indexList: result.output.map((element) => {
        return { time: element.bsop_hour, value: element.bstp_nmix_prpr };
      }),
    };
  }

  async getDomesticStockIndexValueByCode(code: string) {
    const accessToken = await this.getAccessToken();

    const url =
      'https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-index-price';
    const queryParams = `?FID_COND_MRKT_DIV_CODE=U&FID_INPUT_ISCD=${code}`;

    const response = await fetch(url + queryParams, {
      method: 'GET',
      headers: {
        'content-type': 'application/json; charset=utf-8',
        authorization: `Bearer ${accessToken}`,
        appkey: process.env.APP_KEY,
        appsecret: process.env.APP_SECRET,
        tr_id: 'FHPUP02100000',
        custtype: 'P',
      },
    });

    const result = await response.json();
    return {
      code,
      value: result.output.bstp_nmix_prpr,
      diff: result.output.bstp_nmix_prdy_vrss,
      diffRate: result.output.bstp_nmix_prdy_vrss,
      sign: result.output.prdy_vrss_sign,
    };
  }

  private async getAccessToken() {
    if (!this.accessToken || this.expireDateTime <= Date.now()) {
      const url = 'https://openapivts.koreainvestment.com:29443/oauth2/tokenP';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          appkey: process.env.APP_KEY,
          appsecret: process.env.APP_SECRET,
        }),
      });
      const result = await response.json();
      this.accessToken = result.access_token;
      this.expireDateTime = new Date(
        result.access_token_token_expired,
      ).getTime();
      return this.accessToken;
    }

    return this.accessToken;
  }
}
