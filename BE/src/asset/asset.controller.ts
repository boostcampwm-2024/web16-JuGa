import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Cron } from '@nestjs/schedule';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { AssetService } from './asset.service';
import { MypageResponseDto } from './dto/mypage-response.dto';

@Controller('/api/assets')
@ApiTags('사용자 자산 및 보유 주식 API')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get('/stocks/:stockCode')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '매도 가능 주식 개수, 매수 평균가 조회 API',
    description:
      '특정 주식 매도 시에 필요한 매도 가능한 주식 개수와 매수 평균가를 조회한다.',
  })
  @ApiResponse({
    status: 200,
    description: '매도 가능 주식 개수 및 매수 평균가 조회 성공',
    example: { quantity: 0, avg_price: 0 },
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
    example: { cash_balance: 0 },
  })
  async getCashBalance(@Req() request: Request) {
    return this.assetService.getCashBalance(parseInt(request.user.userId, 10));
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '마이페이지 보유 자산 현황 조회 API',
    description: '마이페이지 조회 시 필요한 보유 자산 현황을 조회한다.',
  })
  @ApiResponse({
    status: 200,
    description: '매수 가능 금액 조회 성공',
    type: MypageResponseDto,
  })
  async getMyPage(@Req() request: Request) {
    return this.assetService.getMyPage(parseInt(request.user.userId, 10));
  }

  @Get('/unsubscribe')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '마이페이지 내 주식 소켓 연결 취소 API',
    description: '마이페이지에서 나갈 때 소켓 연결 취소를 위한 API',
  })
  async unsubscribeMyStocks(@Req() request: Request) {
    await this.assetService.unsubscribeMyStocks(
      parseInt(request.user.userId, 10),
    );
  }

  @Cron('*/10 9-16 * * 1-5')
  async updateAllAssets() {
    await this.assetService.updateAllAssets();
  }

  @Cron('0 8 * * 1-5')
  async updatePrevTotalAsset() {
    await this.assetService.updatePrevTotalAsset();
  }
}
