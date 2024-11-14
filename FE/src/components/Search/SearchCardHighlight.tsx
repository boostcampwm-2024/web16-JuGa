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

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

  return (
    <div>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
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
