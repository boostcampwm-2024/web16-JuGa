import { Chart } from './Chart';

export default function StockIndex() {
  return (
    <div className='flex gap-2'>
      <Chart name='코스피' />
      <Chart name='코스닥' />
    </div>
  );
}
