import { useCountdown } from "@/hooks/useCountdown";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { ChevronDown, ChevronUp } from "lucide-react";

export type countdownFormRef = {
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

export const CountdownForm = forwardRef<countdownFormRef>((_, ref) => {
  const { countdowns, addCountdown, updateCountdown } = useCountdown();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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

    if (editingId) {
      updateCountdown(editingId, data.label, targetDate, hours, minutes);
      setEditingId(null);
    } else {
      const existingCountdown = countdowns.find(
        (c) => c.label === data.label
      );
      if (existingCountdown) {
        updateCountdown(existingCountdown.id, data.label, targetDate, hours, minutes);
      } else {
        addCountdown(data.label, targetDate, hours, minutes);
      }
    }
    setOpen(false);
  }

  useImperativeHandle(ref, () => ({
    open(id) {
      setEditingId(id ?? null);
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
  }), [countdowns]);

  useEffect(() => {
    if (!open) {
      countdownForm.reset();
      setEditingId(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="backdrop-blur-xs"></DialogOverlay>
      <DialogContent className="w-sm max-w-[calc(100vw-2rem)]">
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
            <div className="grid gap-3">
              <span className="text-sm font-medium">Select Countdown Duration</span>
              <div className="grid grid-cols-4 gap-3">
                {
                  [5, 10, 25, 60].map((minutes) => (
                    <Button
                      key={minutes}
                      type="button"
                      variant="outline"
                      className="h-auto py-1.5 flex-col gap-0"
                      onClick={() => countdownForm.setValue("minutes", String(minutes), { shouldValidate: true })}
                    >
                      <span className="text-lg font-semibold">{minutes}</span>
                      <span className="text-xs text-muted-foreground">mins</span>
                    </Button>
                  ))
                }
              </div>
              {/* <span className="cursor-pointer p-4 py-2 bg-accent/50 hover:bg-accent rounded-lg border">
                Custom
              </span> */}
            </div>
            <div className="flex items-center justify-center">
              <span className="w-full h-px bg-border"></span>
              <span className="px-4">or</span>
              <span className="w-full h-px bg-border"></span>
            </div>
            <div className="flex gap-3">
              <Controller
                name="hours"
                control={countdownForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="flex-1">
                    <FieldLabel htmlFor="hours">Hours</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="hours"
                        type="number"
                        aria-invalid={fieldState.invalid}
                        placeholder="0"
                        min="0"
                        className="[-moz-appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden pr-8"
                      />
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-3.5 w-3.5 p-0 hover:bg-muted"
                          onClick={() => {
                            const currentValue = parseInt(field.value) || 0;
                            field.onChange(String(currentValue + 1));
                          }}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-3.5 w-3.5 p-0 hover:bg-muted"
                          onClick={() => {
                            const currentValue = parseInt(field.value) || 0;
                            field.onChange(String(Math.max(0, currentValue - 1)));
                          }}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
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
                    <div className="relative">
                      <Input
                        {...field}
                        id="minutes"
                        type="number"
                        aria-invalid={fieldState.invalid}
                        placeholder="0"
                        min="0"
                        max="59"
                        className="[-moz-appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden pr-8"
                      />
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-3.5 w-3.5 p-0 hover:bg-muted"
                          onClick={() => {
                            const currentValue = parseInt(field.value) || 0;
                            field.onChange(String(Math.min(59, currentValue + 1)));
                          }}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-3.5 w-3.5 p-0 hover:bg-muted"
                          onClick={() => {
                            const currentValue = parseInt(field.value) || 0;
                            field.onChange(String(Math.max(0, currentValue - 1)));
                          }}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
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
