import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StockItemService } from './stock-item.service';

@Controller('/api/stocks/item')
@ApiTags('주식 개별 주 API')
export class StockItemController {
  constructor(private readonly stockItemService: StockItemService) {}
}
