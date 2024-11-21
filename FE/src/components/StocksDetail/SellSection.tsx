import Lottie from 'lottie-react';
import emptyAnimation from 'assets/emptyAnimation.json';

export default function SellSection() {
  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <Lottie
        animationData={emptyAnimation}
        className='w-40 h-40'
        loop={false}
      />
      <p>매도할 주식이 없어요</p>
    </div>
  );
}
