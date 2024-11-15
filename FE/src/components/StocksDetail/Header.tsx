import { useQuery } from '@tanstack/react-query';
import { getStocksByCode } from 'service/stocks';

type StocksDeatailHeaderProps = {
  code: string;
};

export default function Header({ code }: StocksDeatailHeaderProps) {
  const { data, isLoading } = useQuery(['stocks', code], () =>
    getStocksByCode(code),
  );

  if (isLoading) return;
  if (!data) return;

  const {
    hts_kor_isnm,
    stck_prpr,
    prdy_vrss,
    prdy_vrss_sign,
    prdy_ctrt,
    hts_avls,
    per,
  } = data;

  const stockInfo: { label: string; value: string }[] = [
    { label: '시총', value: `${Number(hts_avls).toLocaleString()}억원` },
    { label: 'PER', value: `${per}배` },
  ];

  const colorStyleBySign =
    prdy_vrss_sign === '3'
      ? ''
      : prdy_vrss_sign < '3'
        ? 'text-juga-red-60'
        : 'text-juga-blue-40';

  return (
    <div className='flex items-center justify-between w-full h-16 px-2'>
      <div className='flex flex-col font-semibold'>
        <div className='flex gap-2 text-sm'>
          <h2>{hts_kor_isnm}</h2>
          <p className='text-juga-grayscale-200'>{code}</p>
        </div>
        <div className='flex items-center gap-2'>
          <p className='text-lg'>{Number(stck_prpr).toLocaleString()}원</p>
          <p>어제보다</p>
          <p className={`${colorStyleBySign}`}>
            +{Number(prdy_vrss).toLocaleString()}원 ({prdy_ctrt}%)
          </p>
        </div>
      </div>
      <div className='flex gap-4 text-xs font-semibold'>
        {stockInfo.map((e, idx) => (
          <div key={`stockdetailinfo${idx}`} className='flex gap-2'>
            <p className='text-juga-grayscale-200'>{e.label}</p>
            <p>{e.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
