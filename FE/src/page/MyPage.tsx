import Account from 'components/Mypage/Account';
import Nav from 'components/Mypage/Nav';
import { useSearchParams } from 'react-router-dom';

export default function MyPage() {
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get('section') || 'account';

  return (
    <div className='flex gap-5'>
      <Nav />
      <div className='flex-1'>
        {{ account: <Account />, info: <div>info</div> }[currentPage]}
      </div>
    </div>
  );
}
