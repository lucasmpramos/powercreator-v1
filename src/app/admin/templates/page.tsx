import { useState } from "react"
import PageTemplate from "@/components/page-template"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Plus, Pencil, Trash2, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Template {
  id: string
  name: string
  description: string
  category: {
    name: string
    color: string
  }
  updatedAt: string
}

const templates: Template[] = [
  {
    id: "1",
    name: "Professional Tone",
    description: "Formal and professional writing style",
    category: {
      name: "Tone of Voice",
      color: "blue"
    },
    updatedAt: "2024-01-31"
  },
  {
    id: "2",
    name: "Global Rules",
    description: "Base rules for all agents",
    category: {
      name: "Global Rules",
      color: "green"
    },
    updatedAt: "2024-01-30"
  }
]

export default function TemplatesPage() {
  return (
    <PageTemplate
      layout="fullLeft"
      breadcrumbItems={[{ title: "Templates" }]}
    >
      <div className="flex flex-1 flex-col gap-4 p-0 pt-0">
        <div className="flex items-center justify-between mb-8">
          <PageHeader
            heading="Templates"
            description="Create and manage reusable templates for your agents"
          />
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Template
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Badge variant="outline" className={`bg-${template.category.color}-50 mb-2`}>
                    {template.category.name}
                  </Badge>
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Updated {new Date(template.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageTemplate>
  )
} 