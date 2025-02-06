import { useDroppable } from '@dnd-kit/core';

interface FlowDroppableProps {
  id: string;
  children: React.ReactNode;
}

export function FlowDroppable({ id, children }: FlowDroppableProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${id}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[100px] flex flex-col gap-4 p-4 transition-colors ${
        isOver ? 'bg-muted/50' : ''
      }`}
      style={{
        cursor: isOver ? 'move' : 'default',
      }}
    >
      {children}
    </div>
  );
} 