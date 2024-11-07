import { Injectable } from '@nestjs/common';
import { StockIndexListChartElementDto } from './dto/stock.index.list.chart.element.dto';
import { StockIndexListElementDto } from './dto/stock.index.list.element.dto';
import { StockIndexValueElementDto } from './dto/stock.index.value.element.dto';
import {
  StockIndexChartInterface,
  StockIndexValueInterface,
} from './interface/stock.index.interface';

@Injectable()
export class StockIndexService {
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
}
