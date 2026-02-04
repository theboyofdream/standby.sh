import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface AddActionCardProps {
    description: string;
    actionLabel: string;
    onClick: () => void;
}
export function AddActionCard({ description, actionLabel, onClick }: AddActionCardProps) {
    return (
        <Card className="bg-accent dark:bg-card min-h-44">
            <CardContent className="flex flex-col justify-center items-center h-full gap-3">
                <span className="text-muted-foreground">
                    {description}
                </span>
                <Button
                    variant={"ghost"}
                    size={"lg"}
                    onClick={onClick}
                >
                    <PlusIcon></PlusIcon>
                    <span>{actionLabel}</span>
                </Button>
            </CardContent>
        </Card>
    )
}
