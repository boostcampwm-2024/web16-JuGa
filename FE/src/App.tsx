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
import { Suspense } from 'react';
import { RankingSkeleton } from './components/Rank/RankingSkeleton.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='stocks/:id' element={<StocksDetail />} />
          <Route path='mypage' element={<MyPage />} />
          <Route
            path='rank'
            element={
              <Suspense fallback={<RankingSkeleton />}>
                <Rank />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

function Layout() {
  return (
    <>
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
