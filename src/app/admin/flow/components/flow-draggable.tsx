import { useDraggable } from '@dnd-kit/core';
import { Button } from "@/components/ui/button";
import { FlowElement } from "../types";

interface FlowDraggableProps {
  element: FlowElement;
}

export function FlowDraggable({ element }: FlowDraggableProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `flow-element-${element.type}`,
    data: element
  });

  const Icon = element.icon;

  return (
    <Button
      ref={setNodeRef}
      variant="outline"
      className={`justify-start w-full cursor-grab hover:cursor-grab active:cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
      {...listeners}
      {...attributes}
    >
      <Icon className="mr-2 h-4 w-4" />
      {element.label}
    </Button>
  );
} 