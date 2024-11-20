import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { AssetService } from './asset.service';

@Controller('/api/assets')
@ApiTags('사용자 자산 및 보유 주식 API')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get('/stocks/:stockCode')
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
    return this.assetService.getUserStockByCode(
      parseInt(request.user.userId, 10),
      stockCode,
    );
  }

  @Get('/cash')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '매수 가능 금액 조회 API',
    description:
      '특정 주식 매수 시에 필요한 매수 가능한 금액(현재 가용자산)을 조회한다.',
  })
  @ApiResponse({
    status: 200,
    description: '매수 가능 금액 조회 성공',
  })
  async getCashBalance(@Req() request: Request) {
    return this.assetService.getCashBalance(parseInt(request.user.userId, 10));
  }
}
