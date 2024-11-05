import Header from "components/Header";
import TopFive from "components/TopFive/TopFive";

export default function Home() {
  return (
    <>
      <Header />
      <div className={"pt-[60px]"}>
        <div>지수 정보들</div>
        <TopFive />
      </div>
    </>
  );
}
