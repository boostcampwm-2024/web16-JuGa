import { NewsMockDataType } from './newsMockData.ts';

type CardWithImageProps = {
  data: NewsMockDataType;
};
export default function Card({ data }: CardWithImageProps) {
  return (
    <div className='flex cursor-pointer flex-col rounded-lg border p-4 transition-all hover:bg-gray-50'>
      <div className={'mb-2 flex w-full flex-row items-center justify-between'}>
        <div className={'flex flex-row items-center gap-3'}>
          <span className='rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600'>
            증권
          </span>
          <h3 className='w-[320px] truncate text-left text-base font-medium'>
            {data.title}
          </h3>
        </div>
        <span className={'w-fit text-sm text-gray-500'}>{data.date}</span>
      </div>
      <div className='flex w-full items-center justify-between gap-4'>
        <p className='w-96 truncate text-left text-sm text-gray-500'>
          {data.img}
        </p>
        <span className='whitespace-nowrap text-sm text-gray-500'>
          {data.publisher}
        </span>
      </div>
    </div>
  );
}
