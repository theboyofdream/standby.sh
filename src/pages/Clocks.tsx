import { FullScreenButton } from "@/components/fullscreen-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ComboBox } from "@/components/ui/combo-box";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useClockConfig } from "@/hooks/useClockConfig";
import { useClocks } from "@/hooks/useClocks";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

export default function ClocksPage() {
  return (
    <section className="flex flex-col gap-3 flex-1 h-fullt">
      {/*<Combobox
        data={[{ label: "one", value: "one" }]}
        placeholder="Select Timezone"
      />*/}
      <ActiveClock></ActiveClock>
      <Clocks></Clocks>
    </section>
  );
}

function ActiveClock() {
  const { showSecs, hrsFormat } = useClockConfig();
  const { clocks, activeClockId } = useClocks();
  const [currentTime, setCurrentTime] = useState<string>("");

  // Find the active clock
  const activeClock = clocks.find((clock) => clock.id === activeClockId);
  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: activeClock?.timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: showSecs ? "2-digit" : undefined,
        hour12: hrsFormat === "12",
      };
      setCurrentTime(now.toLocaleTimeString("en-US", options));
    }, 1000);

    // Cleanup the interval on unmount
    return () => clearInterval(timer);
  }, [activeClock?.timezone, showSecs, hrsFormat]);

  const [hours, minutes, secondsWithAMPM] = currentTime.split(":");
  const [seconds, ampm] = secondsWithAMPM?.split(" ") || [secondsWithAMPM, ""];
  return (
    <Card className="bg-accent dark:bg-card h-full" id="clock">
      <CardContent className="flex flex-1 items-center justify-center w-full text-[15vw]">
        <div className="flex w-fit max-h-fit items-start justify-center">
          <span>{hours}</span>
          <span className="opacity-60 dark:opacity-30">:</span>
          <span>{minutes}</span>
          {showSecs && (
            <>
              <span className="opacity-60 dark:opacity-30">:</span>
              <span>{seconds}</span>
            </>
          )}
          {hrsFormat === "12" && (
            <span className="text-[5vw] opacity-60 dark:opacity-30">
              &nbsp;{ampm}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex">
        <div className="text-xs min-w-fit grid grid-cols-2">
          <span className="text-muted-foreground">Clock Name</span>
          <span>:&nbsp;{activeClock?.label}</span>
          <span className="text-muted-foreground">Timezone</span>
          <span>:&nbsp;{activeClock?.timezone}</span>
          <span className="text-muted-foreground">UTC Offset</span>
          <span>
            :&nbsp;{activeClock && getUtcOffset(activeClock.timezone)}
          </span>
        </div>
        <span className="flex-1"></span>
        <FullScreenButton />
      </CardFooter>
    </Card>
  );
}

function Clocks() {
  const { clocks, setActiveClock, activeClockId, removeClock } = useClocks();
  const addClockRef = useRef<clockFormRef | null>(null);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {clocks.map((clock) => (
        <Card
          key={clock.id}
          onClick={() => setActiveClock(clock.id)}
          className={"bg-accent dark:bg-card aspect-video group cursor-pointer"}
        >
          <CardContent>
            <div className="flex justify-between">
              <p className="text-xl">{clock.label}</p>
              {clock.id === activeClockId && <CheckIcon className="size-4" />}
            </div>
            <p className="text-muted-foreground">{clock.timezone}</p>
            <p className="text-3xl text-muted-foreground">
              <ClockText timezone={clock.timezone} />
            </p>
          </CardContent>
          <CardFooter className="flex">
            <span className="flex-1 text-muted-foreground">
              {getUtcOffset(clock.timezone)}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant={"ghost"}
                size={"sm"}
                className="hover:text-primary!"
                onClick={() => addClockRef.current?.open(clock.id)}
              >
                <PencilIcon></PencilIcon>
              </Button>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="hover:text-destructive!"
                onClick={() => removeClock(clock.id)}
              >
                <TrashIcon></TrashIcon>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
      {clocks.length <= 4 && (
        <Card className="bg-accent dark:bg-card min-h-44">
          <CardContent className="flex flex-col justify-center items-center h-full gap-1">
            <span className="text-muted-foreground">Add upto 4 timezones.</span>
            <Button
              variant={"ghost"}
              size={"lg"}
              onClick={() => addClockRef.current?.open()}
            >
              <PlusIcon></PlusIcon>
              <span>Add Timezone</span>
            </Button>
          </CardContent>
        </Card>
      )}
      <ClockForm ref={addClockRef} />
    </div>
  );
}

import TIMEZONES from "@/constants/timezone-utcs.json";

type clockFormRef = {
  open: (id?: string) => void;
};
const clockFormSchema = z.object({
  label: z.string().min(2, "Clock label should be at least 2 characters."),
  timezone: z.enum(TIMEZONES, "Timezone is requireed."),
});
const ClockForm = forwardRef<clockFormRef>((_, ref) => {
  const { clocks, addClock } = useClocks();
  const [open, setOpen] = useState(false);
  const clockForm = useForm<z.infer<typeof clockFormSchema>>({
    resolver: zodResolver(clockFormSchema),
    defaultValues: {
      label: "",
      timezone: "",
    },
  });

  function onSubmit(data: z.infer<typeof clockFormSchema>) {
    console.log(data);
    addClock(data.timezone, data.label);
    setOpen(false);
  }

  const allUTCTimezones = useMemo(() => {
    // const utcs = new Set();
    // TIMEZONES.map(({ utc }) => utc.map((u) => utcs.add(u)));
    // console.log(JSON.stringify([...utcs]));
    const formattedUTCs: { label: string; value: string }[] = [];
    TIMEZONES.forEach((utc) => formattedUTCs.push({ label: utc, value: utc }));
    return formattedUTCs;
  }, []);

  useImperativeHandle(ref, () => ({
    open(id) {
      if (id) {
        const clock = clocks.filter((c) => c.id === id)[0];
        if (clock) {
          clockForm.setValue("label", clock.label);
          clockForm.setValue("timezone", clock.timezone);
        }
      }
      setOpen(true);
    },
  }));

  useEffect(() => {
    if (!open) {
      clockForm.reset();
    }
  }, [open, clockForm]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="backdrop-blur-xs"></DialogOverlay>
      <DialogContent className="w-sm">
        <DialogHeader>
          <DialogTitle>Timezone Form</DialogTitle>
          <DialogDescription>
            Give your clock a custom name to easily recognize its timezone.
          </DialogDescription>
        </DialogHeader>
        <form id="add-clock-form" onSubmit={clockForm.handleSubmit(onSubmit)}>
          <FieldGroup className="flex flex-col gap-3">
            <Controller
              name="label"
              control={clockForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="label">Clock Name</FieldLabel>
                  <Input
                    {...field}
                    id="label"
                    aria-invalid={fieldState.invalid}
                    placeholder="Type Name to identify this clock"
                    autoComplete="on"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="timezone"
              control={clockForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="timezone">Select Timezone</FieldLabel>
                  <ComboBox
                    data={allUTCTimezones}
                    placeholder="Select Timezone"
                    emptyPlaceholderText="No Timezone found!"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            className="w-full mt-3"
            type="submit"
            onClick={clockForm.handleSubmit(onSubmit)}
          >
            Save Timezone
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

function ClockText({ timezone }: { timezone: string }) {
  const { showSecs, hrsFormat } = useClockConfig();
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: showSecs ? "2-digit" : undefined,
        hour12: hrsFormat === "12",
      };
      setTime(now.toLocaleTimeString("en-US", options));
    }, 500);

    return () => clearInterval(timer);
  }, [timezone, showSecs, hrsFormat]);
  const [hours, minutes, secondsWithAMPM] = time.split(":");
  const [seconds, ampm] = secondsWithAMPM?.split(" ") || [secondsWithAMPM, ""];
  // return <span>{time}</span>;
  return (
    <div className="flex w-fit max-h-fit items-start justify-center">
      <span>{hours}</span>
      <span className="opacity-60 dark:opacity-30">:</span>
      <span>{minutes}</span>
      {showSecs && (
        <>
          <span className="opacity-60 dark:opacity-30">:</span>
          <span>{seconds}</span>
        </>
      )}
      {hrsFormat === "12" && (
        <span className="text-lg opacity-60">&nbsp;{ampm}</span>
      )}
    </div>
  );
}

function getUtcOffset(timezone: string) {
  const now = new Date();
  const tz = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "shortOffset",
  })
    .formatToParts(now)
    .find((p) => p.type === "timeZoneName")?.value;

  return tz?.startsWith("UTC") ? tz : `UTC${tz?.replace("GMT", "") || "+00"}`;
}
