import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StockOrderService } from './stock-order.service';
import { StockOrderRequestDto } from './dto/stock-order-request.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth-guard';
import { RequestInterface } from './interface/request.interface';

@Controller('/api/stocks/trade')
@ApiTags('주식 매수/매도 API')
export class StockOrderController {
  constructor(private readonly stockTradeService: StockOrderService) {}

  @Post('/buy')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '주식 매수 API',
    description: '주식 id, 매수 가격, 수량으로 주식을 매수한다.',
  })
  @ApiResponse({
    status: 201,
    description: '주식 매수 성공',
  })
  async buy(
    @Req() request: RequestInterface,
    @Body(ValidationPipe) stockOrderRequest: StockOrderRequestDto,
  ) {
    await this.stockTradeService.buy(request.user.id, stockOrderRequest);
  }
}
