import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { StockBookmarkService } from './stock-bookmark.service';
import { JwtAuthGuard } from '../../auth/jwt-auth-guard';

@Controller('/api/stocks/bookmark')
@ApiTags('주식 즐겨찾기 API')
export class StockBookmarkController {
  constructor(private readonly stockBookmarkService: StockBookmarkService) {}

  @Post('/:stockCode')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '종목 즐겨찾기 등록 API' })
  @ApiResponse({
    status: 201,
    description: '종목 즐겨찾기 등록 성공',
  })
  async postBookmark(
    @Req() request: Request,
    @Param('stockCode') stockCode: string,
  ) {
    await this.stockBookmarkService.registerBookmark(
      parseInt(request.user.userId, 10),
      stockCode,
    );
  }

  @Delete('/:stockCode')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '종목 즐겨찾기 취소 API' })
  @ApiResponse({
    status: 200,
    description: '종목 즐겨찾기 취소 성공',
  })
  async deleteBookmark(
    @Req() request: Request,
    @Param('stockCode') stockCode: string,
  ) {
    await this.stockBookmarkService.unregisterBookmark(
      parseInt(request.user.userId, 10),
      stockCode,
    );
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '즐겨찾기 리스트 조회 API' })
  @ApiResponse({
    status: 200,
    description: '즐겨찾기 리스트 조회 성공',
  })
  async getBookmarkList(@Req() request: Request) {
    return this.stockBookmarkService.getBookmarkList(
      parseInt(request.user.userId, 10),
    );
  }
}
