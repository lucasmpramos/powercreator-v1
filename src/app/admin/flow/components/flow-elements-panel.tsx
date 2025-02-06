import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FlowElement } from "../types/index";
import { FlowDraggable } from "./flow-draggable";

interface FlowElementsPanelProps {
  elements: FlowElement[];
}

export function FlowElementsPanel({ elements }: FlowElementsPanelProps) {
  return (
    <Card className="h-full rounded-none border-0">
      <div className="flex flex-col h-full">
        <div className="flex-none p-4 pb-2">
          <h3 className="font-medium">Flow Elements</h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4">
            <div className="grid gap-3">
              {elements.map((element) => (
                <div 
                  key={element.type}
                  className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <FlowDraggable element={element} />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
} 