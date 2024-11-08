import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { StockIndexListChartElementDto } from './dto/stock.index.list.chart.element.dto';
import { StockIndexListElementDto } from './dto/stock.index.list.element.dto';
import { StockIndexValueElementDto } from './dto/stock.index.value.element.dto';
import {
  StockIndexChartInterface,
  StockIndexValueInterface,
} from './interface/stock.index.interface';
import { getFullURL } from '../../util/getFullURL';
import { getHeader } from '../../util/getHeader';

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

    const data = result.output;

    return new StockIndexValueElementDto(
      code,
      data.bstp_nmix_prpr,
      data.bstp_nmix_prdy_vrss,
      data.bstp_nmix_prdy_ctrt,
      data.prdy_vrss_sign,
    );
  }

  private async requestDomesticStockIndexListApi(
    code: string,
    accessToken: string,
  ) {
    const response = await axios.get<StockIndexChartInterface>(
      getFullURL('/uapi/domestic-stock/v1/quotations/inquire-index-timeprice'),
      {
        headers: getHeader(accessToken, 'FHPUP02110200'),
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
      getFullURL('/uapi/domestic-stock/v1/quotations/inquire-index-price'),
      {
        headers: getHeader(accessToken, 'FHPUP02100000'),
        params: {
          fid_cond_mrkt_div_code: 'U',
          fid_input_iscd: code,
        },
      },
    );

    return response.data;
  }
}
