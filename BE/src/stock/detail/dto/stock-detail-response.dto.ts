import { ApiProperty } from '@nestjs/swagger';
import { InquirePriceOutput1Dto } from './stock-detail-output1.dto';
import { InquirePriceOutput2Dto } from './stock-detail-output2.dto';

/**
 * 순위 정렬 후 FE에 보낼 DTO
 */
export class InquirePriceResponseDto {
  @ApiProperty({ type: InquirePriceOutput1Dto, description: '상승률 순위' })
  output1: InquirePriceOutput1Dto;

  @ApiProperty({ type: [InquirePriceOutput2Dto], description: '하락률 순위' })
  output2: InquirePriceOutput2Dto[];
}
