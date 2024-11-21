import { Link } from 'react-router-dom';
import useAuthStore from 'store/authStore';
import useLoginModalStore from 'store/useLoginModalStore';
import useSearchModalStore from '../store/useSearchModalStore.ts';
import useSearchInputStore from '../store/useSearchInputStore.ts';
import logo from 'assets/Logo.png';
import { deleteCookie } from 'utils/common.ts';
import { checkAuth } from 'service/auth.ts';
import { useEffect } from 'react';

export default function Header() {
  const { toggleModal } = useLoginModalStore();
  const { isLogin, setIsLogin } = useAuthStore();
  const { toggleSearchModal } = useSearchModalStore();
  const { searchInput } = useSearchInputStore();

  useEffect(() => {
    const check = async () => {
      const res = await checkAuth();
      if (res.ok) setIsLogin(true);
      else setIsLogin(false);
    };

    check();
  }, [setIsLogin]);

  return (
    <header className='fixed left-0 top-0 h-[60px] w-full bg-white'>
      <div className='mx-auto flex h-full max-w-[1280px] items-center justify-between px-8'>
        <Link to={'/'} className='flex items-center gap-2'>
          <img src={logo} className={'h-[32px]'} />
          <h1 className='text-xl font-bold text-juga-grayscale-black'>JuGa</h1>
        </Link>

        <div className='flex items-center gap-8'>
          <nav className='flex items-center gap-6 text-sm font-bold text-juga-grayscale-500'>
            <Link to={'/'}>홈</Link>
            <Link to={'/rank'}>랭킹</Link>
            {isLogin && <Link to={'/mypage'}>마이페이지</Link>}
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
              onClick={() => {
                setIsLogin(false);
                deleteCookie('accessToken');
              }}
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
