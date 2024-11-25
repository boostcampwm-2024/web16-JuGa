import { ApiProperty } from '@nestjs/swagger';

export class RankingDataDto {
  @ApiProperty({
    description: '사용자 닉네임',
    example: 'trader123',
  })
  nickname: string;

  @ApiProperty({
    description: '랭킹 순위',
    example: 1,
  })
  rank: number;

  @ApiProperty({
    description: '수익률 (%) 혹은 총 자산',
    required: false,
  })
  value: number;
}
