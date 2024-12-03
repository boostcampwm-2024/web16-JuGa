import Account from 'components/Mypage/Account';
import BookMark from 'components/Mypage/BookMark';
import MyInfo from 'components/Mypage/MyInfo';
import Nav from 'components/Mypage/Nav';
import Order from 'components/Mypage/Order';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function MyPage() {
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get('section') || 'account';

  return (
    <div className='flex gap-5'>
      <Helmet>
        <meta name='description' content='마이페이지입니다.' />
        <title>JuGa | MyPage</title>
      </Helmet>
      <Nav />
      <div className='flex-1'>
        {
          {
            account: <Account />,
            order: <Order />,
            bookmark: <BookMark />,
            info: <MyInfo />,
          }[currentPage]
        }
      </div>
    </div>
  );
}
