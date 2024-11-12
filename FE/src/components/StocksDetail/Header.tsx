export default function Header() {
  return (
    <div className='flex items-center justify-between w-full h-16 px-2'>
      <div className='flex flex-col font-semibold'>
        <div className='flex gap-2 text-sm'>
          <h2>삼성전자</h2>
          <p className='text-juga-grayscale-200'>005930</p>
        </div>
        <div className='flex items-center gap-2'>
          <p className='text-lg'>60,900원</p>
          <p>어제보다</p>
          <p className='text-juga-red-60'>+1800원 (3.0%)</p>
        </div>
      </div>
      <div className='flex gap-4 text-xs font-semibold'>
        <div className='flex gap-2'>
          <p className='text-juga-grayscale-200'>당기순이익</p>
          <p>9조 8,143억</p>
        </div>
        <div className='flex gap-2'>
          <p className='text-juga-grayscale-200'>영업이익</p>
          <p>10조 4,439억</p>
        </div>
        <div className='flex gap-2'>
          <p className='text-juga-grayscale-200'>매출액</p>
          <p>74조 683억</p>
        </div>
        <div className='flex gap-2'>
          <p className='text-juga-grayscale-200'>시총</p>
          <p>361조 1,718억</p>
        </div>
        <div className='flex gap-2'>
          <p className='text-juga-grayscale-200'>PER</p>
          <p>14.79배</p>
        </div>
      </div>
    </div>
  );
}
