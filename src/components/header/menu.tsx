import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  CheckIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  GithubIcon,
  LinkedinIcon,
  MoonStarIcon,
  SunIcon,
  SwatchBookIcon,
  TwitterIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useClockConfig } from "@/hooks/useClockConfig";
import { useTheme } from "@/hooks/useTheme";

export function MenuDropdown() {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setTheme(theme);
  }, []);
  return (
    <DropdownMenu onOpenChange={() => setIsMenuOpened(!isMenuOpened)}>
      <DropdownMenuTrigger asChild>
        <Button variant={"secondary"} size={"lg"}>
          <span>Menu</span>
          <ChevronDownIcon
            className={cn(
              "transition duration-500",
              isMenuOpened && "rotate-180",
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <ClockConfigDropdownItems />
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <ThemeSwitcherDropdownItems />
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Social Links</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              window.open("https://github.com/theboyofdream", "_blank")
            }
          >
            <GithubIcon fill="currentColor" />
            <span className="flex-1">Github</span>
            <ExternalLinkIcon />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => window.open("https://x.com/theboyofdream", "_blank")}
          >
            <TwitterIcon fill="currentColor" />
            <span className="flex-1">X (formally Twitter)</span>
            <ExternalLinkIcon />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              window.open("https://www.linkedin.com/in/theboyofdream", "_blank")
            }
          >
            <LinkedinIcon fill="currentColor" />
            <span className="flex-1">LinkedIn</span>
            <ExternalLinkIcon />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ClockConfigDropdownItems() {
  const { showSecs, setShowSecs, hrsFormat, setHrsFormat } = useClockConfig();
  return (
    <>
      <DropdownMenuItem onClick={() => setShowSecs(!showSecs)}>
        <span className="flex-1">Show seconds</span>
        {showSecs && <CheckIcon />}
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => setHrsFormat(hrsFormat === "24" ? "12" : "24")}
      >
        <span className="flex-1">Use 24 hrs format</span>
        {hrsFormat === "24" && <CheckIcon />}
      </DropdownMenuItem>
    </>
  );
}

function ThemeSwitcherDropdownItems() {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <DropdownMenuItem onClick={() => setTheme("system")}>
        <SwatchBookIcon />
        <span className="flex-1">System</span>
        {theme === "system" && <CheckIcon />}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("light")}>
        <SunIcon />
        <span className="flex-1">Light</span>
        {theme === "light" && <CheckIcon />}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("dark")}>
        <MoonStarIcon />
        <span className="flex-1">Dark</span>
        {theme === "dark" && <CheckIcon />}
      </DropdownMenuItem>
    </>
  );
}
