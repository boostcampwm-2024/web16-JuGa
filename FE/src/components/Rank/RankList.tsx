import RankCard from './RankCard';
import useAuthStore from '../../store/authStore.ts';
import { AssetRankingType, ProfitRankingType } from './bummyData.ts';

type Props = {
  title: '수익률순' | '자산순';
  data: ProfitRankingType | AssetRankingType;
};

export default function RankList({ title, data }: Props) {
  const { topRank, userRank } = data;
  const { isLogin } = useAuthStore();
  return (
    <div className={'flex flex-col gap-5'}>
      <div className='w-full rounded-lg bg-white p-2 shadow-lg'>
        <div className='mb-1 border-b pb-1'>
          <h3 className='text-base font-bold text-gray-800'>{title}</h3>
        </div>

        <div className='space-y-1'>
          {topRank.map((item, index) => (
            <RankCard
              key={`${item.nickname}-${index}`}
              item={item}
              ranking={index}
              type={title}
            />
          ))}
        </div>
      </div>
      {!isLogin && userRank !== null && typeof userRank.rank === 'number' ? (
        <div className={'w-full rounded-lg bg-white px-2 pb-1 pt-2 shadow-lg'}>
          <div className='border-b'>
            <h3 className='text-base font-bold text-gray-800'>{`내 ${title} 순위`}</h3>
          </div>

          <div className={'space-y-1'}>
            <RankCard item={userRank} ranking={userRank.rank} type={title} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
