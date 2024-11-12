export default function PriceTableLiveCard() {
  return (
    <tr className={'h-[30px] hover:bg-juga-grayscale-50'}>
      <td className={'px-4 py-1 text-start'}>채결가</td>
      <td className={'px-4 py-1 text-right'}>채결량 갯수</td>
      <td
        className={`px-4 py-1 text-right ${Math.round(Math.random() * 10) % 2 ? 'text-juga-blue-50' : 'text-juga-red-60'}`}
      >
        등략률 퍼센트
      </td>
      <td className={'px-4 py-1 text-right'}>거래량 갯수</td>
      <td className={'px-4 py-1 text-right'}>시간</td>
    </tr>
  );
}
