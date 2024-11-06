import Header from 'components/Header';
import Login from 'components/Login';
import TopFive from 'components/TopFive/TopFive';
import { Chart } from '../components/Chart.tsx';

export default function Home() {
  return (
    <>
      <Header />
      <div className={'pt-[60px]'}>
        <Chart />
        <TopFive />
      </div>
      <Login />
    </>
  );
}
