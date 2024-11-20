import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { OptionalAuthGuard } from 'src/auth/optional-auth-guard';
import { RankingService } from './ranking.service';
import { RankingResponseDto } from './dto/ranking-response.dto';
import { SortType } from './enum/sort-type.enum';

@Controller('/api/ranking')
@ApiTags('랭킹 API')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @ApiOperation({ summary: '랭킹 조회' })
  @ApiResponse({
    status: 200,
    description: '랭킹 조회 성공',
    type: RankingResponseDto,
  })
  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'profitRate: 수익률순, totalAsset: 자산순',
    enum: ['profitRate', 'totalAsset'],
  })
  async getRanking(
    @Req() req: Request,
    @Query('sortBy') sortBy: SortType = SortType.PROFIT_RATE,
  ): Promise<RankingResponseDto> {
    if (!req.user) {
      return this.rankingService.getRanking(sortBy);
    }

    const { nickname } = req.user;
    return this.rankingService.getRankingAuthUser(nickname, sortBy);
  }
}
