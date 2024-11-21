import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { Request } from 'express';
import { Cron } from '@nestjs/schedule';
import { StockOrderService } from './stock-order.service';
import { StockOrderRequestDto } from './dto/stock-order-request.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth-guard';
import { StockOrderElementResponseDto } from './dto/stock-order-element-response.dto';

@Controller('/api/stocks/trade')
@ApiTags('주식 매수/매도 API')
export class StockOrderController {
  constructor(private readonly stockOrderService: StockOrderService) {}

  @Post('/buy')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '주식 매수 API',
    description: '주식 id, 매수 가격, 수량으로 주식을 매수한다.',
  })
  @ApiResponse({
    status: 201,
    description: '주식 매수 예약 등록 성공',
  })
  async buy(
    @Req() request: Request,
    @Body(ValidationPipe) stockOrderRequest: StockOrderRequestDto,
  ) {
    await this.stockOrderService.buy(
      parseInt(request.user.userId, 10),
      stockOrderRequest,
    );
  }

  @Post('/sell')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '주식 매도 API',
    description: '주식 id, 매도 가격, 수량으로 주식을 매도한다.',
  })
  @ApiResponse({
    status: 201,
    description: '주식 매도 예약 등록 성공',
  })
  async sell(
    @Req() request: Request,
    @Body(ValidationPipe) stockOrderRequest: StockOrderRequestDto,
  ) {
    await this.stockOrderService.sell(
      parseInt(request.user.userId, 10),
      stockOrderRequest,
    );
  }

  @Delete('/:orderId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '주식 매도/매수 취소 API',
    description: '주문 id로 미체결된 주문을 취소한다.',
  })
  @ApiResponse({
    status: 200,
    description: '주식 매도/매수 취소 성공',
  })
  async cancel(@Req() request: Request, @Param('orderId') orderId: number) {
    await this.stockOrderService.cancel(
      parseInt(request.user.userId, 10),
      orderId,
    );
  }

  @Get('/list')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '미체결 주문 리스트 조회 API',
    description: '미체결 주문 취소를 위해, 미체결된 주문 리스트를 조회한다.',
  })
  @ApiResponse({
    status: 200,
    description: '미체결 주문 리스트 조회 성공',
    type: [StockOrderElementResponseDto],
  })
  async getPendingList(@Req() request: Request) {
    return this.stockOrderService.getPendingListByUserId(
      parseInt(request.user.userId, 10),
    );
  }

  @Cron('0 6 * * *')
  async cronRemovePendingOrders() {
    await this.stockOrderService.removePendingOrders();
  }
}
