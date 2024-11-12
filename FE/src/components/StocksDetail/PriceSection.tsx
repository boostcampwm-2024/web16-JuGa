import { useState } from 'react';

export default function PriceSection() {
  const [buttonFlag, setButtonFlag] = useState(true);

  return (
    <div className='flex flex-1 flex-col rounded-2xl bg-white p-2 shadow-sm'>
      <div className='px-4 py-[6px] text-left text-sm font-semibold'>
        일별 · 실시간 시세
      </div>
      <div className='flex flex-1 flex-col overflow-hidden rounded-xl text-sm font-medium'>
        <div className='flex w-full'>
          <button
            className={`${buttonFlag ? 'bg-juga-grayscale-50 text-juga-grayscale-black' : 'bg-white text-juga-grayscale-400'} w-full rounded-lg px-4 py-2 shadow-sm focus:outline-none`}
            onClick={() => setButtonFlag(true)}
          >
            실시간
          </button>
          <button
            className={`w-full rounded-lg ${!buttonFlag ? 'bg-juga-grayscale-50 text-juga-grayscale-black' : 'bg-white text-juga-grayscale-400'} px-4 py-2 shadow-sm focus:outline-none`}
            onClick={() => setButtonFlag(false)}
          >
            일별
          </button>
        </div>

        <div className='max-h-[400px] flex-1 overflow-y-auto'>
          <table className='w-full table-fixed text-xs'>
            <thead className='sticky top-0 z-10 bg-white'>
              <tr className='h-10 border-b text-gray-500'>
                <th className='px-4 py-2 text-left font-medium'>채결가</th>
                <th className='px-4 py-2 text-right font-medium'>채결량(주)</th>
                <th className='px-4 py-2 text-right font-medium'>등락률</th>
                <th className='px-4 py-2 text-right font-medium'>거래량(주)</th>
                <th className='px-4 py-2 text-right font-medium'>시간</th>
              </tr>
            </thead>
            <tbody>
              {Array(30)
                .fill(null)
                .map((_, index) => (
                  <tr
                    key={index}
                    className='h-[30px] hover:bg-juga-grayscale-50'
                  >
                    <td className='px-4 py-1 text-start'>카드들</td>
                    <td className='px-4 py-1 text-right'>카드들</td>
                    <td className='px-4 py-1 text-right'>카드들</td>
                    <td className='px-4 py-1 text-right'>카드들</td>
                    <td className='px-4 py-1 text-right'>카드들</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
