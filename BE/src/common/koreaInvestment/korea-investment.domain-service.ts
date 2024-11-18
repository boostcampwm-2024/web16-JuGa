import axios from 'axios';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { getFullURL } from '../../util/get-full-URL';
import { AccessTokenInterface } from './interface/korea-investment.interface';
import { getHeader } from '../../util/get-header';

export class KoreaInvestmentDomainService {
  private accessToken: string;
  private tokenExpireTime: Date;

  private readonly logger = new Logger();

  async getAccessToken() {
    // accessToken이 유효한 경우
    if (this.accessToken && this.tokenExpireTime > new Date()) {
      return this.accessToken;
    }
    const response = await axios
      .post<AccessTokenInterface>(getFullURL('/oauth2/tokenP'), {
        grant_type: 'client_credentials',
        appkey: process.env.KOREA_INVESTMENT_APP_KEY,
        appsecret: process.env.KOREA_INVESTMENT_APP_SECRET,
      })
      .catch(() => {
        throw new UnauthorizedException('액세스 토큰을 조회하지 못했습니다.');
      });

    const { data } = response;

    this.accessToken = data.access_token;
    this.tokenExpireTime = new Date(data.access_token_token_expired);

    return this.accessToken;
  }

  /**
   * @private 한국투자 Open API - API 호출용 공통 함수
   * @param {string} trId - API 호출에 사용할 tr_id
   * @param {string} apiURL - API 호출에 사용할 URL
   * @param {Record<string, string>} params - API 요청 시 필요한 쿼리 파라미터 DTO
   * @returns - API 호출에 대한 응답 데이터
   *
   * @author uuuo3o
   */
  async requestApi<T>(
    trId: string,
    apiURL: string,
    params: Record<string, string>,
  ): Promise<T> {
    try {
      const accessToken = await this.getAccessToken();
      const headers = getHeader(accessToken, trId);
      const url = getFullURL(apiURL);

      const response = await axios.get<T>(url, {
        headers,
        params,
      });

      return response.data;
    } catch (error) {
      this.logger.error('API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.config?.headers,
        message: error.message,
      });
      throw error;
    }
  }
}
