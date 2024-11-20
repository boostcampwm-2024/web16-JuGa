import Nav from 'components/Mypage/Nav';
import { useSearchParams } from 'react-router-dom';

export default function MyPage() {
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get('section') || 'account';

  return (
    <div className='flex gap-2'>
      <Nav />
      <div className='flex-1 bg-gray-200 h-96'>
        {{ account: <div>account</div>, info: <div>info</div> }[currentPage]}
      </div>
    </div>
  );
}
