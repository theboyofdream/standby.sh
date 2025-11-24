import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckIcon, PencilIcon, TrashIcon } from "lucide-react";
import type { JSX } from "react";

type FooterCardProps = Readonly<{
  isChecked?: boolean;
  label: string;
  description: string;
  timerComponent: JSX.Element;
  caption?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}>;

function FooterCard(props: FooterCardProps) {
  return (
    <Card
      onClick={props.onClick}
      className={"bg-accent dark:bg-card aspect-video group cursor-pointer"}
    >
      <CardContent>
        <div className="flex justify-between">
          <p className="text-xl h-6">{props.label}</p>
          {props.isChecked && <CheckIcon className="size-4" />}
        </div>
        <p className="text-muted-foreground">{props.description}</p>
        <p className="text-3xl text-muted-foreground">{props.timerComponent}</p>
      </CardContent>
      <CardFooter className="flex">
        <span className="flex-1 text-muted-foreground">{props.caption}</span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {props.onEdit && (
            <Button
              variant={"ghost"}
              size={"sm"}
              className="hover:text-primary!"
              onClick={props.onEdit}
            >
              <PencilIcon
                fill="currentColor"
                strokeWidth={2}
                className="stroke-accent"
              />
            </Button>
          )}
          {props.onDelete && (
            <Button
              variant={"ghost"}
              size={"sm"}
              className="hover:text-destructive!"
              onClick={props.onDelete}
            >
              <TrashIcon />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export { FooterCard };

