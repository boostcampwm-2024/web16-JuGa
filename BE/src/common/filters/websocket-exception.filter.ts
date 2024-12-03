import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch()
export class WebSocketExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(WebSocketExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient();

    const message =
      exception instanceof WsException
        ? exception.message
        : 'Internal WebSocket Error';

    const errorResponse = {
      event: 'error',
      message,
      timestamp: new Date().toISOString(),
    };

    this.logger.error(`WebSocket Error: ${message}`, exception.stack);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    client.send(JSON.stringify(errorResponse));
  }
}
