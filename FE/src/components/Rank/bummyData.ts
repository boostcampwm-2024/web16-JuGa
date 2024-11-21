// 타입 수정
// 수익률 랭킹 타입
export type ProfitRankItemType = {
  nickname: string;
  profitRate: number;
  rank?: number;
};

// 수익률 랭킹 타입
export type ProfitRankingType = {
  topRank: ProfitRankItemType[];
  userRank: ProfitRankItemType;
};

// 자산 랭킹 타입
export type AssetRankItemType = {
  nickname: string;
  totalAsset: number;
  rank?: number;
};

// 자산 랭킹 타입
export type AssetRankingType = {
  topRank: AssetRankItemType[];
  userRank: AssetRankItemType;
};

export type RankDataType = {
  profitRateRanking: ProfitRankingType;
  assetRanking: AssetRankingType;
};

// 더미 데이터
export const dummyRankData: RankDataType = {
  profitRateRanking: {
    topRank: [
      {
        nickname: '투자의신',
        profitRate: 356.72,
      },
      {
        nickname: '주식왕',
        profitRate: 245.89,
      },
      {
        nickname: '워렌버핏',
        profitRate: 198.45,
      },
      {
        nickname: '존버마스터',
        profitRate: 156.23,
      },
      {
        nickname: '주린이탈출',
        profitRate: 134.51,
      },
      {
        nickname: '테슬라홀더',
        profitRate: 122.34,
      },
      {
        nickname: '배당투자자',
        profitRate: 98.67,
      },
      {
        nickname: '단타치는무도가',
        profitRate: 87.91,
      },
      {
        nickname: '가치투자자',
        profitRate: 76.45,
      },
      {
        nickname: '코스피불독',
        profitRate: 65.23,
      },
    ],
    userRank: {
      nickname: '나의닉네임',
      profitRate: 45.67,
      rank: 23, // 23등으로 설정
    },
  },
  assetRanking: {
    topRank: [
      {
        nickname: '자산왕',
        totalAsset: 15800000000,
      },
      {
        nickname: '억만장자',
        totalAsset: 9200000000,
      },
      {
        nickname: '주식부자',
        totalAsset: 7500000000,
      },
      {
        nickname: '연봉1억',
        totalAsset: 6300000000,
      },
      {
        nickname: '월급쟁이탈출',
        totalAsset: 4800000000,
      },
      {
        nickname: '부자될사람',
        totalAsset: 3200000000,
      },
      {
        nickname: '재테크고수',
        totalAsset: 2500000000,
      },
      {
        nickname: '천만원돌파',
        totalAsset: 1800000000,
      },
      {
        nickname: '주식으로퇴사',
        totalAsset: 1200000000,
      },
      {
        nickname: '투자의시작',
        totalAsset: 950000000,
      },
    ],
    userRank: {
      nickname: '나의닉네임',
      totalAsset: 850000000,
      rank: 15, // 15등으로 설정
    },
  },
};
