import Header from 'components/Header';
import Login from 'components/Login';
import TopFive from 'components/TopFive/TopFive';
import StockIndex from 'components/StockIndex/index.tsx';

export default function Home() {
  return (
    <>
      <Header />
      <div className='flex flex-col gap-4 pt-[60px]'>
        <StockIndex />
        <TopFive />
      </div>
      <Login />
    </>
  );
}
