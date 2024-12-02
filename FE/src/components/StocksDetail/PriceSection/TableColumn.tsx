import { PriceSectionViewType } from 'types';

type Props = {
  viewMode: PriceSectionViewType;
};

export default function TableColumn({ viewMode }: Props) {
  if (!viewMode) {
    return (
      <thead className={'z-1 sticky top-0 bg-white'}>
        <tr className={'h-10 border-b text-gray-500'}>
          <th className={'px-4 py-1 text-left font-medium'}>일자</th>
          <th className={'px-4 py-1 text-right font-medium'}>종가</th>
          <th className={'px-4 py-1 text-right font-medium'}>등락률</th>
          <th className={'px-4 py-1 text-right font-medium'}>거래량(주)</th>
          {/*<th className={'px-4 py-1 text-right font-medium'}>거래대금</th>*/}
          <th className={'px-4 py-1 text-right font-medium'}>시가</th>
          <th className={'px-4 py-1 text-right font-medium'}>고가</th>
          <th className={'px-4 py-1 text-right font-medium'}>저가</th>
        </tr>
      </thead>
    );
  }
  return (
    <thead className={'z-1 sticky top-0 bg-white'}>
      <tr className={'h-10 border-b text-gray-500'}>
        <th className={'px-4 py-1 text-left font-medium'}>체결가</th>
        <th className={'px-4 py-1 text-right font-medium'}>체결량(주)</th>
        <th className={'px-4 py-1 text-right font-medium'}>등락률</th>
        {/*<th className={'px-4 py-1 text-right font-medium'}>거래량(주)</th>*/}
        <th className={'px-4 py-1 text-right font-medium'}>시간</th>
      </tr>
    </thead>
  );
}
