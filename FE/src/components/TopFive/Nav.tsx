import { useSearchParams } from "react-router-dom";

type MarketType = "전체" | "코스피" | "코스닥" | "나스닥";

export default function Nav() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentMarket = searchParams.get("top") || "전체";

  const markets: MarketType[] = ["전체", "코스피", "코스닥", "나스닥"];

  const handleMarketChange = (market: MarketType) => {
    if (market === "전체") {
      searchParams.delete("top");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ top: market });
    }
  };

  return (
    <div className="flex text-xl font-bold gap-1 px-3">
      {markets.map((market) => (
        <button
          key={market}
          onClick={() => handleMarketChange(market)}
          className={`py-2 px-2 ${
            currentMarket === market
              ? "border-b-4 border-juga-grayscale-black"
              : ""
          }`}
        >
          {market}
        </button>
      ))}
    </div>
  );
}
