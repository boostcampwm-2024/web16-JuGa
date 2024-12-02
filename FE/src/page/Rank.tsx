import Nav from 'components/Rank/Nav.tsx';
import List from '../components/Rank/List.tsx';
import { getRanking } from '../service/getRanking.ts';
import { useQuery } from '@tanstack/react-query';

export default function Rank() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['Rank'],
    queryFn: () => getRanking(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error!!</div>;

  return (
    <div className='rounded-xl px-4'>
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
