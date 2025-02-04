import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

interface AgentFormProps {
  initialData?: {
    id?: string
    name: string
    description: string
    model: string
    isPublic?: boolean
    systemPrompt?: string
  }
  onSubmit: (data: any) => void
  onCancel: () => void
  isEdit?: boolean
}

export function AgentForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isEdit = false 
}: AgentFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    model: initialData?.model || "gpt-4",
    isPublic: initialData?.isPublic || false,
    systemPrompt: initialData?.systemPrompt || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <p className="text-sm text-muted-foreground">
          Configure your AI agent's basic settings
        </p>
        <Separator className="my-4" />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Content Writer Pro"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this agent does..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model">Model</Label>
            <Select
              value={formData.model}
              onValueChange={(value) => setFormData({ ...formData, model: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium">Advanced Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure advanced agent settings and behavior
        </p>
        <Separator className="my-4" />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="systemPrompt">System Prompt</Label>
            <Textarea
              id="systemPrompt"
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              placeholder="Enter the system prompt..."
              className="min-h-[100px]"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Public Agent</Label>
              <p className="text-sm text-muted-foreground">
                Make this agent available to other team members
              </p>
            </div>
            <Switch
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? "Update Agent" : "Create Agent"}
        </Button>
      </div>
    </form>
  )
} 