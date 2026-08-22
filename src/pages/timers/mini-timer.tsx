import { DeleteIconButton, EditIconButton, PlayPauseIconButton, ResetIconButton } from "@/components/icon-buttons";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import { CountdownText } from "./timer-text";

interface MiniCountdownProps {
    id: string;
    label: string;
    targetDate: number;
    remainingMs?: number | null;
    isPaused: boolean;
    isCurrentlyActive: boolean;
    onClick: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onToggle: (id: string) => void;
    onReset: (id: string) => void;
}

export function MiniCountdown({
    id,
    label,
    targetDate,
    remainingMs,
    isPaused,
    isCurrentlyActive,
    onClick,
    onEdit,
    onDelete,
    onToggle,
    onReset,
}: MiniCountdownProps) {
    return (
        <Card
            key={id}
            onClick={() => onClick(id)}
            className="bg-accent dark:bg-card aspect-video group cursor-pointer"
        >
            <CardContent className="flex flex-col gap-4">
                <div className="flex justify-between">
                    <p className="text-xl h-6">{label}</p>
                    {isCurrentlyActive && <CheckIcon className="size-4" />}
                </div>
                <p className="text-3xl text-muted-foreground">
                    <CountdownText
                        targetDate={targetDate}
                        remainingMs={remainingMs}
                        isRunning={isCurrentlyActive && !isPaused}
                    />
                </p>
            </CardContent>
            <CardFooter className="flex items-center justify-end">
                <div className="opacity-0 group-hover:opacity-100 max-sm:opacity-100 transition-opacity duration-300 flex gap-0.5">
                    <PlayPauseIconButton 
                        onClick={() => {
                            // always make it active and toggle - this ensures all others are paused
                            onClick(id);
                            onToggle(id);
                        }} 
                        isPaused={isPaused} 
                    />
                    <ResetIconButton onClick={() => onReset(id)} />
                    <EditIconButton onClick={() => onEdit(id)} />
                    <DeleteIconButton onClick={() => onDelete(id)} />
                </div>
            </CardFooter>
        </Card>
    );
}
