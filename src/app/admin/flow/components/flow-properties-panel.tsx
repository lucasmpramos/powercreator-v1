import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Node } from 'reactflow';
import { Textarea } from "@/components/ui/textarea";

type CustomNodeData = {
  label: string;
  content?: string;
  draggable: boolean;
  connectable: boolean;
  elementType: string;
  properties: {
    title?: string;
    text?: string;
    width?: 'full' | 'half' | 'third';
    padding?: 'small' | 'medium' | 'large';
    margin?: 'small' | 'medium' | 'large';
    variant?: 'default' | 'destructive' | 'outline';
    isContainer?: boolean;
    placeholder?: string;
    helpText?: string;
    required?: boolean;
    validation?: string;
    alignment?: 'left' | 'center' | 'right';
    options?: { label: string; value: string }[];
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    [key: string]: string | number | boolean | undefined | { label: string; value: string }[];
  };
}

interface FlowPropertiesPanelProps {
  field: Node<CustomNodeData> | null;
  onUpdate: (updates: Node<CustomNodeData>) => void;
}

export default function FlowPropertiesPanel({ field, onUpdate }: FlowPropertiesPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!field || !field.data) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Select a node to edit its properties
      </div>
    );
  }

  const handleUpdate = (updates: Partial<CustomNodeData>) => {
    onUpdate({
      ...field,
      data: {
        ...field.data,
        ...updates,
        properties: {
          ...field.data.properties,
          ...(updates.properties ?? {}),
        }
      }
    });
  };

  const handleContentChange = (value: string) => {
    handleUpdate({
      content: value,
      properties: {
        text: value,
      }
    });
  };

  const handleLabelChange = (value: string) => {
    handleUpdate({
      label: value,
      properties: {
        title: value,
      }
    });
  };

  const labelId = `${field.id}-label-input`;
  const contentId = `${field.id}-content-input`;
  const draggableId = `${field.id}-draggable-switch`;
  const connectableId = `${field.id}-connectable-switch`;

  return (
    <div className="space-y-4 p-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <h3 className="text-sm font-semibold">Node Properties</h3>
          <ChevronDown className={`h-4 w-4 transform ${isOpen ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4">
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor={labelId}>Label</Label>
              <Input 
                id={labelId}
                name={labelId}
                value={field.data.properties?.title ?? field.data.label ?? ''}
                onChange={(e) => handleLabelChange(e.target.value)}
                className="nodrag"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={contentId}>Content</Label>
              <Textarea 
                id={contentId}
                name={contentId}
                value={field.data.properties?.text ?? field.data.content ?? ''}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Enter node content..."
                className="min-h-[100px] nodrag"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor={draggableId}>Draggable</Label>
              <Switch 
                id={draggableId}
                name={draggableId}
                checked={field.draggable !== false}
                onCheckedChange={(checked) => {
                  onUpdate({
                    ...field,
                    draggable: checked,
                    data: {
                      ...field.data,
                      draggable: checked
                    }
                  });
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor={connectableId}>Connectable</Label>
              <Switch 
                id={connectableId}
                name={connectableId}
                checked={field.data.connectable !== false}
                onCheckedChange={(checked) => handleUpdate({ connectable: checked })}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
} 