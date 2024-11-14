import List from './List';
import Nav from './Nav';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MarketType } from './type.ts';

const paramsMap = {
  전체: 'ALL',
  코스피: 'KOSPI',
  코스닥: 'KOSDAQ',
  코스피200: 'KOSPI200',
};
export default function TopFive() {
  const [searchParams] = useSearchParams();
  const currentMarket = (searchParams.get('top') || '전체') as MarketType;

  const { data, isLoading } = useQuery({
    queryKey: ['topfive', currentMarket],
    queryFn: () =>
      fetch(
        `${import.meta.env.VITE_API_URL}/stocks/topfive?market=${paramsMap[currentMarket]}`,
      ).then((res) => res.json()),
    keepPreviousData: true,
    cacheTime: 60000,
    staleTime: 1000,
  });
  return (
    <div className='flex flex-col gap-4'>
      <Nav />
      <div className={'flex flex-row gap-[64px]'}>
        <List
          listTitle={'급상승 Top 5'}
          data={data?.high}
          isLoading={isLoading}
        />
        <List
          listTitle={'급하락 Top 5'}
          data={data?.low}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
