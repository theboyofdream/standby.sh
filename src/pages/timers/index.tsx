import { AddActionCard } from "@/components/add-action-card";
import { EditIconButton, FullScreenIconButton, PlayPauseIconButton, ResetIconButton } from "@/components/icon-buttons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";
import { CountdownForm, type countdownFormRef } from "@/pages/timers/timers-form";
import { CountdownText } from "@/pages/timers/timer-text";
import { MiniCountdown } from "@/pages/timers/mini-timer";
import { PlusIcon } from "lucide-react";
import { Fragment, useRef } from "react";

export default function CountdownPage() {
    const { countdowns, activeCountdownId, setActiveCountdown, removeCountdown, toggleCountdown, resetCountdown } = useCountdown();
    const ref = useRef<HTMLDivElement>(null);
    const countdownFormRef = useRef<countdownFormRef | null>(null);
    const { isFullscreen, toggle } = useFullscreen(
        ref as React.RefObject<Element>
    );

    const activeCountdown = countdowns.find((countdown) => countdown.id === activeCountdownId);

    const pad = (num: number) => String(num).padStart(2, "0");

    const activeCountdownDetails = activeCountdown ? {
        "Name": activeCountdown?.label,
        "Time": `${pad(activeCountdown.initialHours)} hrs ${pad(activeCountdown.initialMinutes)} mins`,
    } : {
        "Status": "No active countdown"
    }

    return (
        <section className="flex flex-col gap-3 flex-1 h-full">

            <Card className="bg-accent dark:bg-card h-full group" ref={ref}>
                {
                    activeCountdown ?
                        <CardContent className={cn(
                            "flex flex-1 items-center justify-center w-full text-[15vw]",
                            "not-dark:text-current/80"
                        )} >
                            <CountdownText targetDate={activeCountdown.targetDate} isRunning={!activeCountdown.isPaused} remainingMs={activeCountdown.remainingMs} />
                        </CardContent> :
                        <CardContent className="flex flex-1 flex-col items-center justify-center w-full text-center">
                            <p className="text-3xl font-medium">No countdown selected</p>
                            <p className="text-sm mt-2 text-muted-foreground mb-4">Select a countdown from below or create a new countdown to get started</p>
                            <Button
                                variant={"ghost"}
                                size={"lg"}
                                onClick={() => countdownFormRef.current?.open()}
                            >
                                <PlusIcon />
                                <span>Add Countdown</span>
                            </Button>
                        </CardContent>

                }
                <CardFooter className="flex">
                    <div
                        className={cn(
                            "text-xs min-w-fit grid grid-cols-[auto_1fr] gap-x-1 opacity-0 transition-opacity duration-500",
                            !isFullscreen && "group-hover:opacity-100"
                        )}
                    >
                        {Object.entries(activeCountdownDetails).map(([key, value]) => (
                            <Fragment key={key}>
                                <span className="text-muted-foreground justify-self-start pr-2">
                                    {key.trim()}
                                </span>
                                <span>{value}</span>
                            </Fragment>
                        ))}
                    </div>
                    <span className="flex-1"></span>
                    <span className={cn(
                        "opacity-0 transition-opacity duration-500",
                        !isFullscreen && activeCountdown && "group-hover:opacity-100"
                    )}>
                        <PlayPauseIconButton
                            isPaused={activeCountdown?.isPaused || false}
                            onClick={() => ref.current && toggle(ref.current)}
                        />
                        <ResetIconButton onClick={() => ref.current && toggle(ref.current)} />
                        <EditIconButton onClick={() => ref.current && toggle(ref.current)} />
                    </span>
                    <FullScreenIconButton
                        isFullscreen={isFullscreen}
                        onClick={() => ref.current && toggle(ref.current)}
                    />
                </CardFooter>
            </Card>
            <div className="max-h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {countdowns.map((countdown) => (
                    <MiniCountdown
                        key={countdown.id}
                        id={countdown.id}
                        label={countdown.label}
                        targetDate={countdown.targetDate}
                        remainingMs={countdown.remainingMs}
                        isPaused={countdown.isPaused}
                        isCurrentlyActive={countdown.id === activeCountdownId}
                        onClick={() => setActiveCountdown(countdown.id)}
                        onEdit={() => countdownFormRef.current?.open(countdown.id)}
                        onDelete={() => removeCountdown(countdown.id)}
                        onToggle={() => toggleCountdown(countdown.id)}
                        onReset={() => resetCountdown(countdown.id)}
                    />
                ))}
                <AddActionCard
                    description="Add new countdown"
                    actionLabel="Add Countdown"
                    onClick={() => countdownFormRef.current?.open()}
                />
            </div>
            <CountdownForm ref={countdownFormRef} />
        </section>
    );
}
