import { Button } from "../ui/button";
import { MenuDropdown } from "./menu";

export function Header() {
  return (
    <header className="flex justify-between items-center gap-1">
      <span className="flex gap-1 items-center justify-between h-full">
        <Button variant={"ghost"}>standby.sh</Button>
        {/*<Badge className="p-1 px-2.5 bg-green-500/20" variant={"outline"}>
          Open for Full-time
        </Badge>*/}
        <span className="h-full max-h-6 w-0.5 bg-primary opacity-60 dark:opacity-30"></span>
        <span>
          <Button variant={"link"}>Clocks</Button>
          <Button variant={"link"}>Countdown</Button>
        </span>
      </span>
      <MenuDropdown></MenuDropdown>
    </header>
  );
}
