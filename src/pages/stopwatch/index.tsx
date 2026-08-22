import { AddActionCard } from "@/components/add-action-card";
import {
  EditIconButton,
  FullScreenIconButton,
  PlayPauseIconButton,
  ResetIconButton,
} from "@/components/icon-buttons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { stopwatchElapsed, useStopwatch } from "@/hooks/useStopwatch";
import { cn } from "@/lib/utils";
import { MiniStopwatch } from "@/pages/stopwatch/mini-stopwatch";
import {
  StopwatchForm,
  type stopwatchFormRef,
} from "@/pages/stopwatch/stopwatch-form";
import { StopwatchText } from "@/pages/stopwatch/stopwatch-text";
import { PlusIcon } from "lucide-react";
import { Fragment, useRef } from "react";

export default function StopwatchPage() {
  const ref = useRef<HTMLDivElement>(null);
  const formRef = useRef<stopwatchFormRef | null>(null);
  const { isFullscreen, toggle } = useFullscreen(
    ref as React.RefObject<Element>
  );
  const {
    stopwatches,
    activeStopwatchId,
    setActiveStopwatch,
    removeStopwatch,
    addStopwatch,
    toggleStopwatch,
    resetStopwatch,
  } = useStopwatch();

  const active =
    stopwatches.find((sw) => sw.id === activeStopwatchId) ?? stopwatches[0];

  const details = active
    ? {
        Name: active.label,
        Status:
          active.startedAt !== null
            ? "Running"
            : stopwatchElapsed(active) > 0
              ? "Paused"
              : "Ready",
      }
    : { Status: "No stopwatch" };

  return (
    <section className="flex flex-col gap-3 flex-1 h-full">
      <Card className="bg-accent dark:bg-card h-full group" ref={ref}>
        {active ? (
          <CardContent
            className={cn(
              "flex flex-1 items-center justify-center w-full text-[13vw]",
              "not-dark:text-current/80"
            )}
          >
            <StopwatchText
              startedAt={active.startedAt}
              accumulatedMs={active.accumulatedMs}
            />
          </CardContent>
        ) : (
          <CardContent className="flex flex-1 flex-col items-center justify-center w-full text-center">
            <p className="text-3xl font-medium">No stopwatch</p>
            <p className="text-sm mt-2 text-muted-foreground mb-4">
              Create a stopwatch to start tracking elapsed time
            </p>
            <Button variant={"ghost"} size={"lg"} onClick={() => addStopwatch()}>
              <PlusIcon />
              <span>Add Stopwatch</span>
            </Button>
          </CardContent>
        )}
        <CardFooter className="flex">
          <div
            className={cn(
              "text-xs min-w-fit grid grid-cols-[auto_1fr] gap-x-1 opacity-0 transition-opacity duration-500",
              !isFullscreen && "group-hover:opacity-100 max-sm:opacity-100"
            )}
          >
            {Object.entries(details).map(([key, value]) => (
              <Fragment key={key}>
                <span className="text-muted-foreground justify-self-start pr-2">
                  {key}
                </span>
                <span>{value}</span>
              </Fragment>
            ))}
          </div>
          <span className="flex-1"></span>
          <span
            className={cn(
              "opacity-0 transition-opacity duration-500",
              !isFullscreen && active && "group-hover:opacity-100 max-sm:opacity-100"
            )}
          >
            <PlayPauseIconButton
              isPaused={active?.startedAt === null || !active}
              onClick={() => active && toggleStopwatch(active.id)}
            />
            <ResetIconButton onClick={() => active && resetStopwatch(active.id)} />
            <EditIconButton onClick={() => active && formRef.current?.open(active.id)} />
          </span>
          <FullScreenIconButton
            isFullscreen={isFullscreen}
            onClick={() => ref.current && toggle(ref.current)}
          />
        </CardFooter>
      </Card>

      <div className="max-h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {stopwatches.map((stopwatch) => (
          <MiniStopwatch
            key={stopwatch.id}
            stopwatch={stopwatch}
            isCurrentlyActive={stopwatch.id === activeStopwatchId}
            onClick={setActiveStopwatch}
            onEdit={(id) => formRef.current?.open(id)}
            onDelete={removeStopwatch}
            onToggle={toggleStopwatch}
            onReset={resetStopwatch}
          />
        ))}
        <AddActionCard
          description="Add new stopwatch"
          actionLabel="Add Stopwatch"
          onClick={() => addStopwatch()}
        />
      </div>
      <StopwatchForm ref={formRef} />
    </section>
  );
}
