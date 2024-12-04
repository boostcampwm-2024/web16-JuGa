import { FallbackProps } from 'react-error-boundary';
import logoPng from 'assets/logo.png';
import logoWebp from 'assets/logo.webp';

export default function GlobalErrorFallback({ error }: FallbackProps) {
  return (
    <div className='flex flex-col items-center justify-center mt-40 text-gray-800'>
      <div className='flex items-center mb-6'>
        <picture>
          <source srcSet={logoWebp} type='image/webp' />
          <img src={logoPng} alt='Logo' className='h-48' />
        </picture>
      </div>
      <h1 className='mb-4 text-2xl font-bold'>오류가 발생했습니다!</h1>
      <p className='mb-6 text-lg text-center'>
        문제가 지속적으로 발생하면 관리자에게 문의해주세요.
      </p>
      <pre className='w-full max-w-lg p-4 mb-6 text-sm text-left bg-gray-200 rounded-md shadow-md'>
        {error.message}
      </pre>
      <div className='flex space-x-4'>
        <a
          href='/'
          className='px-6 py-2 font-medium text-white transition bg-blue-500 rounded-md shadow hover:bg-blue-600'
        >
          Home으로 돌아가기
        </a>
      </div>
    </div>
  );
}
