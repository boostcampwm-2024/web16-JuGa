import { Controller, Get } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('/api/ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @ApiOperation({ summary: '랭킹 조회' })
  @Get()
  async getRanking() {
    return this.rankingService.getRanking();
  }
}
