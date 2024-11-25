import { ApiProperty } from '@nestjs/swagger';
import { StockElementResponseDto } from './stock-element-response.dto';
import { AssetResponseDto } from './asset-response.dto';

export class MypageResponseDto {
  @ApiProperty({
    description: '보유 자산',
    type: AssetResponseDto,
  })
  asset: AssetResponseDto;

  @ApiProperty({
    description: '보유 주식 리스트',
    type: [StockElementResponseDto],
  })
  stocks: StockElementResponseDto[];
}
