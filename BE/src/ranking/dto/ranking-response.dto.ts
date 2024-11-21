import { ApiProperty } from '@nestjs/swagger';

export class RankingResponseDto {
  @ApiProperty({
    description: 'top 10 유저 랭킹',
  })
  topRank: string[];

  @ApiProperty({
    description: '로그인 한 유저의 랭킹',
  })
  userRank?: number | null;
}
