import { ApiProperty } from '@nestjs/swagger';
import { RankingDataDto } from './ranking-data.dto';

export class RankingResultDto {
  @ApiProperty({
    description: '상위 10명의 랭킹 데이터',
    type: [RankingDataDto],
  })
  topRank: RankingDataDto[];

  @ApiProperty({
    description: '현재 사용자의 순위 (없을 경우 null)',
    example: 42,
    nullable: true,
  })
  userRank: number | null;
}
