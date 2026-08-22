import {
  DeleteIconButton,
  EditIconButton,
  PlayPauseIconButton,
  ResetIconButton,
} from "@/components/icon-buttons";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import type { Stopwatch } from "@/hooks/useStopwatch";
import { StopwatchText } from "./stopwatch-text";

interface MiniStopwatchProps {
  stopwatch: Stopwatch;
  isCurrentlyActive: boolean;
  onClick: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onReset: (id: string) => void;
}

export function MiniStopwatch({
  stopwatch,
  isCurrentlyActive,
  onClick,
  onEdit,
  onDelete,
  onToggle,
  onReset,
}: MiniStopwatchProps) {
  const { id, label, startedAt, accumulatedMs } = stopwatch;
  return (
    <Card
      onClick={() => onClick(id)}
      className="bg-accent dark:bg-card aspect-video group cursor-pointer"
    >
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between">
          <p className="text-xl h-6 truncate">{label}</p>
          {isCurrentlyActive && <CheckIcon className="size-4" />}
        </div>
        <p className="text-3xl text-muted-foreground">
          <StopwatchText startedAt={startedAt} accumulatedMs={accumulatedMs} />
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-end">
        <div className="opacity-0 group-hover:opacity-100 max-sm:opacity-100 transition-opacity duration-300 flex gap-0.5">
          <PlayPauseIconButton
            onClick={() => {
              // make active first so all others pause, then toggle this one
              onClick(id);
              onToggle(id);
            }}
            isPaused={startedAt === null}
          />
          <ResetIconButton onClick={() => onReset(id)} />
          <EditIconButton onClick={(e) => { e.stopPropagation(); onEdit(id); }} />
          <DeleteIconButton onClick={(e) => { e.stopPropagation(); onDelete(id); }} />
        </div>
      </CardFooter>
    </Card>
  );
}
