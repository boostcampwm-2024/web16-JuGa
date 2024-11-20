export default function AccountCondition() {
  return (
    <div className='flex flex-wrap gap-4 p-6 text-lg font-semibold shadow-sm rounded-xl bg-gray-50'>
      <div className='flex min-w-[250px] flex-1 flex-col rounded-lg bg-white p-6 shadow-sm'>
        <h3 className='mb-4 text-xl text-center text-gray-700'>자산 현황</h3>
        <div className='flex justify-between mb-6'>
          <p className='text-gray-600'>총 자산</p>
          <p className='text-gray-900'>7,000,000원</p>
        </div>
        <div className='flex justify-between'>
          <p className='text-gray-600'>가용 자산</p>
          <p className='text-gray-900'>70,000원</p>
        </div>
      </div>

      <div className='flex min-w-[250px] flex-1 flex-col rounded-lg bg-white p-6 shadow-sm'>
        <h3 className='mb-4 text-xl text-center text-gray-700'>투자 성과</h3>
        <div className='flex justify-between mb-6'>
          <p className='text-gray-600'>투자 손익</p>
          <p className='text-red-600'>-1,000,000원</p>
        </div>
        <div className='flex justify-between'>
          <p className='text-gray-600'>수익률</p>
          <p className='text-red-600'>-30%</p>
        </div>
      </div>
    </div>
  );
}
