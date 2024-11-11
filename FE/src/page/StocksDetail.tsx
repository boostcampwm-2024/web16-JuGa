import Chart from 'components/StocksDetail/Chart';
import Header from 'components/StocksDetail/Header';
import PriceSection from 'components/StocksDetail/PriceSection';
import TradeSection from 'components/StocksDetail/TradeSection';

export default function StocksDetail() {
  return (
    <div className='flex flex-col bg-red-50'>
      <Header />
      <div className='flex h-[500px] bg-yellow-600'>
        <div className='flex min-w-[850px] flex-col'>
          <Chart />
          <PriceSection />
        </div>
        <TradeSection />
      </div>
    </div>
  );
}
