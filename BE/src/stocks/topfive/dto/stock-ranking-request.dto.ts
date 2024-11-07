/**
 * 등락률 API를 사용할 때 쿼리 파라미터로 사용할 요청값 DTO
 */
export class StockRankigRequestDto {
  /**
   * 조건 시장 분류 코드
   * 'J' 주식
   */
  fid_cond_mrkt_div_code: string;

  /**
   * 입력 종목 코드
   * '0000' 전체 / '0001' 코스피
   * '1001' 코스닥 / '2001' 코스피200
   */
  fid_input_iscd: string;

  /**
   * 순위 정렬 구분 코드
   * '0' 상승률 / '1' 하락률
   */
  fid_rank_sort_cls_code: string;
}
