import List from "./List";
import Nav from "./Nav";

export default function TopFive() {
  return (
    <div className="gap-4 flex flex-col pt-[60px]">
      <Nav />
      <div className={"flex flex-row gap-[64px]"}>
        <List listTitle={"급상승 Top 5"} />
        <List listTitle={"급하락 Top 5"} />
      </div>
    </div>
  );
}
