import { ApiProperty } from '@nestjs/swagger';

/**
 * 국내주식기간별시세(일/주/월/년) API를 이용할 때 필요한 요청 데이터를 담고 있는 DTO
 */
export class StockDetailChartRequestDto {
  @ApiProperty({ description: '조회 시작일자 (ex) 20220501' })
  fid_input_date_1: string;

  @ApiProperty({ description: '조회 종료일자 (ex) 20220530' })
  fid_input_date_2: string;

  @ApiProperty({
    description: '기간 분류 코드 (ex) D(일봉) W(주봉) M(월봉) Y(년봉)',
  })
  fid_period_div_code: string;
}
