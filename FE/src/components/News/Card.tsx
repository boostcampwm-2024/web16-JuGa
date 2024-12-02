import { NewsDataType } from './type.ts';
import { formatDate } from '../../utils/formatTime.ts';

type CardWithImageProps = {
  data: NewsDataType;
};
export default function Card({ data }: CardWithImageProps) {
  return (
    <a
      className='flex cursor-pointer flex-col rounded-lg border p-4 transition-all hover:bg-juga-grayscale-50'
      href={data.originallink}
      target='_blank'
      rel='noopener noreferrer'
    >
      <div className={'mb-2 flex w-full flex-row items-center justify-between'}>
        <div className={'flex flex-row items-center gap-3'}>
          <h3 className='w-[320px] truncate text-left text-base font-medium'>
            {data.title}
          </h3>
        </div>
        <span className={'w-fit text-sm text-gray-500'}>
          {formatDate(data.pubDate)}
        </span>
      </div>
      <div className='flex w-full items-center justify-between gap-4'>
        <p className='w-96 truncate text-left text-sm text-juga-grayscale-500'>
          {data.description}
        </p>
        <span className='rounded-full bg-juga-blue-10 px-2 py-0.5 text-xs text-juga-blue-50'>
          {data.query}
        </span>
      </div>
    </a>
  );
}
