import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { UserStockService } from './user-stock.service';

@Controller('/api/userStock')
@ApiTags('사용자 보유 주식 API')
export class UserStockController {
  constructor(private readonly userStockService: UserStockService) {}

  @Get('/:stockCode')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '매도 가능 주식 개수 조회 API',
    description: '특정 주식 매도 시에 필요한 매도 가능한 주식 개수를 조회한다.',
  })
  @ApiResponse({
    status: 200,
    description: '매도 가능 주식 개수 조회 성공',
  })
  async getUserStockByCode(
    @Req() request: Request,
    @Param('stockCode') stockCode: string,
  ) {
    return this.userStockService.getUserStockByCode(
      parseInt(request.user.userId, 10),
      stockCode,
    );
  }
}
