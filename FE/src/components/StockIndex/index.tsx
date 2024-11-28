import { Card } from './Card.tsx';
import { useQuery } from '@tanstack/react-query';
import { getStockIndex } from '../../service/getStockIndex.ts';

export default function StockIndex() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['StockIndex'],
    queryFn: () => getStockIndex(),
    staleTime: 1000,
    cacheTime: 60000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  const { KOSPI, KOSDAQ, KOSPI200, KSQ150 } = data;

  return (
    <div className='my-2 flex w-full items-center justify-between gap-2'>
      <Card name='코스피' id='KOSPI' initialData={KOSPI} />
      <Card name='코스닥' id='KOSDAQ' initialData={KOSDAQ} />
      <Card name='코스피200' id='KOSPI200' initialData={KOSPI200} />
      <Card name='KSQ150' id='KSQ150' initialData={KSQ150} />
    </div>
  );
}
