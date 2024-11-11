import { LoginFailResponse, LoginSuccessResponse } from 'types';

export async function login(
  email: string,
  password: string,
): Promise<LoginSuccessResponse | LoginFailResponse> {
  return fetch(import.meta.env.VITE_API_LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then((res) => res.json());
}
