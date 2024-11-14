export const searchApi = async (inputWord: string) => {
  if (!inputWord) return null;

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/stocks/list/search?name=${inputWord}`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
