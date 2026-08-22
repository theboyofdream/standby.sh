import { AddActionCard } from "@/components/add-action-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useClocks } from "@/hooks/useClocks";
import { cn, getUtcOffset } from "@/lib/utils";
import { ClockText } from "@/pages/clocks/clock-text";
import { ClockForm, type clockFormRef } from "@/pages/clocks/clock-form";
import { MiniClock } from "@/pages/clocks/mini-clock";
import { PlusIcon } from "lucide-react";
import {
    Fragment,
    useRef
} from "react";
import { EditIconButton, FullScreenIconButton } from "@/components/icon-buttons";

export default function ClockPage() {
    const ref = useRef<HTMLDivElement>(null);
    const addClockFormRef = useRef<clockFormRef | null>(null);

    const { isFullscreen, toggle } = useFullscreen(
        ref as React.RefObject<Element>
    );
    const { clocks, activeClockId, setActiveClock, removeClock } = useClocks();

    // Find the active clock
    const activeClock = clocks.find((clock) => clock.id === activeClockId);

    const activeClockDetails = activeClock ? {
        "Clock Name": activeClock?.label,
        Timezone: activeClock?.timezone,
        "UTC Offset": activeClock?.timezone
            ? getUtcOffset(activeClock.timezone)
            : undefined,
    } : {
        "Status": "No active clock"
    };



    return (
        <section className="flex flex-col gap-3 flex-1 min-h-0 overflow-x-hidden">
            {/* Active clock */}

            <Card className="bg-accent dark:bg-card h-full group" ref={ref}>
                {
                    activeClock ?
                        <CardContent className={cn(
                            "flex flex-1 items-center justify-center w-full text-[15vw]",
                            "not-dark:text-current/80"
                        )} >
                            <ClockText timezone={activeClock.timezone} />
                        </CardContent> :
                        <CardContent className="flex flex-1 flex-col items-center justify-center w-full text-center">
                            <p className="text-3xl font-medium">No clock selected</p>
                            <p className="text-sm mt-2 text-muted-foreground mb-4">Select a clock from below or create a new timezone to get started</p>
                            <Button
                                variant={"ghost"}
                                size={"lg"}
                                onClick={() => addClockFormRef.current?.open()}
                            >
                                <PlusIcon />
                                <span>Add Clock</span>
                            </Button>
                        </CardContent>

                }
                <CardFooter className="flex">
                    <div
                        className={cn(
                            "text-xs min-w-fit grid grid-cols-[auto_1fr] gap-x-1 opacity-0 transition-opacity duration-500",
                            !isFullscreen && "group-hover:opacity-100 max-sm:opacity-100"
                        )}
                    >
                        {Object.entries(activeClockDetails).map(([key, value]) => (
                            <Fragment key={key}>
                                <span className="text-muted-foreground justify-self-start pr-2">
                                    {key.trim()}
                                </span>
                                <span>{value}</span>
                            </Fragment>
                        ))}
                    </div>
                    <span className="flex-1"></span>
                    <span
                        className={cn(
                            "opacity-0 transition-opacity duration-500",
                            !isFullscreen && activeClock &&
                              "group-hover:opacity-100 max-sm:opacity-100"
                        )}
                    >
                        <EditIconButton onClick={() => addClockFormRef.current?.open(activeClock?.id)} />
                    </span>
                    <FullScreenIconButton
                        isFullscreen={isFullscreen}
                        onClick={() => ref.current && toggle(ref.current)}
                    />
                </CardFooter>
            </Card>
            {/* mini-clocks */}
            <div className="max-h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {clocks.map(({ id, label, timezone }) => (
                    <MiniClock
                        id={id}
                        label={label}
                        timezone={timezone}
                        isActive={id === activeClockId}
                        onClick={() => setActiveClock(id)}
                        onEdit={() => addClockFormRef.current?.open(id)}
                        onDelete={() => removeClock(id)}
                    />
                ))}
                {/* {clocks.length < 4 && ( */}
                <AddActionCard
                    description="Add new timezone"
                    actionLabel="Add Timezone"
                    onClick={() => addClockFormRef.current?.open()}
                />
                {/* )} */}
            </div>
            <ClockForm ref={addClockFormRef} />
        </section>
    );
}
