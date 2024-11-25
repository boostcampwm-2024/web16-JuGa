import CardWithImage from './CardWithImage.tsx';
import CardWithoutImage from './CardWithoutImage.tsx';
import { newsMockData, NewsMockDataType } from './newsMockData.ts';

export default function News() {
  return (
    <div
      className={'items-center, mt-7 flex w-full flex-col justify-center gap-3'}
    >
      <div className={'flex flex-row'}>
        <div className={'text-left text-xl font-bold'}>주요 뉴스</div>
      </div>
      <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {newsMockData.slice(0, 4).map((data: NewsMockDataType) => (
          <CardWithImage data={data} key={data.title} />
        ))}
      </ul>

      <ul className='mt-5 grid grid-cols-2 gap-3'>
        <CardWithoutImage />
        <CardWithoutImage />
        <CardWithoutImage />
        <CardWithoutImage />
      </ul>
    </div>
  );
}
