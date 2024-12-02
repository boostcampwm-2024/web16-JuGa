import { Test } from '@nestjs/testing';
import { AssetService } from './asset.service';
import { UserStockRepository } from './user-stock.repository';
import { AssetRepository } from './asset.repository';
import { StockDetailService } from '../stock/detail/stock-detail.service';
import { StockPriceSocketService } from '../stockSocket/stock-price-socket.service';
import { TradeType } from '../stock/order/enum/trade-type';
import { StatusType } from '../stock/order/enum/status-type';

describe('asset test', () => {
  let assetService: AssetService;
  let userStockRepository: UserStockRepository;
  let assetRepository: AssetRepository;
  let stockDetailService: StockDetailService;
  let stockPriceSocketService: StockPriceSocketService;

  beforeEach(async () => {
    const mockUserStockRepository = { findOneBy: jest.fn() };
    const mockAssetRepository = {
      findAllPendingOrders: jest.fn(),
      findOneBy: jest.fn(),
    };
    const mockStockDetailService = {};
    const mockStockPriceSocketService = {};

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
    stockPriceSocketService = module.get(StockPriceSocketService);
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
});
