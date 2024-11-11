import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'socket', cors: { origin: '*' } })
export class SocketGateway {
  @WebSocketServer()
  private server: Server;

  sendStockIndexListToClient(stockChart) {
    this.server.emit('chart', stockChart);
  }

  sendStockIndexValueToClient(event, stockIndexValue) {
    this.server.emit(event, stockIndexValue);
  }
}
