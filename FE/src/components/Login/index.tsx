import useLoginModalStore from 'store/useLoginModalStore';
import Input from './Input';
import { ChatBubbleOvalLeftIcon, XMarkIcon } from '@heroicons/react/16/solid';
import { FormEvent, useEffect, useState } from 'react';
import { login } from 'service/auth';
import useAuthStore from 'store/useAuthStore.ts';
import Overay from '../ModalOveray.tsx';
import Toast from 'components/Toast.tsx';

export default function Login() {
  const { isOpen, toggleModal } = useLoginModalStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsLogin } = useAuthStore();

  useEffect(() => {
    setEmail('jindding');
    setPassword('1234');
  }, [isOpen]);

  if (!isOpen) return;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await login(email, password);
    if ('message' in res) {
      let message = '';
      if (res.statusCode === 401) message = '존재하지 않는 사용자입니다.';
      else if (res.statusCode === 400) message = '잘못된 입력형식입니다.';

      Toast({ message, type: 'error' });
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

      if ('message' in res) {
        let message = '';
        if (res.statusCode === 401) message = '존재하지 않는 사용자입니다.';
        else if (res.statusCode === 400) message = '잘못된 입력형식입니다.';

        Toast({ message, type: 'error' });
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
    <div className='z-30'>
      <Overay onClick={() => toggleModal()} />
      <section className='fixed left-1/2 top-1/2 flex w-[500px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-white p-20 shadow-lg'>
        <h2 className='mb-5 text-3xl font-bold'>JuGa</h2>
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
        <button className='absolute right-8 top-8' onClick={toggleModal}>
          <XMarkIcon className='h-7 w-7 text-juga-grayscale-500' />
        </button>
      </section>
    </div>
  );
}
