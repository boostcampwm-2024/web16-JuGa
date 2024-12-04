import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisDomainService } from '../../common/redis/redis.domain-service';
import { StockListRepository } from './stock-list.repostiory';
import { Stocks } from './stock-list.entity';
import { StockListResponseDto } from './dto/stock-list-response.dto';
import { SearchParams } from './interface/search-params.interface';

@Injectable()
export class StockListService {
  private readonly SearchHistoryLimit = 10;

  constructor(
    private readonly stockListRepository: StockListRepository,
    private readonly redisDomainService: RedisDomainService,
  ) {}

  private toResponseDto(stock: Stocks): StockListResponseDto {
    return new StockListResponseDto(stock.code, stock.name, stock.market);
  }

  async findAll() {
    const stocks = await this.stockListRepository.findAllStocks();
    return stocks.map((stock) => this.toResponseDto(stock));
  }

  async findOne(code: string) {
    const stock = await this.stockListRepository.findOneStock(code);

    if (!stock) {
      throw new NotFoundException(`Stock with code ${code} not found`);
    }
    return this.toResponseDto(stock);
  }

  async search(params: SearchParams): Promise<StockListResponseDto[]> {
    const stocks = await this.stockListRepository.search(params);
    return stocks.map((stock) => this.toResponseDto(stock));
  }

  async addSearchTermToRedis(searchInfo: {
    userId: number;
    searchTerm: string;
  }) {
    const { userId, searchTerm } = searchInfo;
    const key = `search:${userId}`;
    const timeStamp = Date.now();

    await this.redisDomainService.zadd(key, timeStamp, searchTerm);

    const searchHistoryCount = await this.redisDomainService.zcard(key);
    if (searchHistoryCount > this.SearchHistoryLimit) {
      await this.redisDomainService.zremrangebyrank(key, 0, 0);
    }
  }

  async getSearchTermFromRedis(userId: string): Promise<string[]> {
    const key = `search:${userId}`;

    return this.redisDomainService.zrevrange(
      key,
      0,
      this.SearchHistoryLimit - 1,
    );
  }
}
