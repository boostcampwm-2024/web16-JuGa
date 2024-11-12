export default function PriceTableDayCard() {
  return (
    <tr className={'h-[30px] hover:bg-juga-grayscale-50'}>
      <td className={'px-4 py-1 text-start'}>날짜</td>
      <td className={'px-4 py-1 text-right'}>종가</td>
      <td
        className={`px-4 py-1 text-right ${Math.round(Math.random() * 10) % 2 ? 'text-juga-blue-50' : 'text-juga-red-60'}`}
      >
        등략률 퍼센트
      </td>
      <td className={'px-4 py-1 text-right'}>거래량 갯수</td>
      <td className={'px-4 py-1 text-right'}>거래대금</td>
      <td className={'px-4 py-1 text-right'}>시가</td>
      <td className={'px-4 py-1 text-right'}>고가</td>
      <td className={'px-4 py-1 text-right'}>저가</td>
    </tr>
  );
}
//일자	종가	등락률	거래량(주)	거래대금	시가	고가	저가
