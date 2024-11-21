import { Order } from 'types';

export async function orderBuyStock(
  code: string,
  price: number,
  amount: number,
) {
  const url = import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/stocks/order/buy`
    : '/api/stocks/order/buy';

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

export async function getOrders(): Promise<Order[]> {
  const url = import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/stocks/order/list`
    : '/api/stocks/order/list';

  return fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
}
