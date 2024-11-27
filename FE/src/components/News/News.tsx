import Card from './Card.tsx';
import { newsMockData } from './newsMockData.ts';

export default function News() {
  return (
    <div className='w-full'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-bold'>주요 뉴스</h2>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2'>
        {newsMockData.slice(0, 4).map((news, index) => (
          <Card key={index} data={news} />
        ))}
      </div>
    </div>
  );
}
