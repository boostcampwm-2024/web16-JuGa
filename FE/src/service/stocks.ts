import { StockDetailType } from 'types';

export async function getStocksByCode(code: string): Promise<StockDetailType> {
  return fetch(`${import.meta.env.VITE_API_URL}/stocks/${code}`).then((res) =>
    res.json(),
  );
}
