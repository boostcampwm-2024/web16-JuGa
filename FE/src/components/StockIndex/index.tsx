import { Card } from './Card.tsx';

export default function StockIndex() {
  return (
    <div className='flex w-full items-center gap-2'>
      <Card name='코스피' />
      <Card name='코스닥' />
      <Card name='코스피200' />
      <Card name='KSQ150' />
    </div>
  );
}
