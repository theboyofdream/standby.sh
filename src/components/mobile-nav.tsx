import { Clock3Icon, HourglassIcon, TimerIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";

const ITEMS = [
  { url: "/clocks", label: "Clocks", icon: Clock3Icon },
  { url: "/countdown", label: "Countdown", icon: HourglassIcon },
  { url: "/stopwatch", label: "Stopwatch", icon: TimerIcon },
];

export function MobileNav() {
  const pathname = useLocation().pathname;
  return (
    // z-40: below dialog overlay (z-50)
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-background sm:hidden">
      {ITEMS.map(({ url, label, icon: Icon }) => (
        <Link
          key={url}
          to={url}
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs text-muted-foreground",
            pathname === url && "text-primary"
          )}
        >
          <Icon className="size-5" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
