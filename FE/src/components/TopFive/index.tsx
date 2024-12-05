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

  const { data } = useQuery({
    queryKey: ['topfive', currentMarket],
    queryFn: () => getTopFiveStocks(stockIndexMap[currentMarket]),
    keepPreviousData: true,
    staleTime: 10000,
    cacheTime: 30000,
    suspense: true,
  });
  return (
    <div className='flex flex-col gap-4'>
      <Nav />
      <div
        className={'grid grid-cols-1 justify-between gap-[64px] sm:grid-cols-2'}
      >
        <List listTitle={'급상승 Top 5'} data={data?.high} />
        <List listTitle={'급하락 Top 5'} data={data?.low} />
      </div>
    </div>
  );
}
