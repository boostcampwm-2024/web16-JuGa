import SearchCard from './SearchCard.tsx';

export default function SearchList() {
  return (
    <>
      <div className={'my-4 flex items-center justify-between'}>
        <div className={'text-start text-sm font-bold'}>검색 결과</div>
      </div>
      <ul className='flex h-full w-full flex-col items-center justify-between overflow-y-auto'>
        {Array.from({ length: 30 }, (_, index) => {
          return <SearchCard key={index} />;
        })}
      </ul>
    </>
  );
}
