import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StockBookmarkService } from './stock-bookmark.service';

@Controller('/api/stocks/bookmark')
@ApiTags('주식 즐겨찾기 API')
export class StockBookmarkController {
  constructor(private readonly stockBookmarkService: StockBookmarkService) {}
}
