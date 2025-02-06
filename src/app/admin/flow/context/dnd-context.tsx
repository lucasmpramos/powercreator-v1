import { DndContext, DragEndEvent, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { FlowElement } from '../types';

interface FlowDndContextProps {
  children: React.ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export function FlowDndProvider({ children, onDragStart, onDragEnd }: FlowDndContextProps) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, // 10px movement before drag starts
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250, // 250ms delay before touch drag starts
      tolerance: 5, // 5px movement tolerance
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToWindowEdges]}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {children}
    </DndContext>
  );
}

// Custom type guard to check if dragged item is a flow element
export function isFlowElement(item: unknown): item is FlowElement {
  return (
    typeof item === 'object' &&
    item !== null &&
    'type' in item &&
    'label' in item &&
    typeof (item as FlowElement).type === 'string' &&
    typeof (item as FlowElement).label === 'string'
  );
} 