import { useStopwatch } from "@/hooks/useStopwatch";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export type stopwatchFormRef = {
  open: (id: string) => void;
};

type FormData = { label: string };

export const StopwatchForm = forwardRef<stopwatchFormRef>((_, ref) => {
  const { renameStopwatch } = useStopwatch();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const form = useForm<FormData>({
    defaultValues: { label: "" },
  });

  useImperativeHandle(ref, () => ({
    open(id) {
      setEditingId(id);
      const sw = useStopwatch.getState().stopwatches.find((s) => s.id === id);
      if (sw) form.reset({ label: sw.label });
      setOpen(true);
    },
  }));

  function onSubmit(data: FormData) {
    if (editingId && data.label.trim()) {
      renameStopwatch(editingId, data.label.trim());
    }
    setOpen(false);
  }

  useEffect(() => {
    if (!open) {
      form.reset();
      setEditingId(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-sm max-w-[calc(100vw-2rem)]">
        <DialogHeader>
          <DialogTitle>Rename Stopwatch</DialogTitle>
          <DialogDescription>Give this stopwatch a name.</DialogDescription>
        </DialogHeader>
        <form
          id="rename-stopwatch-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Field>
            <FieldLabel htmlFor="stopwatch-label">Name</FieldLabel>
            <Input
              {...form.register("label", {
                required: "Name is required.",
              })}
              id="stopwatch-label"
              aria-invalid={!!form.formState.errors.label}
              placeholder="e.g., Workout"
              autoComplete="off"
            />
            {form.formState.errors.label && (
              <FieldError errors={[form.formState.errors.label]} />
            )}
          </Field>
        </form>
        <DialogFooter>
          <Button className="w-full mt-3" type="submit" form="rename-stopwatch-form">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
