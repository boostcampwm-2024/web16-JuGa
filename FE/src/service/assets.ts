import { AssetsResponse } from 'types';

export async function getAssets(): Promise<AssetsResponse> {
  const url = import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/assets`
    : '/api/assets';

  return fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
}

export async function getCash(): Promise<{ cash_balance: number }> {
  const url = import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/assets/cash`
    : '/api/assets/cash';

  return fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    if (res.status === 401) return { cash_balance: 0 };
    return res.json();
  });
}

export async function getSellInfo(
  code: string,
): Promise<{ quantity: number; avg_price: number }> {
  const url = import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/assets/stocks/${code}`
    : `/api/assets/stocks/${code}`;

  return fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    if (res.status === 401) return { quantity: 0, avg_price: 0 };
    return res.json();
  });
}
