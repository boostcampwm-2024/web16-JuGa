import { formatTime } from 'utils/formatTime.ts';
import { DailyPriceDataType } from './type.ts';

type PriceTableDayCardProps = {
  data: DailyPriceDataType;
};

export default function TableDayCard({ data }: PriceTableDayCardProps) {
  const color =
    data.prdy_vrss_sign === '3'
      ? ''
      : data.prdy_vrss_sign < '3'
        ? 'text-juga-red-60'
        : 'text-juga-blue-40';
  const percentAbsolute = Math.abs(Number(data.prdy_ctrt)).toFixed(2);

  const plusOrMinus =
    data.prdy_vrss_sign === '3' ? '' : data.prdy_vrss_sign < '3' ? '+' : '-';
  return (
    <tr className={'h-[30px] hover:bg-juga-grayscale-50'}>
      <td className={'px-4 py-1 text-start'}>
        {formatTime(data.stck_bsop_date)}
      </td>
      <td className={'px-4 py-1 text-right'}>
        {Number(data.stck_clpr).toLocaleString()}
      </td>
      <td className={`px-4 py-1 text-right ${color}`}>
        {plusOrMinus}
        {percentAbsolute}%
      </td>
      <td className={'px-4 py-1 text-right'}>
        {Number(data.acml_vol).toLocaleString()}
      </td>
      <td className={'px-4 py-1 text-right'}>
        {Number(data.stck_oprc).toLocaleString()}
      </td>
      <td className={'px-4 py-1 text-right'}>
        {Number(data.stck_hgpr).toLocaleString()}
      </td>
      <td className={'px-4 py-1 text-right'}>
        {Number(data.stck_lwpr).toLocaleString()}
      </td>
    </tr>
  );
}
