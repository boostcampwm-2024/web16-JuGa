import Card from './Card';
import { SkeletonCard } from './SkeletonCard.tsx';
import { StockData } from './type.ts';

type ListProps = {
  listTitle: string;
  data: StockData[];
  isLoading: boolean;
};

export default function List({ listTitle, data, isLoading }: ListProps) {
  return (
    <div className='w-[520px] rounded-lg bg-white px-2'>
      <div className={'my-5 flex gap-1 px-1 text-xl font-bold'}>
        {listTitle}
      </div>
      <div className='flex flex-row items-center justify-between py-3 text-sm font-medium text-gray-600'>
        <div className='w-[200px] text-start'>종목</div>
        <div className='w-[160px] p-1 text-right'>현재가</div>
        <div className='w-[130px] p-1 text-right'>등락</div>
      </div>

      <ul>
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))
          : data.map((stock: StockData, index) => (
              <li key={index} className='transition-colors hover:bg-gray-50'>
                <Card
                  name={stock.hts_kor_isnm}
                  price={stock.stck_prpr}
                  changePercentage={stock.prdy_ctrt}
                  changePrice={stock.prdy_vrss}
                  index={index}
                />
              </li>
            ))}
      </ul>
    </div>
  );
}
