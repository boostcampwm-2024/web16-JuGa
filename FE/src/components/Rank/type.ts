export type RankingItem = {
  nickname: string;
  rank: number;
  value: number;
};

export type RankingCategory = {
  topRank: RankingItem[];
  userRank: RankingItem;
};

export type RankingData = {
  profitRateRanking: RankingCategory;
  assetRanking: RankingCategory;
};
