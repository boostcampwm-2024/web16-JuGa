import Nav from 'components/Rank/Nav.tsx';
import RankList from '../components/Rank/RankList.tsx';

const dummyOne = [
  { nickname: 'MasterInvestor', value: 28.5 },
  { nickname: 'StockExpert', value: 22.3 },
  { nickname: 'SuperTrader', value: 19.8 },
  { nickname: 'WallStreetWolf', value: 17.2 },
  { nickname: 'WealthKing', value: 15.9 },
  { nickname: 'LuckyInvestor', value: 14.1 },
  { nickname: 'RichMaker', value: 12.8 },
  { nickname: 'InvestmentGuru', value: 11.5 },
  { nickname: 'MarketAnalyst', value: 10.2 },
  { nickname: 'FutureAsset', value: 9.7 },
];

const dummyTwo = [
  { nickname: 'MasterInvestor', value: 15800000000 },
  { nickname: 'StockExpert', value: 9200000000 },
  { nickname: 'SuperTrader', value: 7500000000 },
  { nickname: 'WallStreetWolf', value: 6300000000 },
  { nickname: 'WealthKing', value: 4800000000 },
  { nickname: 'LuckyInvestor', value: 3200000000 },
  { nickname: 'RichMaker', value: 2500000000 },
  { nickname: 'InvestmentGuru', value: 1800000000 },
  { nickname: 'MarketAnalyst', value: 1200000000 },
  { nickname: 'FutureAsset', value: 950000000 },
];

export default function Rank() {
  return (
    <div className='rounded-xl px-4'>
      <div className='mb-2'>
        <Nav />
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <RankList title='수익률순' data={dummyOne} />
        <RankList title='자산순' data={dummyTwo} />
      </div>
    </div>
  );
}
