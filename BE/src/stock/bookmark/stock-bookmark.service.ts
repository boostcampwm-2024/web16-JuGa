import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StockBookmarkRepository } from './stock-bookmark.repository';
import { StockDetailService } from '../detail/stock-detail.service';
import { StockBookmarkResponseDto } from './dto/stock-bookmark-response,dto';

@Injectable()
export class StockBookmarkService {
  constructor(
    private readonly stockBookmarkRepository: StockBookmarkRepository,
    private readonly stockDetailService: StockDetailService,
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

  async unregisterBookmark(userId, stockCode) {
    const bookmark = await this.stockBookmarkRepository.findOneBy({
      user_id: userId,
      stock_code: stockCode,
    });

    if (!bookmark) throw new NotFoundException('존재하지 않는 북마크입니다.');

    await this.stockBookmarkRepository.remove(bookmark);
  }

  async getBookmarkList(userId) {
    const bookmarks =
      await this.stockBookmarkRepository.findBookmarkWithNameByUserId(userId);

    return Promise.all(
      bookmarks.map(async (bookmark) => {
        const detail = await this.stockDetailService.getInquirePrice(
          bookmark.b_stock_code,
        );

        return new StockBookmarkResponseDto(
          bookmark.s_name,
          bookmark.b_stock_code,
          detail.stck_prpr,
          detail.prdy_vrss,
          detail.prdy_vrss_sign,
          detail.prdy_ctrt,
        );
      }),
    );
  }

  async getBookmarkActive(userId, stockCode) {
    return {
      is_bookmarked: await this.stockBookmarkRepository.existsBy({
        user_id: userId,
        stock_code: stockCode,
      }),
    };
  }
}
