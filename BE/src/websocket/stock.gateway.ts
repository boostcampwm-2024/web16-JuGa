import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'stocks', cors: { origin: '*' } })
export class StockGateway {
  @WebSocketServer()
  server: Server;

  sendStockIndexListToClient(stockIndex) {
    this.server.emit('index', stockIndex);
  }

  sendStockIndexValueToClient(stockIndexValue) {
    this.server.emit('indexValue', stockIndexValue);
  }
}
