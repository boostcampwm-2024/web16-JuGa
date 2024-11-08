import axios from 'axios';
import { getFullURL } from '../util/getFullURL';

export class KoreaInvestmentService {
  private accessToken: string;
  private tokenExpireTime: Date;

  async getAccessToken() {
    // accessToken이 유효한 경우
    if (this.accessToken && this.tokenExpireTime > new Date()) {
      return this.accessToken;
    }
    const response = await axios.post(getFullURL('/oauth2/tokenP'), {
      grant_type: 'client_credentials',
      appkey: process.env.KOREA_INVESTMENT_APP_KEY,
      appsecret: process.env.KOREA_INVESTMENT_APP_SECRET,
    });

    const { data } = response;

    this.accessToken = data.access_token;
    this.tokenExpireTime = new Date(Date.now() + +data.expires_in);

    return this.accessToken;
  }
}
