const RankingCategory: string[] = ['일간'];

export default function Nav() {
  return (
    <div className='relative ml-4 flex gap-1 text-lg font-bold'>
      {RankingCategory.map((category) => (
        <button
          key={category}
          className={'relative border-b-4 border-juga-grayscale-black'}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
