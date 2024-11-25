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
