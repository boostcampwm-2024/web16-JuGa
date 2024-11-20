import { StockChartUnit, StockDetailType, TiemCategory } from 'types';

export async function getStocksByCode(code: string): Promise<StockDetailType> {
  return fetch(`${import.meta.env.VITE_API_URL}/stocks/detail/${code}`).then(
    (res) => res.json(),
  );
}

export async function getStocksChartDataByCode(
  code: string,
  peroid: TiemCategory = 'D',
  start: string = '',
  end: string = '',
): Promise<StockChartUnit[]> {
  return fetch(`${import.meta.env.VITE_API_URL}/stocks/detail/${code}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fid_input_date_1: start,
      fid_input_date_2: end,
      fid_period_div_code: peroid,
    }),
  }).then((res) => res.json());
}

export async function buyStock(code: string, price: number, amount: number) {
  const url = import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/stocks/trade/buy`
    : '/api/stocks/trade/buy';

  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      stock_code: code,
      price,
      amount,
    }),
  });
}
