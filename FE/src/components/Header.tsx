import { Link } from 'react-router-dom';
import useAuthStore from 'store/authStore';
import useLoginModalStore from 'store/useLoginModalStore';
import useSearchModalStore from '../store/useSearchModalStore.ts';
import useSearchInputStore from '../store/useSearchInputStore.ts';
import logo from 'assets/Logo.png';

export default function Header() {
  const { toggleModal } = useLoginModalStore();
  const { isLogin, resetToken } = useAuthStore();
  const { toggleSearchModal } = useSearchModalStore();
  const { searchInput } = useSearchInputStore();

  return (
    <header className='fixed left-0 top-0 h-[60px] w-full'>
      <div className='mx-auto flex h-full max-w-[1280px] items-center justify-between px-8'>
        <Link to={'/'} className='flex items-center gap-2'>
          <img src={logo} className={'h-[32px]'} />
          <h1 className='text-xl font-bold text-juga-grayscale-black'>JuGa</h1>
        </Link>

        <div className='flex items-center gap-8'>
          <nav className='flex items-center gap-6 text-sm font-bold text-juga-grayscale-500'>
            <Link to={'/'}>홈</Link>
            <button className='px-0.5 py-2'>랭킹</button>
            <Link to={'/mypage'}>마이페이지</Link>
          </nav>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search...'
              defaultValue={searchInput}
              className='h-[36px] w-[280px] rounded-lg bg-juga-grayscale-50 px-4 py-2'
              onClick={toggleSearchModal}
            />
          </div>
        </div>
        <div className='flex items-center gap-4'>
          {isLogin ? (
            <button
              className='px-4 py-2 text-sm text-juga-grayscale-500'
              onClick={resetToken}
            >
              로그아웃
            </button>
          ) : (
            <>
              <button
                className='px-4 py-2 text-sm text-juga-grayscale-500'
                onClick={toggleModal}
              >
                로그인
              </button>
              {/* <button className='px-4 py-2 text-sm text-white rounded-lg bg-juga-grayscale-black'>
                회원가입
              </button> */}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
