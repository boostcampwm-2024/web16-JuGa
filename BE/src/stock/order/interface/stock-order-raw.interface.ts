import { StatusType } from '../enum/status-type';
import { TradeType } from '../enum/trade-type';

export interface StockOrderRawInterface {
  o_id: number;
  o_user_id: number;
  o_stock_code: string;
  o_trade_type: TradeType;
  o_amount: number;
  o_price: number;
  o_status: StatusType;
  o_created_at: Date;
  o_completed_at: Date;
  s_code: string;
  s_name: string;
  s_market: string;
}
