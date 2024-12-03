import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import './App.css';
import Home from 'page/Home';
import StocksDetail from 'page/StocksDetail';
import Header from 'components/Header';
import Login from 'components/Login';
import SearchModal from './components/Search';
import MyPage from 'page/MyPage';
import Rank from 'page/Rank.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='stocks/:id' element={<StocksDetail />} />
          <Route path='mypage' element={<MyPage />} />
          <Route path='rank' element={<Rank />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

function Layout() {
  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <meta
          name='description'
          content='실시간 주식 데이터를 활용한 모의투자 경험을 통해 주식 투자에 대해 배울 수 있는 서비스.'
        />
        <meta property='og:title' content='JuGa' />
        <meta property='og:url' content='https://juga.kro.kr/' />
        <meta
          property='og:image'
          content='https://juga.kro.kr/assets/logo-BUoSezEL.webp'
        />
        <meta property='og:image:alt' content='JuGa Logo' />
        <meta
          property='og:description'
          content='실시간 주식 데이터를 활용한 모의투자 경험을 통해 주식 투자에 대해 배울 수 있는 서비스.'
        />
        <title>JuGa</title>
      </Helmet>
      <Header />
      <main className='mt-[60px] flex flex-col gap-4'>
        <Outlet />
      </main>
      <Login />
      <SearchModal />
      <ToastContainer />
    </>
  );
}
