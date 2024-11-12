import axios from 'axios';
import { SocketConnectTokenInterface } from './interface/socket.interface';
import { getFullURL } from '../util/get-full-URL';

export class SocketTokenService {
  private approvalKey: string;

  async getSocketConnectionKey() {
    if (this.approvalKey) {
      return this.approvalKey;
    }

    const response = await axios.post<SocketConnectTokenInterface>(
      getFullURL('/oauth2/Approval'),
      {
        grant_type: 'client_credentials',
        appkey: process.env.KOREA_INVESTMENT_APP_KEY,
        secretkey: process.env.KOREA_INVESTMENT_APP_SECRET,
      },
    );

    this.approvalKey = response.data.approval_key;
    return this.approvalKey;
  }
}
