import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AgentForm } from "@/components/agent-form"

interface AgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: any
  onSubmit: (data: any) => void
  isEdit?: boolean
}

export function AgentDialog({ 
  open, 
  onOpenChange, 
  initialData, 
  onSubmit,
  isEdit = false 
}: AgentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Agent" : "Create New Agent"}</DialogTitle>
        </DialogHeader>
        <AgentForm
          initialData={initialData}
          onSubmit={(data) => {
            onSubmit(data)
            onOpenChange(false)
          }}
          onCancel={() => onOpenChange(false)}
          isEdit={isEdit}
        />
      </DialogContent>
    </Dialog>
  )
} 