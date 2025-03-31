"use client"
import { ChevronDown, Plus } from "lucide-react"
import { useAuth } from "@clerk/nextjs"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "../ui/button"
import { useYear } from "../context/YearContext"
import { useModal } from "@/hooks/use-modal-store"
import type { YearWithPages } from "../context/YearContext"

interface YearSwitcherProps {
  years: YearWithPages[]
}

export function YearSwitcher({ years }: YearSwitcherProps) {
  const { currentYear, changeYear } = useYear()
  const { onOpen } = useModal()
  const { isSignedIn } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-fit px-3 min-w-28 flex items-center justify-between gap-2 ">
          <span className="truncate font-semibold">{currentYear?.fiscalYear || "Select Year"}</span>
          <ChevronDown className="size-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 rounded-lg " align="start" side="bottom" sideOffset={4}>
        <DropdownMenuLabel className="text-xs text-muted-foreground">Available Years</DropdownMenuLabel>

        {years.length > 0 ? (
          years.map((year, index) => (
            <DropdownMenuItem key={year.id} onClick={() => changeYear(year)} className="gap-2 p-2">
              {year.fiscalYear}
              <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled className="gap-2 p-2 opacity-50">
            No years available
          </DropdownMenuItem>
        )}

        {isSignedIn && (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="gap-2 p-2" onClick={() => onOpen("createYear")}>
        <div className="flex size-6 items-center justify-center rounded-md border bg-background">
          <Plus className="size-4" />
        </div>
        <div className="font-medium text-muted-foreground">Add Year</div>
      </DropdownMenuItem>
    </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

