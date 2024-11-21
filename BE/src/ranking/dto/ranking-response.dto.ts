import { ApiProperty } from '@nestjs/swagger';
import { RankingResultDto } from './ranking-result.dto';

export class RankingResponseDto {
  @ApiProperty({
    description: '수익률 랭킹',
  })
  profitRateRanking: RankingResultDto;

  @ApiProperty({
    description: '자산 랭킹',
  })
  assetRanking: RankingResultDto;
}
