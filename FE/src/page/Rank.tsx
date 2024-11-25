import Nav from 'components/Rank/Nav.tsx';
import RankList from '../components/Rank/RankList.tsx';
import { dummyRankData } from '../components/Rank/bummyData.ts';

export default function Rank() {
  // const { data, isLoading } = useQuery({
  //   queryKey: ['Rank'],
  //   queryFn: () => getRanking(),
  // });
  //
  // if (isLoading) return <div>Loading...</div>;
  const data = dummyRankData;

  return (
    <div className='rounded-xl px-4'>
      <div className='mb-2'>
        <Nav />
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <RankList title='수익률순' data={data.profitRateRanking} />
        <RankList title='자산순' data={data.assetRanking} />
      </div>
    </div>
  );
}
