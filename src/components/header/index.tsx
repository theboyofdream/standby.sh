import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { MenuDropdown } from "./menu";
import { useUrlState } from "@/hooks/useUrlState";

export function Header() {
  const { page, setPage } = useUrlState();

  return (
    <header className="flex justify-between items-center gap-1">
      <Button variant={"ghost"} onClick={() => setPage("clocks")}>
        standby.sh
      </Button>
      <span className="hidden sm:flex">
        <Button
          variant={"ghost"}
          className={cn(
            "hover:opacity-100",
            page === "clocks" ? "opacity-100" : "opacity-50"
          )}
          onClick={() => setPage("clocks")}
        >
          Clocks
        </Button>
        <Button
          variant={"ghost"}
          className={cn(
            "hover:opacity-100",
            page === "countdown" ? "opacity-100" : "opacity-50"
          )}
          onClick={() => setPage("countdown")}
        >
          Countdown
        </Button>
      </span>
      <MenuDropdown />
    </header>
  );
}
