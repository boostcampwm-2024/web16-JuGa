export const formatNoSpecialChar = (query: string) => {
  return query.replace(/[^a-zA-Z0-9가-힣\ ]/g, '');
};
