import { useQuery } from '@tanstack/react-query';
import Chart from 'components/StocksDetail/Chart';
import Header from 'components/StocksDetail/Header';
import PriceSection from 'components/StocksDetail/PriceSection';
import TradeSection from 'components/StocksDetail/TradeSection';
import { useParams } from 'react-router-dom';
import { getStocksByCode } from 'service/stocks';
import { Helmet } from 'react-helmet-async';

export default function StocksDetail() {
  const params = useParams();
  const code = params.id;

  const { data, isLoading } = useQuery(
    ['stocks', code],
    () => getStocksByCode(code!),
    { staleTime: 1000, enabled: !!code },
  );

  if (!code) return <div>Non code</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Non data</div>;

  return (
    <div className='flex flex-col'>
      <Helmet>
        <meta name='description' content='주식 상세페이지입니다.' />
        <title>{`${(+data.stck_prpr).toLocaleString()}원 ${+data.prdy_ctrt}% | ${data.hts_kor_isnm}`}</title>
      </Helmet>
      <Header code={code} data={data} />
      <div className='flex h-[500px]'>
        <div className='flex min-w-[850px] flex-col'>
          <Chart code={code} />
          <PriceSection />
        </div>
        <TradeSection code={code} data={data} />
      </div>
    </div>
  );
}
