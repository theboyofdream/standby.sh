import { MaximizeIcon, MinimizeIcon, PauseIcon, PencilIcon, PlayIcon, RotateCcwIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";

type IconButtonClick = React.MouseEventHandler<HTMLButtonElement>;

interface EditIconButtonProps {
    onClick: IconButtonClick;
}
export function EditIconButton({ onClick }: EditIconButtonProps) {
    return (
        <Button
            variant={"ghost"}
            size={"sm"}
            className="hover:text-primary!"
            onClick={onClick}
        >
            <PencilIcon
                fill="currentColor"
                strokeWidth={2}
                className="stroke-accent"
            />
        </Button>
    )
}

interface DeleteIconButtonProps {
    onClick: IconButtonClick;
}
export function DeleteIconButton({ onClick }: DeleteIconButtonProps) {
    return (
        <Button
            variant={"ghost"}
            size={"sm"}
            className="hover:text-destructive!"
            onClick={onClick}
        >
            <TrashIcon />
        </Button>
    )
}

interface PlayPauseIconButtonProps {
    onClick: () => void;
    isPaused: boolean;
}
export function PlayPauseIconButton({ onClick, isPaused }: PlayPauseIconButtonProps) {
    const PlayPauseIcon = isPaused ? PlayIcon : PauseIcon;
    return (
        <Button
            variant={"ghost"}
            size={"sm"}
            className="hover:text-primary!"
            onClick={onClick}
        >
            <PlayPauseIcon className="size-4" strokeWidth={1.5} />
        </Button>
    )
}


interface FullScreenIconButtonProps {
  isFullscreen: boolean;
  onClick: () => void;
}

export function FullScreenIconButton({
  isFullscreen,
  onClick,
}: FullScreenIconButtonProps) {
  return (
    <Button variant="ghost" onClick={onClick}>
      {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
    </Button>
  );
}

interface ResetIconButtonProps {
  onClick: () => void;
}

export function ResetIconButton({ onClick }: ResetIconButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
    >
      <RotateCcwIcon className="size-4" strokeWidth={1.5} />
    </Button>
  );
}
