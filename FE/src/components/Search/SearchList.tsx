import SearchCard from './SearchCard.tsx';
import { searchDataType } from './searchDataType.ts';

type SearchListProps = {
  searchData: searchDataType[];
};

export default function SearchList({ searchData }: SearchListProps) {
  return (
    <ul>
      {searchData.map((data, index) => (
        <SearchCard key={index} data={data} />
      ))}
    </ul>
  );
}
