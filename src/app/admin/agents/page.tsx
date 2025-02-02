import PageTemplate from "@/components/page-template"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Plus, Copy, Trash2 } from "lucide-react"

interface Agent {
  id: string
  name: string
  model: string
  description: string
  createdAt: string
}

const agents: Agent[] = [
  {
    id: "1",
    name: "Test123",
    model: "GPT-4e",
    description: "Create High Engaging Tests",
    createdAt: "Jan 31, 2025"
  },
  {
    id: "2",
    name: "AgentX",
    model: "GPT-4e Mini",
    description: "adsasdasd",
    createdAt: "Jan 31, 2025"
  },
  {
    id: "3",
    name: "Tabeleiro",
    model: "GPT-4e",
    description: "Criador de tabelas de opções",
    createdAt: "Jan 31, 2025"
  }
]

export default function AgentsPage() {
  return (
    <PageTemplate layout="fullLeft">
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between mb-8">
          <PageHeader
            heading="AI Agents"
            description="Create and manage your AI agents for content generation"
          />
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Agent
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.id} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{agent.model}</span>
                <span className="text-muted-foreground">Created {agent.createdAt}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageTemplate>
  )
} 