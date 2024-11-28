import { RankingItem } from './RankType.ts';

type Props = {
  item: RankingItem;
  type: '수익률순' | '자산순';
};

export default function RankCard({ item, type }: Props) {
  return (
    <div
      className={
        'flex items-center justify-between rounded p-2 transition-colors'
      }
    >
      <div className='flex items-center gap-2'>
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${
            item.rank === 1
              ? 'bg-yellow-400 text-white'
              : item.rank === 2
                ? 'bg-gray-300 text-white'
                : item.rank === 3
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-600'
          }`}
        >
          {item.rank}
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
              }).format((item as RankingItem).value) + '원'}
        </span>
      </div>
    </div>
  );
}
