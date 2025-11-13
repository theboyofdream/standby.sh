import { Button } from "../ui/button";
import { MenuDropdown } from "./menu";
import { useUrlState } from "@/hooks/useUrlState";

export function Header() {
  const { page, setPage } = useUrlState();

  return (
    <header className="flex justify-between items-center gap-1">
      <span className="flex gap-1 items-center justify-between h-full">
        <Button variant={"ghost"}>standby.sh</Button>
        {/*<Badge className="p-1 px-2.5 bg-green-500/20" variant={"outline"}>
          Open for Full-time
        </Badge>*/}
        <span className="h-full max-h-6 w-0.5 bg-primary opacity-60 dark:opacity-30 hidden sm:block"></span>
        <span className="hidden sm:flex">
          <Button 
            variant={page === "clocks" ? "default" : "link"}
            onClick={() => setPage("clocks")}
          >
            Clocks
          </Button>
          <Button 
            variant={page === "countdown" ? "default" : "link"}
            onClick={() => setPage("countdown")}
          >
            Countdown
          </Button>
        </span>
      </span>
      <MenuDropdown />
    </header>
  );
}
