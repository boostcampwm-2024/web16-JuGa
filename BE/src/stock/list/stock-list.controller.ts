import { Controller, Get, Query } from '@nestjs/common';
import { StockListService } from './stock-list.service';
import { StockResponseDto } from './dto/stock-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('주식 리스트 API')
@Controller('/api/stocks/list')
export class StockListController {
  constructor(private readonly stockListService: StockListService) {}

  @ApiOperation({
    summary: '전체 주식 종목 조회 API',
    description: '모든 주식 종목 리스트를 조회한다.',
  })
  @Get()
  async findAll(): Promise<StockResponseDto[]> {
    return await this.stockListService.findAll();
  }

  @ApiOperation({
    summary: '주식 목록 검색 API',
    description:
      '주식 종목을 검색한다. name, market, code로 검색을 진행할 수 있다.',
  })
  @ApiResponse({
    status: 200,
    description: '주식 검색 성공',
    type: StockResponseDto,
    isArray: true,
  })
  @Get('/search')
  async searchWithQuery(
    @Query('name') name?: string,
    @Query('market') market?: string,
    @Query('code') code?: string,
  ): Promise<StockResponseDto[]> {
    return await this.stockListService.search({ name, market, code });
  }

  @ApiOperation({
    summary: '특정 주식 종목 조회 API',
    description: 'code를 이용해 특정 주식 정보를 조회한다.',
  })
  @ApiResponse({
    status: 200,
    description: 'code를 이용한 주식 조회 성공',
    type: StockResponseDto,
  })
  @Get('/:code')
  async findOne(@Query('code') code: string): Promise<StockResponseDto> {
    return await this.stockListService.findOne(code);
  }
}
