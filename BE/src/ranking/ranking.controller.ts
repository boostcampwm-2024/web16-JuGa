import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { OptionalAuthGuard } from 'src/auth/optional-auth-guard';
import { RankingService } from './ranking.service';

@Controller('/api/ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @ApiOperation({ summary: '랭킹 조회' })
  @Get()
  @UseGuards(OptionalAuthGuard)
  async getRanking(@Req() req: Request) {
    if (!req.user) {
      return this.rankingService.getRanking();
    }

    const { email } = req.user;
    return this.rankingService.getRankingAuthUser(email);
  }
}
