import TopFive from 'components/TopFive';
import StockIndex from 'components/StockIndex/index.tsx';
import News from 'components/News/News.tsx';
import { Helmet } from 'react-helmet-async';

export default function Home() {
  return (
    <>
      <Helmet>
        <meta name='description' content='Stock Simulation Service' />
        <title>JuGa</title>
      </Helmet>
      <StockIndex />
      <TopFive />
      <News />
    </>
  );
}
