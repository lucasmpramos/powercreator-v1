import { useState } from "react"
import PageTemplate from "@/components/page-template"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Plus, Pencil, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  description: string
  templatesCount: number
  color: string
}

const categories: Category[] = [
  {
    id: "1",
    name: "Writing Style",
    description: "Templates for content tone and writing patterns",
    templatesCount: 5,
    color: "category-style"
  },
  {
    id: "2",
    name: "Content Rules",
    description: "Base rules for content generation",
    templatesCount: 3,
    color: "category-content"
  },
  {
    id: "3",
    name: "Output Format",
    description: "Content structure and formatting guidelines",
    templatesCount: 4,
    color: "category-format"
  },
  {
    id: "4",
    name: "Industry Knowledge",
    description: "Industry-specific content guidelines",
    templatesCount: 6,
    color: "category-knowledge"
  },
  {
    id: "5",
    name: "System Rules",
    description: "Core system behavior and fallback patterns",
    templatesCount: 2,
    color: "category-system"
  }
]

export default function CategoriesPage() {
  return (
    <PageTemplate
      layout="fullLeft"
      breadcrumbItems={[{ title: "Categories" }]}
    >
      <div className="flex flex-1 flex-col gap-4 p-0 pt-0">
        <div className="flex items-center justify-between mb-8">
          <PageHeader
            heading="Template Categories"
            description="Organize your templates into categories"
          />
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Category
          </Button>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Templates</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "hover:bg-secondary/80",
                          category.color === "category-content" && "bg-category-content/10 text-category-content hover:bg-category-content/20",
                          category.color === "category-format" && "bg-category-format/10 text-category-format hover:bg-category-format/20",
                          category.color === "category-style" && "bg-category-style/10 text-category-style hover:bg-category-style/20",
                          category.color === "category-knowledge" && "bg-category-knowledge/10 text-category-knowledge hover:bg-category-knowledge/20",
                          category.color === "category-system" && "bg-category-system/10 text-category-system hover:bg-category-system/20"
                        )}
                      >
                        {category.name}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.templatesCount}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </PageTemplate>
  )
} 