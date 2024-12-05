import { getStockIndex } from 'service/stocks.ts';
import { Card } from './Card.tsx';
import { useQuery } from '@tanstack/react-query';

export default function StockIndex() {
  const { data } = useQuery({
    queryKey: ['StockIndex'],
    queryFn: () => getStockIndex(),
    staleTime: 10000,
    cacheTime: 60000,
    suspense: true,
  });

  const { KOSPI, KOSDAQ, KOSPI200, KSQ150 } = data;

  return (
    <div className='my-2 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4'>
      <Card name='코스피' id='KOSPI' initialData={KOSPI} />
      <Card name='코스닥' id='KOSDAQ' initialData={KOSDAQ} />
      <Card name='코스피200' id='KOSPI200' initialData={KOSPI200} />
      <Card name='KSQ150' id='KSQ150' initialData={KSQ150} />
    </div>
  );
}
