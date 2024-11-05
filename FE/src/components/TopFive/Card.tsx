interface Stock {
  name: string;
  price: number;
  change: number;
  index: number;
}

export default function Card({ name, price, change, index }: Stock) {
  const changeColor = change > 0 ? "text-juga-red-60" : "text-juga-blue-50";

  return (
    <div className="flex flex-row items-center px-4 py-3">
      <div className={"font-medium text-juga-blue-50 mx-0"}>{index + 1}</div>
      <div className="w-[260px] text-start ml-4">
        <p className="font-medium text-juga-grayscale-black">{name}</p>
      </div>
      <div className="w-[130px] text-right">
        <p className="font-medium text-juga-grayscale-black">
          {price?.toLocaleString()}
        </p>
      </div>
      <div className={`w-[130px] text-right ${changeColor}`}>
        <p className="font-medium">{change > 0 ? `+${change}` : `${change}`}</p>
      </div>
    </div>
  );
}
