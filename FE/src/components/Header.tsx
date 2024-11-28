import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from 'store/authStore';
import useLoginModalStore from 'store/useLoginModalStore';
import useSearchModalStore from '../store/useSearchModalStore.ts';
import useSearchInputStore from '../store/useSearchInputStore.ts';
import logoPng from 'assets/logo.png';
import logoWebp from 'assets/logo.webp';
import { checkAuth, logout } from 'service/auth.ts';
import { useEffect } from 'react';

export default function Header() {
  const { toggleModal } = useLoginModalStore();
  const { isLogin, setIsLogin } = useAuthStore();
  const { toggleSearchModal } = useSearchModalStore();
  const { searchInput } = useSearchInputStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const res = await checkAuth();
      if (res.ok) setIsLogin(true);
      else setIsLogin(false);
    };

    check();
  }, [setIsLogin]);

  const handleLogout = () => {
    logout().then(() => {
      setIsLogin(false);
    });
  };

  const handleLink = (to: string) => {
    if (location.pathname === to) {
      return;
    }
    navigate(to);
  };

  return (
    <header className='fixed left-0 top-0 h-[60px] w-full bg-white'>
      <div className='mx-auto flex h-full max-w-[1280px] items-center justify-between px-8'>
        <Link to={'/'} className='flex items-center gap-2'>
          <picture>
            <source
              srcSet={logoWebp}
              type='image/webp'
              className={'h-[32px]'}
            />
            <img src={logoPng} className={'h-[32px]'} />
          </picture>
          <h1 className='text-xl font-bold text-juga-grayscale-black'>JuGa</h1>
        </Link>

        <div className='flex items-center gap-8'>
          <nav className='flex items-center gap-6 text-sm font-bold text-juga-grayscale-500'>
            <div
              onClick={() => handleLink('/')}
              className='cursor-pointer px-1 py-2'
            >
              홈
            </div>
            <div
              onClick={() => handleLink('/rank')}
              className='cursor-pointer px-1 py-2'
            >
              랭킹
            </div>
            {isLogin && (
              <div
                onClick={() => handleLink('/mypage')}
                className='cursor-pointer px-1 py-2'
              >
                마이페이지
              </div>
            )}
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
              onClick={handleLogout}
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
