import { BadRequestException, Injectable } from '@nestjs/common';
import { StockBookmarkRepository } from './stock-bookmark.repository';

@Injectable()
export class StockBookmarkService {
  constructor(
    private readonly stockBookmarkRepository: StockBookmarkRepository,
  ) {}

  async registerBookmark(userId, stockCode) {
    if (
      await this.stockBookmarkRepository.existsBy({
        user_id: userId,
        stock_code: stockCode,
      })
    )
      throw new BadRequestException('이미 등록된 즐겨찾기입니다.');

    const bookmark = this.stockBookmarkRepository.create({
      user_id: userId,
      stock_code: stockCode,
    });
    await this.stockBookmarkRepository.insert(bookmark);
  }
}
