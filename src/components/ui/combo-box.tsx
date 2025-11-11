import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { ScrollArea } from "./scroll-area";

type ComboboxType = {
  data: { label: string; value: string }[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder: string;
  searchPlaceholder?: string;
  emptyPlaceholderText?: string;
  className?: string;
};

export function ComboBox({
  data,
  defaultValue,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyPlaceholderText,
  className,
}: ComboboxType) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  function handleChange(value: string) {
    setSelectedValue(value);
    onValueChange?.(value);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-sm justify-between", className)}
        >
          {selectedValue
            ? data.find((d) => d.value === selectedValue)?.label
            : placeholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-84 p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyPlaceholderText}</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="max-h-60">
                {data.map((d) => (
                  <CommandItem
                    key={d.value}
                    value={d.value}
                    onSelect={(currentValue) => {
                      handleChange(
                        currentValue === selectedValue ? "" : currentValue,
                      );
                      setOpen(false);
                    }}
                  >
                    {d.label}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
