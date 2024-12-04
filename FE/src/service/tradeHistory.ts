import { PriceSectionViewType } from 'types';

export const getTradeHistory = async (
  id: string,
  viewMode: PriceSectionViewType,
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/stocks/trade-history/${id}/${viewMode}`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
