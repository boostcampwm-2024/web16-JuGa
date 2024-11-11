export const getHeader = (accessToken: string, trId: string) => {
  return {
    'content-type': 'application/json; charset=utf-8',
    authorization: `Bearer ${accessToken}`,
    appkey: process.env.KOREA_INVESTMENT_APP_KEY,
    appsecret: process.env.KOREA_INVESTMENT_APP_SECRET,
    tr_id: trId,
    custtype: 'P',
  };
};
