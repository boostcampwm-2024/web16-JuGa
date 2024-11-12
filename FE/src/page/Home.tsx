import TopFive from 'components/TopFive/TopFive';
import StockIndex from 'components/StockIndex/index.tsx';
import SearchModal from '../components/Search';

export default function Home() {
  return (
    <>
      <StockIndex />
      <TopFive />
    </>
  );
}
