import Input from './Input';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/16/solid';

export default function Login() {
  return (
    <section className='absolute left-1/2 top-1/2 flex w-[500px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-white p-20 shadow-lg'>
      <h2 className='text-3xl font-bold'>JuGa</h2>

      <div className='flex flex-col gap-2 my-10'>
        <Input type='text' placeholder='아이디' />
        <Input type='password' placeholder='비밀번호' />
      </div>

      <div className='flex flex-col gap-2'>
        <button className='py-2 text-white transition rounded-3xl bg-juga-blue-40 hover:bg-juga-blue-50'>
          로그인
        </button>
        <button className='flex items-center justify-center gap-2 rounded-3xl bg-yellow-300 px-3.5 py-2 transition hover:bg-yellow-400'>
          <ChatBubbleOvalLeftIcon className='size-5' />
          <p>카카오 계정으로 로그인</p>
        </button>
      </div>
    </section>
  );
}
