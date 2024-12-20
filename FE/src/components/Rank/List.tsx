import Card from './Card.tsx';
import useAuthStore from '../../store/useAuthStore.ts';
import { RankingCategory } from './type.ts';

type Props = {
  title: '수익률순' | '자산순';
  data: RankingCategory;
};

export default function List({ title, data }: Props) {
  const { topRank, userRank } = data;
  const { isLogin } = useAuthStore();
  return (
    <div className={'flex flex-col gap-5'}>
      <div className='w-full p-2 bg-white rounded-lg shadow-lg'>
        <div className='pb-1 mb-1 border-b'>
          <h3 className='text-base font-bold text-gray-800'>{title}</h3>
        </div>

        <div className='space-y-1'>
          {topRank.map((item, index) => (
            <Card key={`${item.nickname}-${index}`} item={item} type={title} />
          ))}
        </div>
      </div>
      {isLogin && userRank !== null ? (
        <div className={'w-full rounded-lg bg-white px-2 pb-1 pt-2 shadow-lg'}>
          <div className='border-b'>
            <h3 className='text-base font-bold text-gray-800'>{`내 ${title} 순위`}</h3>
          </div>

          <div className={'space-y-1'}>
            <Card item={userRank} type={title} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
