/**
 * 주식 현재가 시세 API를 사용할 때 쿼리 파라미터로 사용할 요청값 DTO
 */
export class StockDetailQueryParameterDto {
  /**
   * 조건 시장 분류 코드
   * 'J' 주식
   */
  fid_cond_mrkt_div_code: string;

  /**
   * 주식 종목 코드
   * (ex) 005930
   */
  fid_input_iscd: string;

  /**
   * 조회 시작일자
   * (ex) 20220501
   */
  fid_input_date_1: string;

  /**
   * 조회 종료일자
   * (ex) 20220530
   */
  fid_input_date_2: string;

  /**
   * 기간 분류 코드
   * D:일봉, W:주봉, M:월봉, Y:년봉
   */
  fid_period_div_code: string;
}
