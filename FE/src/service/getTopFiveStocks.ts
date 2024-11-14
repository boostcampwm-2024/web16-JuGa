export const getTopFiveStocks = async (market: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/stocks/topfive?market=${market}`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
