import { AppSidebar } from "@/components/app-sidebar"
import { AdminBreadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { FileText, Plus, Sparkles, Zap } from "lucide-react"

interface RecentContent {
  title: string
  agent: string
  createdAt: string
}

const recentContent: RecentContent[] = [
  {
    title: "Product Launch Email Sequence",
    agent: "Marketing GPT",
    createdAt: "2 hours ago"
  },
  {
    title: "Social Media Campaign Copy",
    agent: "Social Media Assistant",
    createdAt: "5 hours ago"
  },
  {
    title: "Blog Post: AI Trends 2024",
    agent: "Content Writer Pro",
    createdAt: "1 day ago"
  }
]

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <AdminBreadcrumb items={[]} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">
                Overview of your content generation activities
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Total Agents</h3>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">8</div>
            </Card>
            <Card className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Templates</h3>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">5</div>
            </Card>
            <Card className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Generated Today</h3>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Total tokens used today</p>
            </Card>
            <Card className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Cost Today</h3>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">$0.00</div>
              <p className="text-xs text-muted-foreground">Estimated cost for today</p>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Content */}
            <Card className="col-span-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Recent Content</h3>
              </div>
              <div className="space-y-4">
                {recentContent.map((content) => (
                  <div
                    key={content.title}
                    className="flex items-start justify-between border-b pb-4 last:border-none last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{content.title}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {content.agent}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {content.createdAt}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="col-span-3 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Quick Actions</h3>
              </div>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Agent
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Try Playground
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 