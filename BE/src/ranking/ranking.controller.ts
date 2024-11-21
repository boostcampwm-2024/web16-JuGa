import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { OptionalAuthGuard } from 'src/auth/optional-auth-guard';
import { RankingService } from './ranking.service';
import { RankingResponseDto } from './dto/ranking-response.dto';

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
  async getRanking(@Req() req: Request): Promise<RankingResponseDto> {
    if (!req.user) {
      return this.rankingService.getRanking();
    }

    const { nickname } = req.user;
    return this.rankingService.getRankingAuthUser(nickname);
  }
}
