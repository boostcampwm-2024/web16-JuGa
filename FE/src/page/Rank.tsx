import Nav from 'components/Rank/Nav.tsx';
import List from '../components/Rank/List.tsx';
import { getRanking } from '../service/ranking.ts';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';

export default function Rank() {
  const { data, isError } = useQuery({
    queryKey: ['Rank'],
    queryFn: () => getRanking(),
    suspense: true,
  });

  if (isError) return <div>Error!!</div>;
  return (
    <div className='rounded-xl px-4'>
      <Helmet>
        <meta name='description' content='랭킹입니다.' />
        <title>JuGa | Ranking</title>
      </Helmet>
      <div className='mb-2'>
        <Nav />
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <List title='수익률순' data={data.profitRateRanking} />
        <List title='자산순' data={data.assetRanking} />
      </div>
    </div>
  );
}
