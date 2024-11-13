import { Injectable, NotFoundException } from '@nestjs/common';
import { StockListRepository } from './stock-list.repostiory';
import { Stocks } from './stock-list.entity';
import { StockListResponseDto } from './dto/stock-list-response.dto';
import { SearchParams } from './interface/search-params.interface';

@Injectable()
export class StockListService {
  constructor(private readonly stockListRepository: StockListRepository) {}

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
}
