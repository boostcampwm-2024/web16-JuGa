import useLoginModalStore from 'store/useLoginModalStore';
import Input from './Input';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/16/solid';
import { FormEvent, useEffect, useState } from 'react';
import { login } from 'service/auth';
import useAuthStore from 'store/authStore';
import Overay from '../ModalOveray.tsx';

export default function Login() {
  const { isOpen, toggleModal } = useLoginModalStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAccessToken } = useAuthStore();
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

    setAccessToken(res.accessToken);
    toggleModal();
  };

  const handleKakaoBtnClick = async () => {
    if (import.meta.env.DEV) {
      const res = await login('jindding', '1234');

      if ('error' in res) {
        setErrorCode(res.statusCode);
        return;
      }

      document.cookie = `accessToken=${res.accessToken}; path=/;`;
      return;
    }

    window.location.href = `${import.meta.env.VITE_API_URL}/auth/kakao`;
  };

  return (
    <>
      <Overay onClick={() => toggleModal()} />
      <section className='fixed left-1/2 top-1/2 flex w-[500px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-white p-20 shadow-lg'>
        <h2 className='text-3xl font-bold'>JuGa</h2>
        <p className='h-5 my-3 text-sm font-semibold text-juga-red-60'>
          {
            {
              '401': '존재하지 않는 사용자입니다.',
              '400': '잘못된 입력형식입니다.',
            }[errorCode]
          }
        </p>
        <form className='flex flex-col mb-2' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-2 my-10'>
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
          <button className='py-2 text-white transition rounded-3xl bg-juga-blue-40 hover:bg-juga-blue-50'>
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
      </section>
    </>
  );
}
