import { Button } from "../ui/button";
import { MenuDropdown } from "./menu";
import { Link } from "react-router";

export function Header() {
  return (
    <header className="flex justify-between items-center gap-1">
      <Link to={"/"}>
        <Button variant={"ghost"} size={"sm"}>standby.sh</Button>
      </Link>
      <span className="flex-1"></span>
      <span className="hidden sm:flex">
        <Link to={"/clock"}>
          <Button variant={"ghost"} size={"sm"}>
            Clocks
          </Button>
        </Link>
        <Link to={"/countdown"}>
          <Button variant={"ghost"} size={"sm"}>
            Countdown
          </Button>
        </Link>
      </span>
      <MenuDropdown />
    </header>
  );
}
