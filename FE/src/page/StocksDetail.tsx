import Chart from 'components/StocksDetail/Chart';
import Header from 'components/StocksDetail/Header';
import PriceSection from 'components/StocksDetail/PriceSection';
import TradeSection from 'components/StocksDetail/TradeSection';
import { useParams } from 'react-router-dom';

export default function StocksDetail() {
  const params = useParams();
  const { id } = params;

  if (!id) return;

  return (
    <div className='flex flex-col'>
      <Header code={id} />
      <div className='flex h-[500px]'>
        <div className='flex min-w-[850px] flex-col'>
          <Chart code={id} />
          <PriceSection />
        </div>
        <TradeSection />
      </div>
    </div>
  );
}
