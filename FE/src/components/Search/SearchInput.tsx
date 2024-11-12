import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div
      className={
        'flex h-[36px] w-full flex-row items-center rounded-lg bg-juga-grayscale-50 py-2'
      }
    >
      <MagnifyingGlassIcon className={'ml-3 h-4 w-4 fill-juga-grayscale-200'} />
      <input
        className={
          'h-[36px] w-full rounded-lg bg-juga-grayscale-50 py-2 pl-[10px] pr-10 text-sm font-normal focus:outline-none'
        }
        type='text'
        placeholder='Search...'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
