import axios from 'axios';
import { UnauthorizedException } from '@nestjs/common';
import { getFullURL } from '../util/get-full-URL';
import { AccessTokenInterface } from './interface/korea-investment.interface';

export class KoreaInvestmentService {
  private accessToken: string;
  private tokenExpireTime: Date;

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
}
