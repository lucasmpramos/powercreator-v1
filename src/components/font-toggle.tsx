import * as React from "react"
import { Type } from "lucide-react"
import { useFont } from "@/components/font-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { Check } from "lucide-react"

export function FontToggle() {
  const { font, setFont } = useFont()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="sm">
          <Type className="h-4 w-4" />
          <span>Font</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[180px]">
        <DropdownMenuItem onClick={() => setFont("system")}>
          <span>System Font</span>
          {font === "system" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFont("instrument")}>
          <span>Instrument Sans</span>
          {font === "instrument" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 