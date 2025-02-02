import { Bot, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import PageTemplate from "@/components/page-template"

const agents = [
  {
    id: "test123",
    name: "Test123",
    description: "Create High Engaging Tests",
  },
  {
    id: "agentx",
    name: "AgentX",
    description: "General Purpose Assistant",
  },
  {
    id: "tabeleiro",
    name: "Tabeleiro",
    description: "Table Creation Specialist",
  },
]

const recentAgents = agents.slice(0, 3) // Limit to 3 recent agents

export default function PlaygroundPage() {
  const [open, setOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<string>()

  return (
    <PageTemplate layout="centered">
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between mb-8">
          <PageHeader
            heading="Chat Playground"
            description="Get started by selecting an existing agent or create a new one"
          />
        </div>

        <div className="grid w-full max-w-4xl gap-6 px-4 md:grid-cols-2">
          {/* Agent Selection Card */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Select an Agent</h2>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedAgent
                    ? agents.find((agent) => agent.id === selectedAgent)?.name
                    : "Search agents..."}
                  <Bot className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search agents..." />
                  <CommandEmpty>No agent found.</CommandEmpty>
                  <CommandGroup>
                    {agents.map((agent) => (
                      <CommandItem
                        key={agent.id}
                        value={agent.id}
                        onSelect={(currentValue) => {
                          setSelectedAgent(
                            currentValue === selectedAgent ? undefined : currentValue
                          )
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedAgent === agent.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{agent.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {agent.description}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {recentAgents.length > 0 && (
              <>
                <div className="my-4 flex items-center">
                  <div className="flex-grow border-t" />
                  <span className="mx-4 text-sm text-muted-foreground">Recent</span>
                  <div className="flex-grow border-t" />
                </div>

                <div className="space-y-2">
                  {recentAgents.map((agent) => (
                    <Button
                      key={agent.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setSelectedAgent(agent.id)}
                    >
                      <Bot className="mr-2 h-4 w-4" />
                      <div className="flex flex-col items-start">
                        <span>{agent.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {agent.description}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </>
            )}
          </Card>

          {/* Create New Agent Card */}
          <Card className="flex flex-col items-center justify-center p-6">
            <div className="text-center">
              <div className="mb-4 rounded-full bg-muted p-3 inline-block">
                <Plus className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold">Create New Agent</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Build a custom AI agent from scratch
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Agent
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageTemplate>
  )
} 