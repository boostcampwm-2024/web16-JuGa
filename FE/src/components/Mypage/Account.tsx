import MyStocksList from './MyStocksList';

export default function Account() {
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex text-xl font-semibold rounded-xl bg-gray-50'>
        <div className='flex flex-col flex-1 gap-10 p-10'>
          <div className='flex justify-between'>
            <p>총 자산</p>
            <p>7000000원</p>
          </div>
          <div className='flex justify-between'>
            <p>가용 자산</p>
            <p>70000원</p>
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-10 p-10'>
          <div className='flex justify-between'>
            <p>투자 손익</p>
            <p>-1000000원</p>
          </div>
          <div className='flex justify-between'>
            <p>수익률</p>
            <p>-30%</p>
          </div>
        </div>
      </div>
      <MyStocksList />
    </div>
  );
}
