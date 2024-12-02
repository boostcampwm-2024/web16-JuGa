import { StockChartUnit, StockDetailType, TiemCategory } from 'types';

export async function getStocksByCode(code: string): Promise<StockDetailType> {
  const url = import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/stocks/detail/${code}`
    : `/api/stocks/detail/${code}`;

  return fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
}

export async function getStocksChartDataByCode(
  code: string,
  peroid: TiemCategory = 'D',
  count: number = 50,
): Promise<StockChartUnit[]> {
  return fetch(`${import.meta.env.VITE_API_URL}/stocks/detail/${code}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fid_period_div_code: peroid,
      count: count,
    }),
  }).then((res) => res.json());
}

export async function unsubscribe(code: string) {
  return fetch(
    `${import.meta.env.VITE_API_URL}/stocks/trade-history/${code}/unsubscribe`,
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
}

export const getTopFiveStocks = async (market: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/stocks/topfive?market=${market}`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getStockIndex = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/stocks/index`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
