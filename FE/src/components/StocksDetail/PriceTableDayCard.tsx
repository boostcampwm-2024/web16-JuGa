import { DailyPriceDataType } from './PriceDataType.ts';

type PriceTableDayCardProps = {
  data: DailyPriceDataType;
};

export default function PriceTableDayCard({ data }: PriceTableDayCardProps) {
  const percent = Number(data.prdy_ctrt);
  const color = percent > 0 ? 'text-juga-red-60' : 'text-juga-blue-50';
  return (
    <tr className={'h-[30px] hover:bg-juga-grayscale-50'}>
      <td className={'px-4 py-1 text-start'}>{data.stck_bsop_date}</td>
      <td className={'px-4 py-1 text-right'}>{data.stck_clpr}</td>
      <td className={`px-4 py-1 text-right ${color}`}>
        {percent > 0 ? `+${percent}%` : `${percent}%`}
      </td>
      <td className={'px-4 py-1 text-right'}>{data.acml_vol}</td>
      <td className={'px-4 py-1 text-right'}>{data.stck_oprc}</td>
      <td className={'px-4 py-1 text-right'}>{data.stck_hgpr}</td>
      <td className={'px-4 py-1 text-right'}>{data.stck_lwpr}</td>
    </tr>
  );
}
