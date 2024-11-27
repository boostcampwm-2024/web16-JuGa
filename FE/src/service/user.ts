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
