import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { MenuDropdown } from "./menu";
import { Link, useLocation } from "react-router";

const ROUTES = [
  {
    url: "/clocks",
    label: "Clocks",
  },
  {
    url: "/countdown",
    label: "Countdown",
  },
  {
    url: "/stopwatch",
    label: "Stopwatch",
  },
];

export function Header() {
  const currentUrl = useLocation().pathname;
  return (
    <header className="flex justify-between items-center gap-1">
      <Link to={"/clocks"}>
        <Button variant={"ghost"} size={"sm"}>
          standby.sh
        </Button>
      </Link>
      <span className="hidden sm:flex">
        {ROUTES.map(({ url, label }) => (
          <Link to={url}>
            <Button
              variant={"ghost"}
              size={"sm"}
              className={cn(
                currentUrl == url && "text-blue-600 dark:text-blue-400"
              )}
            >
              {label}
            </Button>
          </Link>
        ))}
      </span>
      <span className="flex-1"></span>
      <MenuDropdown />
    </header>
  );
}
