export const getRanking = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/ranking`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
