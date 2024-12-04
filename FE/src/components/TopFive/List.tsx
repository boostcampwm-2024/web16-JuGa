import Card from './Card';
import { StockData } from './type.ts';

type ListProps = {
  listTitle: string;
  data: StockData[];
};

export default function List({ listTitle, data }: ListProps) {
  return (
    <div className='w-full rounded-lg bg-white px-1'>
      <div className={'my-5 flex text-xl font-bold'}>{listTitle}</div>
      <div className='flex flex-row items-center justify-between py-3 text-sm font-medium text-gray-600'>
        <div className='w-[200px] text-start'>종목</div>
        <div className='w-[140px] p-1 text-right'>현재가</div>
        <div className='w-[150px] p-1 text-right'>등락</div>
      </div>

      <ul>
        {data.map((stock: StockData, index) => (
          <li
            key={`${stock.hts_kor_isnm}-${index}`}
            className='transition-colors hover:bg-gray-50'
          >
            <Card
              code={stock.stck_shrn_iscd}
              name={stock.hts_kor_isnm}
              price={stock.stck_prpr}
              changePercentage={stock.prdy_ctrt}
              changePrice={stock.prdy_vrss}
              flag={stock.prdy_vrss_sign}
              index={index}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
