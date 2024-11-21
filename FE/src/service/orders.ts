import { Order } from 'types';

export async function getOrders(): Promise<Order[]> {
  const url = import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/stocks/trade/list`
    : '/api/stocks/trade/list';

  return fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
}
