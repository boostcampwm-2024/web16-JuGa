import { DailyStockTradeHistoryOutputDto } from './daily-stock-trade-history-ouput.dto';

/**
 * 주식현재가 일자별 API 응답값 정제 후 FE에 보낼 DTO
 */
export class DailyStockTradeHistoryResponseDto {
  output: DailyStockTradeHistoryOutputDto[];
}
