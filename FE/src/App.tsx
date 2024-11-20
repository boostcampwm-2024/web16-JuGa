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

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='stocks/:id' element={<StocksDetail />} />
          <Route path='mypage' element={<MyPage />} />
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
    </>
  );
}
