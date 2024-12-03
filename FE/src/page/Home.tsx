import TopFive from 'components/TopFive';
import StockIndex from 'components/StockIndex/index.tsx';
import News from 'components/News/News.tsx';
import { Helmet } from 'react-helmet-async';
import { Suspense } from 'react';
import { StockIndexSkeleton } from '../components/StockIndex/StockIndexSekleton.tsx';
import { SkeletonList } from '../components/TopFive/SkeletonList.tsx';
import { NewsSkeleton } from '../components/News/NewsSkeleton.tsx';

export default function Home() {
  return (
    <>
      <Helmet>
        <meta name='description' content='Stock Simulation Service' />
        <title>JuGa</title>
      </Helmet>
      <Suspense fallback={<StockIndexSkeleton />}>
        <StockIndex />
      </Suspense>
      <Suspense fallback={<SkeletonList />}>
        <TopFive />
      </Suspense>
      <Suspense fallback={<NewsSkeleton />}>
        <News />
      </Suspense>
    </>
  );
}
