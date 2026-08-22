import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  ALargeSmallIcon,
  CheckIcon,
  ChevronDownIcon,
  FileDownIcon,
  GithubIcon,
  LinkedinIcon,
  MoonStarIcon,
  SunIcon,
  SwatchBookIcon,
  TwitterIcon,
  FileUpIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FONT_SCALES,
  useClockConfig,
  type FontScale,
} from "@/hooks/useClockConfig";
import { exportData, importData } from "@/lib/backup";
import { useTheme } from "@/hooks/useTheme";

export function MenuDropdown() {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    // re-apply persisted theme class on mount (persist doesn't run the side effect)
    setTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <DropdownMenu onOpenChange={() => setIsMenuOpened(!isMenuOpened)}>
      <DropdownMenuTrigger asChild>
        <Button variant={"secondary"} size={"sm"} className="pl-3.5!">
          {/* <SettingsIcon
            className={cn(
              "transition duration-500",
              isMenuOpened && "rotate-90"
            )}
          /> */}
          {/* <LayoutGridIcon /> */}
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
          <FontScaleSubDropdown />
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <ThemeSwitcherDropdownItems />
          {/*<DropdownMenuSeparator />*/}
          {/* <DropdownMenuItem disabled>
            <ChartColumnIcon />
            <span className="flex-1">View public stats</span>
            <ExternalLinkIcon className="opacity-50" />
          </DropdownMenuItem> */}
          {/* <DropdownMenuSeparator /> */}
          {/* <DropdownMenuItem disabled>
            <CoffeeIcon />
            <span className="flex-1">Buy me a coffee</span>
            <ExternalLinkIcon className="opacity-50" />
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="hover:bg-transparent! p-0 flex"
            onClick={(e) => e.preventDefault()}
          >
            <Button
              variant={"ghost"}
              title="Export data (JSON)"
              className="hover:bg-accent! hover:text-accent-foreground! flex flex-1 justify-center"
              onClick={() => exportData()}
            >
              <FileDownIcon />
              <span>Export</span>
            </Button>
            <Button
              variant={"ghost"}
              title="Import data (JSON)"
              className="hover:bg-accent! hover:text-accent-foreground! flex flex-1 justify-center"
              onClick={() => importInputRef.current?.click()}
            >
              {/*<UploadIcon />*/}
              <FileUpIcon />
              <span>Import</span>
            </Button>
          </DropdownMenuItem>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) importData(file);
              e.target.value = "";
            }}
          />
          <DropdownMenuSeparator />
          {/* <DropdownMenuLabel>Social Links</DropdownMenuLabel> */}
          <DropdownMenuItem
            className="hover:bg-transparent! p-0"
            onClick={(e) => e.preventDefault()}
          >
            <Button
              variant={"ghost"}
              className="hover:bg-accent! hover:text-accent-foreground!"
              onClick={() =>
                window.open("https://github.com/theboyofdream", "_blank")
              }
            >
              <GithubIcon fill="currentColor" strokeWidth={0} />
            </Button>
            <Button
              variant={"ghost"}
              className="hover:bg-accent! hover:text-accent-foreground!"
              onClick={() =>
                window.open("https://x.com/theboyofdream", "_blank")
              }
            >
              <TwitterIcon fill="currentColor" strokeWidth={0} />
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
              <LinkedinIcon fill="currentColor" strokeWidth={0} />
            </Button>
          </DropdownMenuItem>
          {/*<DropdownMenuSeparator />
            <DropdownMenuItem disabled>
            <span className="flex-1">Open source credits</span>
          </DropdownMenuItem>*/}
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

function FontScaleSubDropdown() {
  const { fontScale, setFontScale } = useClockConfig();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <ALargeSmallIcon />
        <span className="flex-1">Font size</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent sideOffset={8} className="ml-2">
        {(Object.keys(FONT_SCALES) as FontScale[]).map((scale) => (
          <DropdownMenuItem key={scale} onClick={() => setFontScale(scale)}>
            <span className="flex-1">{FONT_SCALES[scale].label}</span>
            {fontScale === scale && <CheckIcon />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

function ThemeSwitcherDropdownItems() {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <DropdownMenuItem onClick={() => setTheme("system")}>
        <SwatchBookIcon fill="currentColor" strokeWidth={0} fillRule="evenodd" />
        <span className="flex-1">System</span>
        {theme === "system" && <CheckIcon />}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("light")}>
        <SunIcon fill="currentColor" />
        <span className="flex-1">Light</span>
        {theme === "light" && <CheckIcon />}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("dark")}>
        <MoonStarIcon fill="currentColor" />
        <span className="flex-1">Dark</span>
        {theme === "dark" && <CheckIcon />}
      </DropdownMenuItem>
    </>
  );
}
