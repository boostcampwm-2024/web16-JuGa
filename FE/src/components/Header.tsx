import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from 'store/useAuthStore.ts';
import useLoginModalStore from 'store/useLoginModalStore';
import useSearchModalStore from 'store/useSearchModalStore.ts';
import useSearchInputStore from 'store/useSearchInputStore.ts';
import logoPng from 'assets/logo.png';
import logoWebp from 'assets/logo.webp';
import { checkAuth, logout } from 'service/auth.ts';
import { useEffect, useState } from 'react';
import Toast from './Toast';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { toggleModal } = useLoginModalStore();
  const { isLogin, setIsLogin } = useAuthStore();
  const { toggleSearchModal } = useSearchModalStore();
  const { searchInput } = useSearchInputStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await checkAuth();
        setIsLogin(res.isLogin);
      } catch (error) {
        console.log(error);
      }
    };

    check();
  }, [setIsLogin]);

  const handleLogout = () => {
    logout().then(() => {
      setIsLogin(false);
      Toast({ message: '로그아웃 되었습니다!', type: 'success' });
    });
  };

  const handleLink = (to: string) => {
    if (location.pathname === to) {
      return;
    }
    navigate(to);
    setIsMenuOpen(false);
  };

  return (
    <header className='fixed left-0 top-0 z-20 h-[60px] w-full bg-white'>
      <div className='mx-auto flex h-full max-w-[1280px] items-center justify-between px-4 md:px-8'>
        <Link to={'/'} className='flex items-center gap-2'>
          <picture>
            <source srcSet={logoWebp} type='image/webp' className='h-[32px]' />
            <img src={logoPng} alt='Logo' className='h-[32px]' />
          </picture>
          <h1 className='hidden text-xl font-bold text-juga-grayscale-black md:block'>
            JuGa
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden items-center gap-8 md:flex'>
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
            <button
              defaultValue={searchInput}
              className='flex h-[36px] w-[280px] items-center rounded-lg bg-juga-grayscale-50 px-4 py-2'
              onClick={toggleSearchModal}
            >
              <div className='text-juga-grayscale-200'>
                {searchInput ? searchInput : 'Search...'}
              </div>
            </button>
          </div>
        </div>

        {/* Desktop Auth Buttons */}
        <div className='hidden items-center gap-4 md:flex'>
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
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className='flex w-3/4 items-center justify-center md:hidden'>
          <button
            defaultValue={searchInput}
            className='flex h-[36px] w-full items-center rounded-lg bg-juga-grayscale-50 px-4 py-2'
            onClick={toggleSearchModal}
          >
            <div className='text-juga-grayscale-200'>
              {searchInput ? searchInput : 'Search...'}
            </div>
          </button>
        </div>

        <button
          className='p-2 md:hidden'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <XMarkIcon className='h-6 w-6 text-juga-grayscale-500' />
          ) : (
            <Bars3Icon className='h-6 w-6 text-juga-grayscale-500' />
          )}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className='absolute left-0 top-[60px] w-full bg-white shadow-lg md:hidden'>
            <div className='flex flex-col p-4'>
              <nav className='flex flex-col gap-4 text-sm font-bold text-juga-grayscale-500'>
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

              <div className='mt-4 flex flex-col gap-2'>
                {isLogin ? (
                  <button
                    className='w-full px-4 py-2 text-sm text-juga-grayscale-500'
                    onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                ) : (
                  <button
                    className='w-full px-4 py-2 text-sm text-juga-grayscale-500'
                    onClick={toggleModal}
                  >
                    로그인
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
