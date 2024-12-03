import { Test } from '@nestjs/testing';
import { DeepPartial } from 'typeorm';
import { AssetService } from './asset.service';
import { UserStockRepository } from './user-stock.repository';
import { AssetRepository } from './asset.repository';
import { StockDetailService } from '../stock/detail/stock-detail.service';
import { StockPriceSocketService } from '../stockSocket/stock-price-socket.service';
import { TradeType } from '../stock/order/enum/trade-type';
import { StatusType } from '../stock/order/enum/status-type';
import { Asset } from './asset.entity';
import { AssetResponseDto } from './dto/asset-response.dto';
import { StockElementResponseDto } from './dto/stock-element-response.dto';
import { MypageResponseDto } from './dto/mypage-response.dto';

describe('asset test', () => {
  let assetService: AssetService;
  let userStockRepository: UserStockRepository;
  let assetRepository: AssetRepository;
  let stockDetailService: StockDetailService;

  beforeEach(async () => {
    const mockUserStockRepository = {
      findOneBy: jest.fn(),
      findUserStockWithNameByUserId: jest.fn(),
      findAllDistinctCode: jest.fn(),
      find: jest.fn(),
    };
    const mockAssetRepository = {
      findAllPendingOrders: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
    };
    const mockStockDetailService = { getInquirePrice: jest.fn() };
    const mockStockPriceSocketService = { subscribeByCode: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        AssetService,
        { provide: UserStockRepository, useValue: mockUserStockRepository },
        { provide: AssetRepository, useValue: mockAssetRepository },
        {
          provide: StockDetailService,
          useValue: mockStockDetailService,
        },
        {
          provide: StockPriceSocketService,
          useValue: mockStockPriceSocketService,
        },
      ],
    }).compile();

    assetService = module.get(AssetService);
    userStockRepository = module.get(UserStockRepository);
    assetRepository = module.get(AssetRepository);
    stockDetailService = module.get(StockDetailService);
  });

  it('보유 주식과 미체결 주문을 모두 반영한 매도 가능 주식 수를 반환한다.', async () => {
    jest.spyOn(userStockRepository, 'findOneBy').mockResolvedValue({
      id: 1,
      user_id: 1,
      stock_code: '005930',
      quantity: 1,
      avg_price: 1000,
      last_updated: new Date(),
    });

    jest.spyOn(assetRepository, 'findAllPendingOrders').mockResolvedValue([
      {
        id: 1,
        user_id: 1,
        stock_code: '005930',
        trade_type: TradeType.SELL,
        amount: 1,
        price: 1000,
        status: StatusType.PENDING,
        created_at: new Date(),
      },
    ]);

    expect(await assetService.getUserStockByCode(1, '005930')).toEqual({
      quantity: 0,
      avg_price: 1000,
    });
  });

  it('보유 자산과 미체결 주문을 모두 반영한 매수 가능 금액을 반환한다.', async () => {
    jest.spyOn(assetRepository, 'findOneBy').mockResolvedValue({
      id: 1,
      user_id: 1,
      stock_balance: 0,
      cash_balance: 1000,
      total_asset: 1000,
      total_profit: 0,
      total_profit_rate: 0,
    });

    jest.spyOn(assetRepository, 'findAllPendingOrders').mockResolvedValue([
      {
        id: 1,
        user_id: 1,
        stock_code: '005930',
        trade_type: TradeType.BUY,
        amount: 1,
        price: 1000,
        status: StatusType.PENDING,
        created_at: new Date(),
      },
    ]);

    expect(await assetService.getCashBalance(1)).toEqual({
      cash_balance: 0,
    });
  });

  it('마이페이지 조회 시 종목의 현재가를 반영한 총 자산을 반환한다.', async () => {
    jest
      .spyOn(userStockRepository, 'findUserStockWithNameByUserId')
      .mockResolvedValue([
        {
          user_stocks_id: 1,
          user_stocks_user_id: 1,
          user_stocks_stock_code: '005930',
          user_stocks_quantity: 1,
          user_stocks_avg_price: '1000',
          user_stocks_last_updated: new Date(),
          stocks_code: '005930',
          stocks_name: '삼성전자',
          stocks_market: 'KOSPI',
        },
      ]);

    jest.spyOn(assetRepository, 'findOneBy').mockResolvedValue({
      id: 1,
      user_id: 1,
      stock_balance: 0,
      cash_balance: 1000,
      total_asset: 1000,
      total_profit: 0,
      total_profit_rate: 0,
    });

    jest
      .spyOn(userStockRepository, 'findAllDistinctCode')
      .mockResolvedValue([{ stock_code: '005930' }]);

    jest.spyOn(stockDetailService, 'getInquirePrice').mockResolvedValue({
      hts_kor_isnm: '삼성전자',
      stck_shrn_iscd: '005930',
      stck_prpr: '53600',
      prdy_vrss: '-600',
      prdy_vrss_sign: '5',
      prdy_ctrt: '-1.11',
      hts_avls: '3199803',
      per: '25.15',
      stck_mxpr: '70400',
      stck_llam: '38000',
      is_bookmarked: false,
    });

    jest.spyOn(userStockRepository, 'find').mockResolvedValue([
      {
        id: 1,
        user_id: 1,
        stock_code: '005930',
        quantity: 1,
        avg_price: 1000,
        last_updated: new Date(),
      },
    ]);

    jest
      .spyOn(assetRepository, 'save')
      .mockImplementation((updatedAsset) =>
        Promise.resolve(updatedAsset as DeepPartial<Asset> & Asset),
      );

    const assetResponse = new AssetResponseDto(
      1000,
      53600,
      54600,
      -9945400,
      '-99.45',
      false,
    );
    const stockElementResponse = new StockElementResponseDto(
      '삼성전자',
      '005930',
      1,
      1000,
      '53600',
      '-600',
      '5',
      '-1.11',
    );

    const expected = new MypageResponseDto();
    expected.asset = assetResponse;
    expected.stocks = [stockElementResponse];

    expect(await assetService.getMyPage(1)).toEqual(expected);
  });
});
