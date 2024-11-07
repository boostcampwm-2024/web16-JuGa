import { ApiProperty } from '@nestjs/swagger';
import { StockRankingDataDto } from './stock-ranking-data.dto';

/**
 * 순위 정렬 후 FE에 보낼 DTO
 */
export class StockRankingResponseDto {
  @ApiProperty({ type: [StockRankingDataDto], description: '상승률 순위' })
  high: StockRankingDataDto[];

  @ApiProperty({ type: [StockRankingDataDto], description: '하락률 순위' })
  low: StockRankingDataDto[];
}
