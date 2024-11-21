import { ApiProperty } from '@nestjs/swagger';

export class RankingDataDto {
  @ApiProperty({
    description: '사용자 닉네임',
    example: 'trader123',
  })
  nickname: string;

  @ApiProperty({
    description: '수익률 (%)',
    example: 15.7,
    required: false,
  })
  profitRate?: number;

  @ApiProperty({
    description: '총 자산',
    example: 1000000,
    required: false,
  })
  totalAsset?: number;
}
