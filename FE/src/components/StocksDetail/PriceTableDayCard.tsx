import { DailyPriceDataType } from './PriceDataType.ts';

type PriceTableDayCardProps = {
  data: DailyPriceDataType;
};

export default function PriceTableDayCard({ data }: PriceTableDayCardProps) {
  const percent = Number(data.prdy_ctrt);
  const color = percent > 0 ? 'text-juga-red-60' : 'text-juga-blue-50';
  function formatTime(time: string) {
    if (!time.length) return '----.--.--';
    const year = time.slice(0, 4);
    const mon = time.slice(4, 6);
    const day = time.slice(6, 8);
    return `${year}.${mon}.${day}`;
  }
  return (
    <tr className={'h-[30px] hover:bg-juga-grayscale-50'}>
      <td className={'px-4 py-1 text-start'}>
        {formatTime(data.stck_bsop_date)}
      </td>
      <td className={'px-4 py-1 text-right'}>
        {Number(data.stck_clpr).toLocaleString()}
      </td>
      <td className={`px-4 py-1 text-right ${color}`}>
        {percent > 0 ? `+${percent}%` : `${percent}%`}
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
