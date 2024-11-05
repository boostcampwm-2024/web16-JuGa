import List from "./List";
import Nav from "./Nav";

export default function TopFive() {
  return (
    <div className="gap-4 flex flex-col">
      <Nav />
      <div className={"flex flex-row gap-[64px]"}>
        <List />
        <List />
      </div>
    </div>
  );
}
