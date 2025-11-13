import { FullScreenButton } from "@/components/fullscreen-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import { useCountdown } from "@/hooks/useCountdown";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, PencilIcon, PlusIcon, TrashIcon, PlayIcon, PauseIcon } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

export default function CountdownPage() {
  return (
    <section className="flex flex-col gap-3 flex-1 h-full">
      <ActiveCountdown></ActiveCountdown>
      <Countdowns></Countdowns>
    </section>
  );
}

function ActiveCountdown() {
  const { countdowns, activeCountdownId, toggleCountdown } = useCountdown();
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });
  const [initialTimer, setInitialTimer] = useState<{
    hours: number;
    minutes: number;
  }>({ hours: 0, minutes: 0 });

  const activeCountdown = countdowns.find(
    (countdown) => countdown.id === activeCountdownId
  );

  // Update the countdown every second
  useEffect(() => {
    if (!activeCountdown) return;

    // If countdown is paused, compute snapshot once and don't start interval
    if (!activeCountdown.isActive) {
      const now = Date.now();
      const difference = activeCountdown.remainingMs ?? Math.max(activeCountdown.targetDate - now, 0);

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
      return;
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const targetTime = activeCountdown.targetDate;
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeCountdown, activeCountdown?.isActive]);

  // Use the initial hours/minutes saved when the countdown was created
  useEffect(() => {
    if (!activeCountdown) return;
    setInitialTimer({ hours: activeCountdown.initialHours, minutes: activeCountdown.initialMinutes });
  }, [activeCountdown?.id]);

  if (!activeCountdown) {
    return (
      <Card className="bg-accent dark:bg-card h-full" id="countdown">
        <CardContent className="flex flex-1 items-center justify-center w-full">
          <div className="text-center text-muted-foreground">
            <p>No countdown selected</p>
            <p className="text-sm">Create one to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pad = (num: number) => String(num).padStart(2, "0");

  return (
    <Card className="bg-accent dark:bg-card h-full" id="countdown">
      <CardContent className="flex flex-1 items-center justify-center w-full text-[12vw]">
        <div className="flex w-fit max-h-fit items-start justify-center">
          <span>{pad(timeLeft.hours)}</span>
          <span className="opacity-60 dark:opacity-30">:</span>
          <span>{pad(timeLeft.minutes)}</span>
          <span className="opacity-60 dark:opacity-30">:</span>
          <span>{pad(timeLeft.seconds)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-xs min-w-fit grid grid-cols-2">
          <span className="text-muted-foreground">Name</span>
          <span>:&nbsp;{activeCountdown.label}</span>
          <span className="text-muted-foreground">Set</span>
          <span>:&nbsp;{pad(initialTimer.hours)}:{pad(initialTimer.minutes)}</span>
        </div>
        <span className="flex-1"></span>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="hover:text-primary!"
          onClick={() => toggleCountdown(activeCountdown.id)}
        >
          {activeCountdown.isActive ? <PauseIcon className="size-5" /> : <PlayIcon className="size-5" />}
        </Button>
        <FullScreenButton />
      </CardFooter>
    </Card>
  );
}

function Countdowns() {
  const { countdowns, setActiveCountdown, activeCountdownId, removeCountdown, toggleCountdown } =
    useCountdown();
  const addCountdownRef = useRef<countdownFormRef | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {countdowns.map((countdown) => (
        <Card
          key={countdown.id}
          onClick={() => setActiveCountdown(countdown.id)}
          className={"bg-accent dark:bg-card aspect-video group cursor-pointer"}
        >
          <CardContent>
            <div className="flex justify-between">
              <p className="text-xl">{countdown.label}</p>
              {countdown.id === activeCountdownId && <CheckIcon className="size-4" />}
            </div>
            <p className="text-muted-foreground text-sm">
              {new Date(countdown.targetDate).toLocaleDateString()}
            </p>
            <p className="text-2xl text-muted-foreground">
              <CountdownText targetDate={countdown.targetDate} remainingMs={countdown.remainingMs} isActive={countdown.id === activeCountdownId && countdown.isActive} />
            </p>
          </CardContent>
          <CardFooter className="flex items-center justify-end">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-0.5">
              <Button
                variant={"ghost"}
                size={"sm"}
                className="hover:text-primary!"
                onClick={(e) => {
                  e.stopPropagation();
                  // ensure card becomes active when user toggles from the card
                  setActiveCountdown(countdown.id);
                  toggleCountdown(countdown.id);
                }}
              >
                {countdown.isActive ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
              </Button>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="hover:text-primary!"
                onClick={(e) => {
                  e.stopPropagation();
                  addCountdownRef.current?.open(countdown.id);
                }}
              >
                <PencilIcon></PencilIcon>
              </Button>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="hover:text-destructive!"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCountdown(countdown.id);
                }}
              >
                <TrashIcon></TrashIcon>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
      {countdowns.length <= 4 && (
        <Card className="bg-accent dark:bg-card min-h-44">
          <CardContent className="flex flex-col justify-center items-center h-full gap-1">
            <span className="text-muted-foreground">Add upto 4 countdowns.</span>
            <Button
              variant={"ghost"}
              size={"lg"}
              onClick={() => addCountdownRef.current?.open()}
            >
              <PlusIcon></PlusIcon>
              <span>Add Countdown</span>
            </Button>
          </CardContent>
        </Card>
      )}
      <CountdownForm ref={addCountdownRef} />
    </div>
  );
}

type countdownFormRef = {
  open: (id?: string) => void;
};

const countdownFormSchema = z.object({
  label: z.string().min(2, "Countdown label should be at least 2 characters."),
  hours: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "Hours must be 0 or greater."
  ),
  minutes: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) < 60,
    "Minutes must be between 0 and 59."
  ),
});

const CountdownForm = forwardRef<countdownFormRef>((_, ref) => {
  const { countdowns, addCountdown, updateCountdown } = useCountdown();
  const [open, setOpen] = useState(false);
  const countdownForm = useForm<z.infer<typeof countdownFormSchema>>({
    resolver: zodResolver(countdownFormSchema),
    defaultValues: {
      label: "",
      hours: "0",
      minutes: "0",
    },
  });

  function onSubmit(data: z.infer<typeof countdownFormSchema>) {
    const hours = Number(data.hours);
    const minutes = Number(data.minutes);
    
    // Calculate target date from hours and minutes from now
    const now = new Date();
    const targetDate = new Date(now.getTime() + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000));
    
    if (targetDate <= now) {
      countdownForm.setError("hours", {
        message: "Please enter a valid countdown time.",
      });
      return;
    }

    const existingCountdown = countdowns.find(
      (c) => c.label === data.label
    );

    if (existingCountdown) {
      updateCountdown(existingCountdown.id, data.label, targetDate, hours, minutes);
    } else {
      addCountdown(data.label, targetDate, hours, minutes);
    }
    setOpen(false);
  }

  useImperativeHandle(ref, () => ({
    open(id) {
      if (id) {
        const countdown = countdowns.find((c) => c.id === id);
        if (countdown) {
          countdownForm.setValue("label", countdown.label);
          // use stored initial hours/minutes (what user originally entered)
          countdownForm.setValue("hours", countdown.initialHours.toString());
          countdownForm.setValue("minutes", countdown.initialMinutes.toString());
        }
      }
      setOpen(true);
    },
  }));

  useEffect(() => {
    if (!open) {
      countdownForm.reset();
    }
  }, [open, countdownForm]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="backdrop-blur-xs"></DialogOverlay>
      <DialogContent className="w-sm">
        <DialogHeader>
          <DialogTitle>Countdown Form</DialogTitle>
          <DialogDescription>
            Create a countdown by entering hours, minutes, and a name.
          </DialogDescription>
        </DialogHeader>
        <form
          id="add-countdown-form"
          onSubmit={countdownForm.handleSubmit(onSubmit)}
        >
          <FieldGroup className="flex flex-col gap-3">
            <Controller
              name="label"
              control={countdownForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="label">Countdown Name</FieldLabel>
                  <Input
                    {...field}
                    id="label"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g., Project Deadline"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="flex gap-3">
              <Controller
                name="hours"
                control={countdownForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="flex-1">
                    <FieldLabel htmlFor="hours">Hours</FieldLabel>
                    <Input
                      {...field}
                      id="hours"
                      type="number"
                      aria-invalid={fieldState.invalid}
                      placeholder="0"
                      min="0"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="minutes"
                control={countdownForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="flex-1">
                    <FieldLabel htmlFor="minutes">Minutes</FieldLabel>
                    <Input
                      {...field}
                      id="minutes"
                      type="number"
                      aria-invalid={fieldState.invalid}
                      placeholder="0"
                      min="0"
                      max="59"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            className="w-full mt-3"
            type="submit"
            onClick={countdownForm.handleSubmit(onSubmit)}
          >
            Save Countdown
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

function CountdownText({ targetDate, isActive, remainingMs }: { targetDate: number; isActive: boolean; remainingMs?: number | null }) {
  const [timeLeft, setTimeLeft] = useState<string>("00:00:00");

  useEffect(() => {
    if (!isActive) {
      // If not active, show frozen remainingMs if provided, otherwise compute from targetDate
      const now = Date.now();
      const difference = remainingMs ?? Math.max(targetDate - now, 0);

      if (difference <= 0) {
        setTimeLeft("00:00:00");
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}:${String(seconds).padStart(2, "0")}`
        );
      }
      return;
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft("00:00:00");
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}:${String(seconds).padStart(2, "0")}`
        );
      }
    }, 500);

    return () => clearInterval(timer);
  }, [targetDate, isActive]);

  return <span>{timeLeft}</span>;
}
