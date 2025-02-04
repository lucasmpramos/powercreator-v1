import { useState } from "react"
import PageTemplate from "@/components/page-template"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Plus, Pencil, Trash2, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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
    name: "Business Writing",
    description: "Professional business content style",
    category: {
      name: "Writing Style",
      color: "category-style"
    },
    updatedAt: "2024-03-15"
  },
  {
    id: "2",
    name: "Content Guidelines",
    description: "Core content creation rules",
    category: {
      name: "Content Rules",
      color: "category-content"
    },
    updatedAt: "2024-03-14"
  },
  {
    id: "3",
    name: "Blog Structure",
    description: "Blog post formatting template",
    category: {
      name: "Output Format",
      color: "category-format"
    },
    updatedAt: "2024-03-13"
  },
  {
    id: "4",
    name: "Tech Industry",
    description: "Technology sector content guidelines",
    category: {
      name: "Industry Knowledge",
      color: "category-knowledge"
    },
    updatedAt: "2024-03-12"
  },
  {
    id: "5",
    name: "Content Recovery",
    description: "Handle incomplete or invalid content",
    category: {
      name: "System Rules",
      color: "category-system"
    },
    updatedAt: "2024-03-11"
  },
  {
    id: "6",
    name: "Conversational",
    description: "Friendly blog writing style",
    category: {
      name: "Writing Style",
      color: "category-style"
    },
    updatedAt: "2024-03-10"
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
                  <Badge 
                    variant="secondary"
                    className={cn(
                      "hover:bg-secondary/80",
                      template.category.color === "category-content" && "bg-category-content/10 text-category-content hover:bg-category-content/20",
                      template.category.color === "category-format" && "bg-category-format/10 text-category-format hover:bg-category-format/20",
                      template.category.color === "category-style" && "bg-category-style/10 text-category-style hover:bg-category-style/20",
                      template.category.color === "category-knowledge" && "bg-category-knowledge/10 text-category-knowledge hover:bg-category-knowledge/20",
                      template.category.color === "category-system" && "bg-category-system/10 text-category-system hover:bg-category-system/20"
                    )}
                  >
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