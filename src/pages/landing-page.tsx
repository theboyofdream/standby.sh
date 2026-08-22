import { ArrowUpRightIcon, GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";
import { Link } from "react-router";
import { ClockText } from "./clocks/clock-text";

export default function LandingPage() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <Link to="/" className="font-medium">
            standby.sh
          </Link>
        </div>
        <div className="text-4xl leading-none">
          <ClockText />
        </div>
        <nav className="flex flex-col items-start gap-0.5 text-xs leading-normal">
          <Link to="/clocks" className="inline-flex items-center gap-1 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:underline underline-offset-4">
            Clocks <ArrowUpRightIcon className="size-3 opacity-60" />
          </Link>
          <Link to="/countdown" className="inline-flex items-center gap-1 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:underline underline-offset-4">
            Countdown <ArrowUpRightIcon className="size-3 opacity-60" />
          </Link>
          <Link to="/stopwatch" className="inline-flex items-center gap-1 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:underline underline-offset-4">
            Stopwatch <ArrowUpRightIcon className="size-3 opacity-60" />
          </Link>
        </nav>
        <div className="flex items-center gap-3 pt-2">
          <a href="https://github.com/theboyofdream" target="_blank" rel="noreferrer" className="text-muted-foreground opacity-60 hover:opacity-100 hover:text-foreground">
            <GithubIcon className="size-4" fill="currentColor" strokeWidth={0} />
          </a>
          <a href="https://x.com/theboyofdream" target="_blank" rel="noreferrer" className="text-muted-foreground opacity-60 hover:opacity-100 hover:text-foreground">
            <TwitterIcon className="size-4" fill="currentColor" strokeWidth={0} />
          </a>
          <a href="https://www.linkedin.com/in/theboyofdream" target="_blank" rel="noreferrer" className="text-muted-foreground opacity-60 hover:opacity-100 hover:text-foreground">
            <LinkedinIcon className="size-4" fill="currentColor" strokeWidth={0} />
          </a>
        </div>
      </div>
    </div>
  );
}
