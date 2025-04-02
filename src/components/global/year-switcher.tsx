"use client"
import { ChevronDown, Plus, Pencil, Trash2 } from "lucide-react"
import { useAuth } from "@clerk/nextjs"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"

import { Button } from "../ui/button"
import { useYear } from "../context/YearContext"
import { useModal } from "@/hooks/use-modal-store"


export function YearSwitcher() {
  const { currentYear, changeYear,years } = useYear()
  const { onOpen } = useModal()
  const { isSignedIn } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-fit px-3 min-w-28 flex items-center justify-between gap-2">
          <span className="truncate font-semibold">{currentYear?.fiscalYear || "Select Year"}</span>
          <ChevronDown className="size-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 rounded-lg" align="start" side="bottom" sideOffset={4}>
        <DropdownMenuLabel className="text-xs text-muted-foreground">Available Years</DropdownMenuLabel>

        {years.length > 0 ? (
          <DropdownMenuGroup>
            {years.map((year, index) => (
              <div key={year.id} className="relative group">
                <DropdownMenuItem 
                  onClick={() => changeYear(year.id)} 
                  className="gap-2 p-2 pr-10"
                >
                  {year.fiscalYear}
                  <DropdownMenuShortcut className="group-hover:hidden">⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
                
                {isSignedIn && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-muted"
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpen("editYear", { year })
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-muted hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpen("deleteYear", { year })
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuItem disabled className="gap-2 p-2 opacity-50">
            No years available
          </DropdownMenuItem>
        )}

        {isSignedIn && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="gap-2 p-2" 
              onClick={() => onOpen("createYear")}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add New Year</div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}