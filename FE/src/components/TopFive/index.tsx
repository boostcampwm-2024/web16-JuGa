import List from './List';
import Nav from './Nav';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MarketType } from './type.ts';
import { stockIndexMap } from 'constants.ts';
import { getTopFiveStocks } from 'service/stocks.ts';

export default function TopFive() {
  const [searchParams] = useSearchParams();
  const currentMarket = (searchParams.get('top') || '전체') as MarketType;

  const { data, isLoading } = useQuery({
    queryKey: ['topfive', currentMarket],
    queryFn: () => getTopFiveStocks(stockIndexMap[currentMarket]),
    keepPreviousData: true,
    staleTime: 1000,
    cacheTime: 30000,
    // refetchInterval: 1000,
  });
  return (
    <div className='flex flex-col gap-4'>
      <Nav />
      <div className={'flex flex-row justify-between gap-[64px]'}>
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
