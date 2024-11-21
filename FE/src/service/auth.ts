import { LoginFailResponse, LoginSuccessResponse } from 'types';

export async function login(
  email: string,
  password: string,
): Promise<LoginSuccessResponse | LoginFailResponse> {
  return fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then((res) => res.json());
}

export async function checkAuth() {
  const url = import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/auth/check`
    : '/api/auth/check';

  return fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
}
