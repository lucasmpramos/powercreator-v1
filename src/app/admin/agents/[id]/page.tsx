import { useParams, useNavigate } from "react-router-dom"
import PageTemplate from "@/components/page-template"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { ArrowLeft } from "lucide-react"
import { AgentForm } from "@/components/agent-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

interface Agent {
  id?: string;
  name: string;
  description: string;
  settings: Record<string, unknown>;
}

export default function AgentDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === "new"

  const handleSubmit = (_data: Agent) => {
    // TODO: Implement save logic using data
    navigate("/admin/agents")
  }

  return (
    <PageTemplate
      layout="fullLeft"
      breadcrumbItems={[
        { title: "Agents", href: "/admin/agents" },
        { title: isNew ? "New Agent" : "Edit Agent" }
      ]}
    >
      <div className="flex flex-1 flex-col gap-4 p-0 pt-0">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/admin/agents")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <PageHeader
              heading={isNew ? "Create New Agent" : "Edit Agent"}
              description={isNew 
                ? "Configure your new AI agent" 
                : "Modify your existing AI agent"}
            />
          </div>
        </div>

        <Tabs defaultValue="settings" className="flex-1">
          <TabsList>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="mt-4">
            <AgentForm
             // initialData={null} // Load agent data here
              onSubmit={handleSubmit}
              onCancel={() => navigate("/admin/agents")}
              isEdit={!isNew}
            />
          </TabsContent>

          <TabsContent value="testing" className="mt-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Test Your Agent</h3>
              {/* Add chat interface for testing */}
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Chat History</h3>
              {/* Add history list */}
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Performance Analytics</h3>
              {/* Add analytics charts */}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTemplate>
  )
} 