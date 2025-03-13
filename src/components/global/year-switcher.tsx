"use client";

import * as React from "react";
import { ChevronDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useYear } from "../context/YearContext";
import { useModal } from "@/hooks/use-modal-store";

export function YearSwitcher() {
  const { currentYear, changeYear } = useYear();
  const { onOpen } = useModal();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-fit px-3 min-w-28 flex items-center justify-between gap-2">
          <span className="truncate font-semibold">
            {currentYear?.fiscalYear || "Select Year"} {/* Graceful fallback */}
          </span>
          <ChevronDown className="size-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 rounded-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Available Years
        </DropdownMenuLabel>

        {/* {years.map((year, index) => (
          <DropdownMenuItem
            key={year.id} 
            onClick={() => changeYear(year)}
            className="gap-2 p-2"
          >
            {year.fiscalYear}
            <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
          </DropdownMenuItem>
        ))} */}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2 p-2"  onClick={() => onOpen("createYear")}>
          <div className="flex size-6 items-center justify-center rounded-md border bg-background">
            <Plus className="size-4" />
          </div>
          <div className="font-medium text-muted-foreground">Add Year</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
