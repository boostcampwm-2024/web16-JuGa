import { useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";

type MarketType = "전체" | "코스피" | "코스닥" | "나스닥";

export default function Nav() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentMarket = searchParams.get("top") || "전체";
  const indicatorRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const markets: MarketType[] = ["전체", "코스피", "코스닥", "나스닥"];

  const handleMarketChange = (market: MarketType) => {
    if (market === "전체") {
      searchParams.delete("top");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ top: market });
    }
  };

  useEffect(() => {
    const currentButton =
      buttonRefs.current[markets.indexOf(currentMarket as MarketType)];
    const indicator = indicatorRef.current;

    if (currentButton && indicator) {
      indicator.style.left = `${currentButton.offsetLeft}px`;
      indicator.style.width = `${currentButton.offsetWidth}px`;
    }
  }, [currentMarket]);

  return (
    <div className="relative flex text-xl font-bold gap-1 px-3">
      <div
        ref={indicatorRef}
        className="absolute bottom-0 h-1 bg-juga-grayscale-black transition-all duration-300"
        style={{ height: "4px" }}
      />

      {markets.map((market, index) => (
        <button
          key={market}
          ref={(el) => (buttonRefs.current[index] = el)}
          onClick={() => handleMarketChange(market)}
          className={`py-2 px-2 relative`}
        >
          {market}
        </button>
      ))}
    </div>
  );
}
