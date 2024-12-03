import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger, UseFilters } from '@nestjs/common';
import { WebSocketExceptionFilter } from '../filters/websocket-exception.filter';

@WebSocketGateway({ namespace: 'socket', cors: { origin: '*' } })
@UseFilters(new WebSocketExceptionFilter())
export class SocketGateway {
  @WebSocketServer()
  private server: Server;

  private readonly logger = new Logger();

  sendStockIndexListToClient(stockChart) {
    this.server.emit('chart', stockChart);
  }

  sendStockIndexValueToClient(event, stockIndexValue) {
    const now = new Date();
    if (now.getMinutes() % 5 === 0 && now.getSeconds() === 0)
      this.logger.log('한국투자증권 데이터 발신 성공 (5분 단위)', event);

    this.server.emit(event, stockIndexValue);
  }
}
