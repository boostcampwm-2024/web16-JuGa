import { PriceDataType } from './PriceDataType.ts';

type PriceTableLiveCardProps = {
  data: PriceDataType;
};
export default function PriceTableLiveCard({ data }: PriceTableLiveCardProps) {
  const percent = Number(data.prdy_ctrt);
  const color = percent > 0 ? 'text-juga-red-60' : 'text-juga-blue-50';
  function formatTime(time: string) {
    const hour = time.slice(0, 2);
    const min = time.slice(2, 4);
    const sec = time.slice(4, 6);
    return `${hour}.${min}.${sec}`;
  }
  return (
    <tr className={'h-[30px] hover:bg-juga-grayscale-50'}>
      <td className={'px-4 py-1 text-start'}>
        {Number(data.stck_prpr).toLocaleString()}
      </td>
      <td className={'px-4 py-1 text-right'}>{data.cntg_vol}</td>
      <td className={`px-4 py-1 text-right ${color}`}>
        {percent > 0 ? `+${percent}` : `${percent}`}
      </td>
      {/*<td className={'px-4 py-1 text-right'}>거래량 갯수</td>*/}
      <td className={'px-4 py-1 text-right'}>
        {formatTime(data.stck_cntg_hour)}
      </td>
    </tr>
  );
}
