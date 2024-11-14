import SearchCard from './SearchCard.tsx';
import { searchDataType } from './searchDataType.ts';
import Lottie from 'lottie-react';
import noResultAnimation from 'assets/noResultAnimation.json';

type SearchListProps = {
  searchData: searchDataType[];
};

export default function SearchList({ searchData }: SearchListProps) {
  if (searchData.length === 0) {
    return (
      <div
        className={'flex h-[320px] flex-col items-center justify-center gap-5'}
      >
        <Lottie animationData={noResultAnimation} className={'h-[200px]'} />
        <div className={'font-bold text-juga-grayscale-black'}>
          검색 결과가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <ul>
      {searchData.map((data, index) => (
        <SearchCard key={index} data={data} />
      ))}
    </ul>
  );
}
