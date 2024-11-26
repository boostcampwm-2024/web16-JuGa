import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NaverApiDomianService {
  /**
   * @private NAVER Developers Search API - API 호출용 공통 함수
   * @param {Record<string, string>} params - API 요청 시 필요한 쿼리 파라미터 DTO
   * @returns - API 호출에 대한 응답 데이터
   *
   * @author uuuo3o
   */
  async requestApi<T>(params: Record<string, string | number>): Promise<T> {
    const headers = {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
    };
    const url = 'https://openapi.naver.com/v1/search/news.json';

    console.log(params);

    const response = await axios.get<T>(url, {
      headers,
      params,
    });

    return response.data;
  }
}
