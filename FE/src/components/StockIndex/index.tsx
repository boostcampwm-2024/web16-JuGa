import { getStockIndex } from 'service/stocks.ts';
import { Card } from './Card.tsx';
import { useQuery } from '@tanstack/react-query';

export default function StockIndex() {
  const { data } = useQuery({
    queryKey: ['StockIndex'],
    queryFn: () => getStockIndex(),
    staleTime: 1000,
    cacheTime: 60000,
    suspense: true,
  });

  const { KOSPI, KOSDAQ, KOSPI200, KSQ150 } = data;

  return (
    <div className='flex items-center justify-between w-full gap-2 my-2'>
      <Card name='코스피' id='KOSPI' initialData={KOSPI} />
      <Card name='코스닥' id='KOSDAQ' initialData={KOSDAQ} />
      <Card name='코스피200' id='KOSPI200' initialData={KOSPI200} />
      <Card name='KSQ150' id='KSQ150' initialData={KSQ150} />
    </div>
  );
}
