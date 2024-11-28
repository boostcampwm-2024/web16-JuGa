import { Profile } from 'types';

export async function getMyProfile(): Promise<Profile> {
  const url = import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/user/profile`
    : '/api/user/profile';

  return fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => res.json());
}

export async function rename(nickname: string) {
  const url = import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/user/rename`
    : '/api/user/rename';

  return fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nickname,
    }),
  }).then((res) => res.json());
}
