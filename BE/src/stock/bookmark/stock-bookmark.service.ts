import { Injectable } from '@nestjs/common';
import { StockBookmarkRepository } from './stock-bookmark.repository';

@Injectable()
export class StockBookmarkService {
  constructor(
    private readonly stockBookmarkRepository: StockBookmarkRepository,
  ) {}
}
