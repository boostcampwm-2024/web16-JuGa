import { NewsMockDataType } from './newsMockData.ts';

type CardWithImageProps = {
  data: NewsMockDataType;
};
export default function CardWithImage({ data }: CardWithImageProps) {
  return (
    <div className='cursor-pointer overflow-hidden rounded-lg'>
      {/* 이미지 컨테이너 */}
      <div className='relative h-[144px] overflow-hidden'>
        <img
          src={data.img}
          alt='news thumbnail'
          className='h-full w-full rounded-lg object-cover transition-transform duration-300 hover:scale-105'
        />
      </div>

      <div className='flex max-h-[80px] flex-col justify-between gap-1'>
        {/* 뉴스 제목 */}
        <h3 className='truncate text-left text-base font-semibold text-juga-grayscale-black'>
          {data.title}
        </h3>

        {/* 날짜와 출판사 */}
        <div className='flex justify-between text-sm text-juga-grayscale-500'>
          <div>{data.date}</div>
          <div>{data.publisher}</div>
        </div>
      </div>
    </div>
  );
}
