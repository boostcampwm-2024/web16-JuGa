import Account from 'components/Mypage/Account';
import BookMark from 'components/Mypage/BookMark';
import MyInfo from 'components/Mypage/MyInfo';
import Nav from 'components/Mypage/Nav';
import Order from 'components/Mypage/Order';
import { useSearchParams } from 'react-router-dom';

export default function MyPage() {
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get('section') || 'account';

  return (
    <div className='flex gap-5'>
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
