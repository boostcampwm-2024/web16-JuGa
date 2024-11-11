import { Link } from 'react-router-dom';
import useAuthStore from 'store/authStore';
import useLoginModalStore from 'store/useLoginModalStore';

export default function Header() {
  const { toggleModal } = useLoginModalStore();
  const { isLogin, resetToken } = useAuthStore();

  return (
    <header className='fixed left-0 top-0 h-[60px] w-full'>
      <div className='mx-auto flex h-full max-w-[1280px] items-center justify-between px-[88px]'>
        <Link to={'/'} className='flex items-center gap-2'>
          <img src={'/Logo.png'} className={'h-[32px]'} />
          <h1 className='text-xl font-bold text-juga-grayscale-black'>JuGa</h1>
        </Link>

        <div className='flex items-center gap-8'>
          <nav className='flex items-center gap-6 text-sm font-bold text-juga-grayscale-500'>
            <button className='px-0.5 py-2'>홈</button>
            <button className='px-0.5 py-2'>랭킹</button>
            <button className='px-0.5 py-2'>마이페이지</button>
          </nav>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search...'
              className='h-[36px] w-[280px] rounded-lg bg-juga-grayscale-50 px-4 py-2'
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
