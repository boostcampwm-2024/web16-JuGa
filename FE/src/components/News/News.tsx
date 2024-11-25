import Header from './Header.tsx';
import CardWithImage from './CardWithImage.tsx';
import CardWithoutImage from './CardWithoutImage.tsx';

export default function News() {
  return (
    <div
      className={
        'items-center, flex w-full flex-col justify-center gap-3 bg-juga-grayscale-100'
      }
    >
      <Header />
      <ul>
        <CardWithImage />
      </ul>

      <ul>
        <CardWithoutImage />
      </ul>
    </div>
  );
}
