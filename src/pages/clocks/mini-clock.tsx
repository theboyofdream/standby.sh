import { DeleteIconButton, EditIconButton } from "@/components/icon-buttons"
import { getUtcOffset } from "@/lib/utils"
import { CheckIcon } from "lucide-react"
import { Card, CardContent, CardFooter } from "../../components/ui/card"
import { ClockText } from "./clock-text"

interface MiniClockProps {
    id: string,
    label: string,
    timezone: string,
    isActive: boolean,
    onClick: (id: string) => void
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}
export function MiniClock({ id, label, timezone, isActive, onClick, onEdit, onDelete }: MiniClockProps) {
    return (
        <Card
            key={id}
            onClick={() => onClick(id)}
            className="bg-accent dark:bg-card aspect-video group cursor-pointer"
        >
            <CardContent className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <p className="text-xl h-6">{label}</p>
                    {isActive && <CheckIcon className="size-4" />}
                </div>
                <p className="text-muted-foreground text-sm">{timezone}</p>
                <p className="text-3xl text-muted-foreground">
                    <ClockText timezone={timezone} />
                </p>
            </CardContent>
            <CardFooter className="flex">
                <span className="flex-1 text-muted-foreground">
                    {getUtcOffset(timezone)}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <EditIconButton onClick={() => onEdit(id)} />
                    <DeleteIconButton onClick={() => onDelete(id)} />
                </div>
            </CardFooter>
        </Card>
    )
}
