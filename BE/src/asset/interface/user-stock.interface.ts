export interface UserStockInterface {
  user_stocks_id: number;
  user_stocks_user_id: number;
  user_stocks_stock_code: string;
  user_stocks_quantity: number;
  user_stocks_avg_price: string;
  user_stocks_last_updated: Date;
  stocks_code: string;
  stocks_name: string;
  stocks_market: string;
}
