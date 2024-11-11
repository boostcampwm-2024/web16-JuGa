import { Card } from './Card.tsx';
import { useQuery } from '@tanstack/react-query';

export default function StockIndex() {
  const { data, isLoading } = useQuery({
    queryKey: ['StockIndex'],
    queryFn: () =>
      fetch(import.meta.env.VITE_API_STOCk_INDEX).then((res) => res.json()),
  });

  if (isLoading) return;

  const { KOSPI, KOSDAQ, KOSPI200, KSQ150 } = data;

  return (
    <div className='flex w-full items-center gap-2'>
      <Card name='코스피' id='KOSPI' initialData={KOSPI} />
      <Card name='코스닥' id='KOSDAQ' initialData={KOSDAQ} />
      <Card name='코스피200' id='KOSPI200' initialData={KOSPI200} />
      <Card name='KSQ150' id='KSQ150' initialData={KSQ150} />
    </div>
  );
}
