import { Injectable } from '@nestjs/common';
import axios from 'axios';
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
    const result = await this.requestDomesticStockIndexListApi(
      code,
      accessToken,
    );

    if (result.rt_cd !== '0')
      throw new Error('데이터를 정상적으로 조회하지 못했습니다.');

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
    const result = await this.requestDomesticStockIndexValueApi(
      code,
      accessToken,
    );

    if (result.rt_cd !== '0')
      throw new Error('데이터를 정상적으로 조회하지 못했습니다.');

    return new StockIndexValueElementDto(
      code,
      result.output.bstp_nmix_prpr,
      result.output.bstp_nmix_prdy_vrss,
      result.output.bstp_nmix_prdy_ctrt,
      result.output.prdy_vrss_sign,
    );
  }

  private async requestDomesticStockIndexListApi(
    code: string,
    accessToken: string,
  ) {
    const response = await axios.get<StockIndexChartInterface>(
      `${process.env.KOREA_INVESTMENT_BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-index-timeprice`,
      {
        headers: {
          'content-type': 'application/json; charset=utf-8',
          authorization: `Bearer ${accessToken}`,
          appkey: process.env.KOREA_INVESTMENT_APP_KEY,
          appsecret: process.env.KOREA_INVESTMENT_APP_SECRET,
          tr_id: 'FHPUP02110200',
          custtype: 'P',
        },
        params: {
          fid_input_hour_1: 300,
          fid_cond_mrkt_div_code: 'U',
          fid_input_iscd: code,
        },
      },
    );

    return response.data;
  }

  private async requestDomesticStockIndexValueApi(
    code: string,
    accessToken: string,
  ) {
    const response = await axios.get<StockIndexValueInterface>(
      `${process.env.KOREA_INVESTMENT_BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-index-price`,
      {
        headers: {
          'content-type': 'application/json; charset=utf-8',
          authorization: `Bearer ${accessToken}`,
          appkey: process.env.KOREA_INVESTMENT_APP_KEY,
          appsecret: process.env.KOREA_INVESTMENT_APP_SECRET,
          tr_id: 'FHPUP02100000',
          custtype: 'P',
        },
        params: {
          fid_cond_mrkt_div_code: 'U',
          fid_input_iscd: code,
        },
      },
    );

    return response.data;
  }
}
