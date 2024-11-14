export const getTradeHistory = async (id: string, buttonFlag: boolean) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/stocks/${id}/${buttonFlag ? 'today' : 'daily'}-trade-history`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
