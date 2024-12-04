import Card from './Card.tsx';
import { useQuery } from '@tanstack/react-query';
import { getNewsData } from '../../service/news.ts';
import { NewsDataType } from './type.ts';

export default function News() {
  const { data } = useQuery({
    queryKey: ['News'],
    queryFn: () => getNewsData(),
    staleTime: 1000 * 60,
    suspense: true,
  });

  const randomNewsIndex = Math.floor(Math.random() * 16);

  return (
    <div className='w-full'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-bold'>주요 뉴스</h2>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {data.news
          .slice(randomNewsIndex, randomNewsIndex + 4)
          .map((news: NewsDataType, index: number) => (
            <Card key={index} data={news} />
          ))}
      </div>
    </div>
  );
}
