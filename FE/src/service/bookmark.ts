export async function bookmark(code: string) {
  const url = import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/stocks/bookmark/${code}`
    : `/api/stocks/bookmark/${code}`;

  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function unbookmark(code: string) {
  const url = import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/stocks/bookmark/${code}`
    : `/api/stocks/bookmark/${code}`;

  return fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
