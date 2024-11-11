import { LoginFailResponse, LoginSuccessResponse } from 'types';

export async function login(
  email: string,
  password: string,
): Promise<LoginSuccessResponse | LoginFailResponse> {
  return fetch('http://223.130.151.42:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then((res) => res.json());
}
