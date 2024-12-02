import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { StockOrderService } from './stock-order.service';
import { StockOrderRepository } from './stock-order.repository';
import { StockPriceSocketService } from '../../stockSocket/stock-price-socket.service';
import { UserStockRepository } from '../../asset/user-stock.repository';
import { AssetRepository } from '../../asset/asset.repository';
import { TradeType } from './enum/trade-type';
import { StatusType } from './enum/status-type';

jest.mock('../../asset/asset.repository');
jest.mock('./stock-order.repository');

describe('stock order test', () => {
  let stockOrderService: StockOrderService;
  let stockOrderRepository: StockOrderRepository;
  let assetRepository: AssetRepository;
  let userStockRepository: UserStockRepository;

  beforeEach(async () => {
    const mockStockOrderRepository = {
      findBy: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };
    const mockAssetRepository = { findOneBy: jest.fn() };
    const mockStockPriceSocketService = { subscribeByCode: jest.fn() };
    const mockUserStockRepository = { findOneBy: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        StockOrderService,
        { provide: StockOrderRepository, useValue: mockStockOrderRepository },
        { provide: AssetRepository, useValue: mockAssetRepository },
        {
          provide: StockPriceSocketService,
          useValue: mockStockPriceSocketService,
        },
        { provide: UserStockRepository, useValue: mockUserStockRepository },
      ],
    }).compile();

    stockOrderService = module.get(StockOrderService);
    stockOrderRepository = module.get(StockOrderRepository);
    assetRepository = module.get(AssetRepository);
    userStockRepository = module.get(UserStockRepository);
  });

  it('충분한 자산을 가지고 특정 주식에 대해 매수를 요청할 경우, 요청이 DB에 정상적으로 등록된다.', async () => {
    jest.spyOn(assetRepository, 'findOneBy').mockResolvedValue({
      id: 1,
      user_id: 1,
      stock_balance: 0,
      cash_balance: 1000,
      total_asset: 1000,
      total_profit: 0,
      total_profit_rate: 0,
    });

    jest.spyOn(stockOrderRepository, 'findBy').mockResolvedValue([]);

    const createMock = jest.fn();
    jest.spyOn(stockOrderRepository, 'create').mockImplementation(createMock);

    const saveMock = jest.fn();
    jest.spyOn(stockOrderRepository, 'save').mockImplementation(saveMock);

    await stockOrderService.buy(1, {
      stock_code: '005930',
      price: 1000,
      amount: 1,
    });

    expect(createMock).toHaveBeenCalledWith({
      user_id: 1,
      stock_code: '005930',
      trade_type: TradeType.BUY,
      amount: 1,
      price: 1000,
      status: StatusType.PENDING,
    });
    expect(saveMock).toHaveBeenCalled();
  });

  it('자산이 부족한 상태로 특정 주식에 대해 매수를 요청할 경우, BadRequest 예외가 발생한다.', async () => {
    jest.spyOn(assetRepository, 'findOneBy').mockResolvedValue({
      id: 1,
      user_id: 1,
      stock_balance: 0,
      cash_balance: 1000,
      total_asset: 1000,
      total_profit: 0,
      total_profit_rate: 0,
    });

    jest.spyOn(stockOrderRepository, 'findBy').mockResolvedValue([
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

    await expect(
      stockOrderService.buy(1, {
        stock_code: '005930',
        price: 1000,
        amount: 1,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('충분한 주식을 가지고 특정 주식에 대해 매도를 요청할 경우, 요청이 DB에 정상적으로 등록된다.', async () => {
    jest.spyOn(userStockRepository, 'findOneBy').mockResolvedValue({
      id: 1,
      user_id: 1,
      stock_code: '005930',
      quantity: 1,
      avg_price: 1000,
      last_updated: new Date(),
    });

    jest.spyOn(stockOrderRepository, 'findBy').mockResolvedValue([]);

    const createMock = jest.fn();
    jest.spyOn(stockOrderRepository, 'create').mockImplementation(createMock);

    const saveMock = jest.fn();
    jest.spyOn(stockOrderRepository, 'save').mockImplementation(saveMock);

    await stockOrderService.sell(1, {
      stock_code: '005930',
      price: 1000,
      amount: 1,
    });

    expect(createMock).toHaveBeenCalledWith({
      user_id: 1,
      stock_code: '005930',
      trade_type: TradeType.SELL,
      amount: 1,
      price: 1000,
      status: StatusType.PENDING,
    });
    expect(saveMock).toHaveBeenCalled();
  });

  it('주식이 부족한 상태로 특정 주식에 대해 매도를 요청할 경우, BadRequest 예외가 발생한다.', async () => {
    jest.spyOn(userStockRepository, 'findOneBy').mockResolvedValue({
      id: 1,
      user_id: 1,
      stock_code: '005930',
      quantity: 1,
      avg_price: 1000,
      last_updated: new Date(),
    });

    jest.spyOn(stockOrderRepository, 'findBy').mockResolvedValue([
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

    await expect(
      stockOrderService.sell(1, {
        stock_code: '005930',
        price: 1000,
        amount: 1,
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
