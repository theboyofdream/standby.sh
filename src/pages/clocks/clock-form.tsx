import { useClocks } from "@/hooks/useClocks";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle } from "../../components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import { ComboBox } from "../../components/ui/combo-box";
import { Button } from "../../components/ui/button";
import TIMEZONES from "@/constants/timezone-utcs.json";

export type clockFormRef = {
    open: (id?: string) => void;
};
const clockFormSchema = z.object({
    label: z.string().min(2, "Clock label should be at least 2 characters."),
    timezone: z.enum(TIMEZONES, "Timezone is requireed."),
});
export const ClockForm = forwardRef<clockFormRef>((_, ref) => {
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
            <DialogContent className="w-sm max-w-[calc(100vw-2rem)]">
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
