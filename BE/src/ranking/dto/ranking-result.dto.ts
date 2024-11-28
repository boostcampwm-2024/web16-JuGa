import { ApiProperty } from '@nestjs/swagger';
import { RankingDataDto } from './ranking-data.dto';

export class RankingResultDto {
  @ApiProperty({
    description: '상위 10명의 랭킹 데이터',
    type: [RankingDataDto],
  })
  topRank: RankingDataDto[];

  @ApiProperty({
    description: '현재 사용자의 랭킹 데이터',
    example: { rank: 1, value: 10000, nickname: 'trader' },
    nullable: true,
  })
  userRank: RankingDataDto;
}
