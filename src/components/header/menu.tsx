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
  ChartColumnIcon,
  ChartColumnStackedIcon,
  CheckIcon,
  ChevronDownIcon,
  CoffeeIcon,
  ExternalLinkIcon,
  GithubIcon,
  InfoIcon,
  LayoutGridIcon,
  Link,
  LinkedinIcon,
  MoonStarIcon,
  SettingsIcon,
  Share,
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
          {/* <SettingsIcon
            className={cn(
              "transition duration-500",
              isMenuOpened && "rotate-90"
            )}
          /> */}
          <LayoutGridIcon />
          <span>Menu</span>
          <ChevronDownIcon
            className={cn(
              "transition duration-500",
              isMenuOpened && "rotate-180"
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
          <DropdownMenuItem disabled>
            <ChartColumnIcon />
            <span className="flex-1">View public stats</span>
            <ExternalLinkIcon className="opacity-50" />
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem disabled>
            <CoffeeIcon />
            <span className="flex-1">Buy me a coffee</span>
            <ExternalLinkIcon className="opacity-50" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Social Links</DropdownMenuLabel>
          <DropdownMenuItem
            className="hover:bg-transparent!"
            onClick={(e) => e.preventDefault()}
          >
            <Button
              variant={"ghost"}
              className="hover:bg-accent! hover:text-accent-foreground!"
              onClick={() =>
                window.open("https://github.com/theboyofdream", "_blank")
              }
            >
              <GithubIcon fill="currentColor" />
            </Button>
            <Button
              variant={"ghost"}
              className="hover:bg-accent! hover:text-accent-foreground!"
              onClick={() =>
                window.open("https://x.com/theboyofdream", "_blank")
              }
            >
              <TwitterIcon fill="currentColor" />
            </Button>
            <Button
              variant={"ghost"}
              className="hover:bg-accent! hover:text-accent-foreground!"
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/in/theboyofdream",
                  "_blank"
                )
              }
            >
              <LinkedinIcon fill="currentColor" />
            </Button>
            <Button
              variant={"ghost"}
              className="hover:bg-accent! hover:text-accent-foreground!"
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/in/theboyofdream",
                  "_blank"
                )
              }
            >
              <LinkBreak />
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
            <InfoIcon />
            <span className="flex-1">Open source credits</span>
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
