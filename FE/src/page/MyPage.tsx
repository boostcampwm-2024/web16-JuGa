import Account from 'components/Mypage/Account';
import BookMark from 'components/Mypage/BookMark';
import MyInfo from 'components/Mypage/MyInfo';
import Nav from 'components/Mypage/Nav';
import Order from 'components/Mypage/Order';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useAuthStore from '../store/useAuthStore.ts';
import { Suspense } from 'react';
import { AccountSkeleton } from '../components/Mypage/AccountSkeleton.tsx';
import { BookmarkSkeleton } from '../components/Mypage/BookMarkSkeleton.tsx';
import { OrderSkeleton } from '../components/Mypage/OrderSkeleton.tsx';
import { MyInfoSkeleton } from '../components/Mypage/MyInfoSkeleton.tsx';

export default function MyPage() {
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get('section') || 'account';

  const navigate = useNavigate();
  const { isLogin } = useAuthStore();
  if (!isLogin) {
    navigate('/');
  }

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
            account: (
              <Suspense fallback={<AccountSkeleton />}>
                <Account />
              </Suspense>
            ),
            order: (
              <Suspense fallback={<OrderSkeleton />}>
                <Order />
              </Suspense>
            ),
            bookmark: (
              <Suspense fallback={<BookmarkSkeleton />}>
                <BookMark />
              </Suspense>
            ),
            info: (
              <Suspense fallback={<MyInfoSkeleton />}>
                <MyInfo />
              </Suspense>
            ),
          }[currentPage]
        }
      </div>
    </div>
  );
}
