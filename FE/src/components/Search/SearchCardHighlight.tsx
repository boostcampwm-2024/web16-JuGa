import { formatNoSpecialChar } from '../../utils/formatNoSpecialChar.ts';

type SearchCardHighLightProps = {
  text: string;
  highlight: string;
};

export const SearchCardHighLight = ({
  text,
  highlight,
}: SearchCardHighLightProps) => {
  if (!highlight.trim()) {
    return <div>{text}</div>;
  }

  const targetWord = formatNoSpecialChar(highlight.trim());

  const parts = text.trim().split(new RegExp(`(${targetWord})`, 'gi'));
  return (
    <div>
      {parts.map((part, index) =>
        part.toLowerCase() === targetWord.toLowerCase() ? (
          <span
            key={`${part}-${index}`}
            className={'font-medium text-juga-blue-50'}
          >
            {part}
          </span>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </div>
  );
};
