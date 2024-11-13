import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'socket', cors: { origin: '*' } })
export class SocketGateway {
  @WebSocketServer()
  private server: Server;

  sendStockIndexListToClient(stockIndex) {
    this.server.emit('index', stockIndex);
  }

  sendStockIndexValueToClient(stockIndexValue) {
    this.server.emit('indexValue', stockIndexValue);
  }
}
