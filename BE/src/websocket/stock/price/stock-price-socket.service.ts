import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseSocketService } from '../../base-socket.service';
import { SocketGateway } from '../../socket.gateway';
import { StockItemService } from '../../../stock/item/stock-item.service';
import { StockOrderService } from '../../../stock/order/stock-order.service';

@Injectable()
export class StockPriceSocketService {
  private TR_ID = 'H0STCNT0';

  constructor(
    private readonly socketGateway: SocketGateway,
    private readonly baseSocketService: BaseSocketService,
    private readonly stockItemService: StockItemService,
    private readonly stockOrderService: StockOrderService,
  ) {
    baseSocketService.registerSocketOpenHandler(async () => {
      const stockList = await this.stockItemService.getAllStockItems();
      stockList.forEach((stock) => {
        this.baseSocketService.registerCode(this.TR_ID, stock.code);
      });
    });

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
}
