import Card from "./Card";

interface Stock {
  name: string;
  price: number;
  change: number;
  index: number;
}

interface ListProps {
  listTitle: string;
}

export default function List({ listTitle }: ListProps) {
  const topStocks: Stock[] = [
    { name: "삼성전자", price: 76800, change: 2.1, index: 1 },
    { name: "SK하이닉스", price: 156000, change: -1.2, index: 2 },
    { name: "NAVER", price: 203000, change: 0.5, index: 3 },
    { name: "카카오", price: 58700, change: -0.8, index: 4 },
    { name: "현대차", price: 187000, change: 1.5, index: 5 },
  ];

  return (
    <div className="w-[520px] rounded-lg bg-white">
      <div className={"flex text-xl font-bold gap-1 px-6 my-5"}>
        {listTitle}
      </div>
      <div className="flex flex-row px-4 py-3 text-sm font-medium text-gray-600">
        <div className="w-[260px] text-start">종목</div>
        <div className="w-[130px] text-right">현재가</div>
        <div className="w-[130px] text-right">등락률</div>
      </div>

      {/* 리스트 */}
      <ul className="divide-y divide-gray-100">
        {topStocks.map((stock, index) => (
          <li key={index} className="hover:bg-gray-50 transition-colors">
            <Card
              name={stock.name}
              price={stock.price}
              change={stock.change}
              index={index}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
