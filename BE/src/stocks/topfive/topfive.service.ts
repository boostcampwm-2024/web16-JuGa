import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TopFiveService {
  private accessToken: string;
  private tokenExpireTime: Date;
  private readonly koreaInvestmentConfig: {
    appKey: string;
    appSecret: string;
    baseUrl: string;
  };

  constructor(private readonly config: ConfigService) {
    this.koreaInvestmentConfig = {
      appKey: this.config.get<string>('KOREA_INVESTMENT_APP_KEY'),
      appSecret: this.config.get<string>('KOREA_INVESTMENT_APP_SECRET'),
      baseUrl: this.config.get<string>('KOREA_INVESTMENT_BASE_URL'),
    };
  }

  private async getAccessToken() {
    // accessToken이 유효한 경우
    if (this.accessToken && this.tokenExpireTime > new Date()) {
      return this.accessToken;
    }

    const response = await axios.post(
      `${this.koreaInvestmentConfig.baseUrl}/oauth2/tokenP`,
      {
        grant_type: 'client_credentials',
        appkey: this.koreaInvestmentConfig.appKey,
        appsecret: this.koreaInvestmentConfig.appSecret,
      },
    );

    this.accessToken = response.data.access_token;
    this.tokenExpireTime = new Date(Date.now() + +response.data.expires_in);

    return this.accessToken;
  }
}
