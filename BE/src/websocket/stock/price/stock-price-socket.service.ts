import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseSocketService } from '../../base-socket.service';
import { SocketGateway } from '../../socket.gateway';
import { StockOrderService } from '../../../stock/order/stock-order.service';

@Injectable()
export class StockPriceSocketService {
  private TR_ID = 'H0STCNT0';

  constructor(
    private readonly socketGateway: SocketGateway,
    private readonly baseSocketService: BaseSocketService,
    @Inject(forwardRef(() => StockOrderService))
    private readonly stockOrderService: StockOrderService,
  ) {
    baseSocketService.registerSocketDataHandler(
      this.TR_ID,
      (data: string[]) => {
        stockOrderService
          .checkExecutableOrder(
            data[0], // 주식 코드
            data[2], // 주식 체결가
          )
          .catch(() => {
            throw new InternalServerErrorException();
          });
      },
    );
  }

  subscribeByCode(trKey: string) {
    this.baseSocketService.registerCode(this.TR_ID, trKey);
  }

  unsubscribeByCode(trKey: string) {
    this.baseSocketService.unregisterCode(this.TR_ID, trKey);
  }
}
