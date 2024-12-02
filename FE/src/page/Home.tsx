import TopFive from 'components/TopFive';
import StockIndex from 'components/StockIndex/index.tsx';
import News from 'components/News/News.tsx';

export default function Home() {
  return (
    <>
      <StockIndex />
      <TopFive />
      <News />
    </>
  );
}
