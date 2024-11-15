export const getTradeHistory = async (id: string, buttonFlag: boolean) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/stocks/trade-history/${id}/${buttonFlag ? 'today' : 'daily'}`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
