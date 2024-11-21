import { TmpDataType } from './RankType.ts';

type Props = {
  item: TmpDataType;
  ranking: number;
  type: '수익률순' | '자산순';
};
export default function RankCard({ item, ranking, type }: Props) {
  return (
    <div
      key={item.nickname}
      className={`flex items-center justify-between rounded p-2 transition-colors`}
    >
      <div className='flex items-center gap-2'>
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${
            ranking === 0
              ? 'bg-yellow-400 text-white'
              : ranking === 1
                ? 'bg-gray-300 text-white'
                : ranking === 2
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-600'
          }`}
        >
          {ranking + 1}
        </div>
        <span className='text-sm font-medium'>{item.nickname}</span>
      </div>
      <div className='text-right'>
        <span className='text-sm font-bold text-gray-700'>
          {type === '수익률순'
            ? `${item.value}%`
            : new Intl.NumberFormat('ko-KR', {
                notation: 'compact',
                maximumFractionDigits: 1,
              }).format(item.value) + '원'}
        </span>
      </div>
    </div>
  );
}
