export const getFullURL = (url: string) => {
  return `${process.env.KOREA_INVESTMENT_BASE_URL}${url}`;
};

export const getFullTestURL = (url: string) => {
  return `${process.env.KOREA_INVESTMENT_TEST_BASE_URL}${url}`;
};
