import { useQuery } from '@tanstack/react-query';
import Chart from 'components/StocksDetail/Chart';
import Header from 'components/StocksDetail/Header';
import PriceSection from 'components/StocksDetail/PriceSection';
import TradeSection from 'components/StocksDetail/TradeSection';
import { useParams } from 'react-router-dom';
import { getStocksByCode } from 'service/stocks';

export default function StocksDetail() {
  const params = useParams();
  const code = params.id;

  const { data, isLoading } = useQuery(
    ['stocks', code],
    () => getStocksByCode(code!),
    { enabled: !!code },
  );

  if (!code) return <div>Non code</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Non data</div>;

  const { stck_prpr } = data;

  return (
    <div className='flex flex-col'>
      <Header code={code} data={data} />
      <div className='flex h-[500px]'>
        <div className='flex min-w-[850px] flex-col'>
          <Chart code={code} />
          <PriceSection />
        </div>
        <TradeSection price={stck_prpr} />
      </div>
    </div>
  );
}
