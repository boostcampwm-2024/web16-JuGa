import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from 'store/useAuthStore.ts';
import useLoginModalStore from 'store/useLoginModalStore';
import useSearchModalStore from 'store/useSearchModalStore.ts';
import useSearchInputStore from 'store/useSearchInputStore.ts';
import logoPng from 'assets/logo.png';
import logoWebp from 'assets/logo.webp';
import { checkAuth, logout } from 'service/auth.ts';
import { useEffect } from 'react';
import Toast from './Toast';

export default function Header() {
  const { toggleModal } = useLoginModalStore();
  const { isLogin, setIsLogin } = useAuthStore();
  const { toggleSearchModal } = useSearchModalStore();
  const { searchInput } = useSearchInputStore();
  const location = useLocation();
  const navigate = useNavigate();

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
  };

  return (
    <header className='fixed left-0 top-0 z-50 h-[60px] w-full bg-white'>
      <div className='mx-auto flex h-full max-w-[1280px] items-center justify-between px-8'>
        <Link to={'/'} className='flex items-center gap-2'>
          <picture>
            <source
              srcSet={logoWebp}
              type='image/webp'
              className={'h-[32px]'}
            />
            <img src={logoPng} alt={'Logo'} className={'h-[32px]'} />
          </picture>
          <h1 className='text-xl font-bold text-juga-grayscale-black'>JuGa</h1>
        </Link>

        <div className='flex items-center gap-8'>
          <nav className='flex items-center gap-6 text-sm font-bold text-juga-grayscale-500'>
            <div
              onClick={() => handleLink('/')}
              className='px-1 py-2 cursor-pointer'
            >
              홈
            </div>
            <div
              onClick={() => handleLink('/rank')}
              className='px-1 py-2 cursor-pointer'
            >
              랭킹
            </div>
            {isLogin && (
              <div
                onClick={() => handleLink('/mypage')}
                className='px-1 py-2 cursor-pointer'
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
