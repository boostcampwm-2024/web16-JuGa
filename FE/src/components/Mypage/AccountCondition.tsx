import { Asset } from 'types';
import { stringToLocaleString } from 'utils/common';

type AccountConditionProps = {
  asset: Asset;
};

export default function AccountCondition({ asset }: AccountConditionProps) {
  const {
    cash_balance,
    stock_balance,
    total_asset,
    total_profit,
    total_profit_rate,
    is_positive,
  } = asset;

  return (
    <div className='flex flex-wrap gap-4 p-3 text-base font-semibold shadow-sm rounded-xl bg-gray-50'>
      <div className='flex min-w-[250px] flex-1 flex-col rounded-lg bg-white p-6 shadow-sm'>
        <h3 className='mb-4 text-xl text-center text-gray-700'>자산 현황</h3>
        <div className='flex justify-between mb-6'>
          <p className='text-juga-grayscale-500'>총 자산</p>
          <p className='text-gray-900'>{stringToLocaleString(total_asset)}원</p>
        </div>
        <div className='flex justify-between mb-2'>
          <p className='text-juga-grayscale-500'>가용 자산</p>
          <p className='text-gray-900'>
            {stringToLocaleString(cash_balance)}원
          </p>
        </div>
        <div className='flex justify-between'>
          <p className='text-juga-grayscale-500'>주식 자산</p>
          <p className='text-gray-900'>
            {stringToLocaleString(stock_balance)}원
          </p>
        </div>
      </div>

      <div className='flex min-w-[250px] flex-1 flex-col rounded-lg bg-white p-6 shadow-sm'>
        <h3 className='mb-4 text-xl text-center text-gray-700'>투자 성과</h3>
        <div className='flex justify-between mb-6'>
          <p className='text-juga-grayscale-500'>투자 손익</p>
          <p
            className={`${is_positive ? 'text-juga-red-60' : 'text-juga-blue-50'}`}
          >
            {stringToLocaleString(total_profit)}원
          </p>
        </div>
        <div className='flex justify-between'>
          <p className='text-juga-grayscale-500'>수익률</p>
          <p
            className={`${is_positive ? 'text-juga-red-60' : 'text-juga-blue-50'}`}
          >
            {total_profit_rate}%
          </p>
        </div>
      </div>
    </div>
  );
}
