import useLoginModalStore from 'store/useLoginModalStore';
import Input from './Input';
import { ChatBubbleOvalLeftIcon, XMarkIcon } from '@heroicons/react/16/solid';
import { FormEvent, useEffect, useState } from 'react';
import { login } from 'service/auth';
import useAuthStore from 'store/useAuthStore.ts';
import Overay from '../ModalOveray.tsx';

export default function Login() {
  const { isOpen, toggleModal } = useLoginModalStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsLogin } = useAuthStore();
  const [errorCode, setErrorCode] = useState<number>(200);

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, [isOpen]);

  if (!isOpen) return;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await login(email, password);

    if ('error' in res) {
      setErrorCode(res.statusCode);
      return;
    }

    setIsLogin(true);
    toggleModal();
  };

  const handleKakaoBtnClick = async () => {
    if (import.meta.env.DEV) {
      const res = await login(
        import.meta.env.VITE_TEST_ID,
        import.meta.env.VITE_TEST_PW,
      );

      if ('error' in res) {
        setErrorCode(res.statusCode);
        return;
      }

      document.cookie = `accessToken=${res.accessToken}; path=/;`;
      setIsLogin(true);
      toggleModal();
      return;
    }

    window.location.href = `${import.meta.env.VITE_API_URL}/auth/kakao`;
  };

  return (
    <>
      <Overay onClick={() => toggleModal()} />
      <section className='fixed left-1/2 top-1/2 flex w-[500px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-white p-20 shadow-lg'>
        <h2 className='text-3xl font-bold'>JuGa</h2>
        <p className='my-3 h-5 text-sm font-semibold text-juga-red-60'>
          {
            {
              '401': '존재하지 않는 사용자입니다.',
              '400': '잘못된 입력형식입니다.',
            }[errorCode]
          }
        </p>
        <form className='mb-2 flex flex-col' onSubmit={handleSubmit}>
          <div className='my-10 flex flex-col gap-2'>
            <Input
              type='text'
              placeholder='아이디'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete='username'
            />
            <Input
              type='password'
              placeholder='비밀번호'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='current-password'
            />
          </div>
          <button className='rounded-3xl bg-juga-blue-40 py-2 text-white transition hover:bg-juga-blue-50'>
            로그인
          </button>
        </form>
        <button
          className='flex items-center justify-center gap-2 rounded-3xl bg-yellow-300 px-3.5 py-2 transition hover:bg-yellow-400'
          onClick={handleKakaoBtnClick}
        >
          <ChatBubbleOvalLeftIcon className='size-5' />
          카카오 계정으로 로그인
        </button>
        <button className='absolute right-8 top-8' onClick={toggleModal}>
          <XMarkIcon className='h-7 w-7 text-juga-grayscale-500' />
        </button>
      </section>
    </>
  );
}
