import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormElement } from "../types";

interface FlowElementsPanelProps {
  elements: FormElement[];
  onDragStart: (event: React.DragEvent<HTMLButtonElement>, element: FormElement) => void;
}

export function FlowElementsPanel({ elements, onDragStart }: FlowElementsPanelProps) {
  return (
    <Card className="h-full rounded-none border-0">
      <div className="flex flex-col h-full">
        <div className="flex-none p-4 pb-2">
          <h3 className="font-medium">Flow Elements</h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-4 pb-4">
            <div className="grid gap-2">
              {elements.map((element) => {
                const Icon = element.icon;
                return (
                  <Button
                    key={element.type}
                    variant="outline"
                    className="justify-start"
                    draggable
                    onDragStart={(e) => onDragStart(e, element)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {element.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
} 