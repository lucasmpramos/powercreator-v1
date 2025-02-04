"use client"

import * as React from "react"
import {
  CaretSortIcon,
  CheckIcon,
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Dialog } from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

export default function TeamSwitcher({ className }: PopoverTriggerProps) {
  const [open, setOpen] = React.useState(false)
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarFallback className="bg-orange-600">P</AvatarFallback>
            </Avatar>
            <span className="truncate">Powercreator</span>
            <span className="ml-auto text-xs text-muted-foreground">
              Master Admin
            </span>
            <CaretSortIcon className="ml-3 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup heading="Teams">
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                  }}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarFallback className="bg-orange-600">P</AvatarFallback>
                  </Avatar>
                  Powercreator
                  <CheckIcon className="ml-auto h-4 w-4 opacity-50" />
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Dialog>
  )
}
