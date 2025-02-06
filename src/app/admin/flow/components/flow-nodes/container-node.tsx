import { memo, useRef, useState } from 'react';
import { Handle, Position, NodeProps, Node } from 'reactflow';
import { CustomNodeData } from '../../types/index';
import { Card } from "@/components/ui/card";
import { DropIndicator } from '../flow-drop-indicator';
import { useDroppable } from '@dnd-kit/core';
import { nodeTypes } from '../flow-nodeTypes';

const nodeStyles = {
  background: 'none',
  border: 'none',
  padding: 0,
  borderRadius: 0,
  width: 'fit-content',
  boxShadow: 'none'
};

function ContainerNode({ id, data, selected }: NodeProps<CustomNodeData>) {
  const [dropTarget, setDropTarget] = useState<{ type: 'top' | 'bottom' | 'middle' | 'between', index?: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const childrenRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${id}`,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isOver) {
      setDropTarget(null);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const { top, height } = container.getBoundingClientRect();
    const relativeY = e.clientY - top;
    const threshold = height * 0.15;

    if (relativeY < threshold) {
      setDropTarget({ type: 'top' });
      return;
    }
    if (relativeY > height - threshold) {
      setDropTarget({ type: 'bottom' });
      return;
    }

    if (data.children && data.children.length > 0) {
      for (let i = 0; i < childrenRefs.current.length; i++) {
        const childNode = childrenRefs.current[i];
        if (!childNode) continue;

        const { top: childTop, height: childHeight } = childNode.getBoundingClientRect();
        const childCenter = childTop + childHeight / 2;

        if (e.clientY < childCenter) {
          setDropTarget({ type: 'between', index: i });
          return;
        }
      }
      setDropTarget({ type: 'between', index: childrenRefs.current.length });
    } else {
      setDropTarget({ type: 'middle' });
    }
  };

  const handleMouseLeave = () => {
    setDropTarget(null);
  };

  const renderChild = (child: Node<CustomNodeData>, index: number) => {
    if (!child) return null;
    
    const nodeType = child.type ?? 'divNode';
    const NodeType = nodeTypes[nodeType];
    
    return (
      <div 
        key={child.id} 
        ref={el => childrenRefs.current[index] = el} 
        className="relative" 
        data-child-index={index}
      >
        <DropIndicator 
          isVisible={isOver && dropTarget?.type === 'between' && dropTarget.index === index}
          isTop
        />
        <NodeType
          id={child.id}
          type={nodeType}
          data={child.data}
          selected={!!child.selected}
          dragging={false}
          zIndex={0}
          isConnectable={false}
          xPos={0}
          yPos={0}
        />
      </div>
    );
  };

  return (
    <div style={nodeStyles}>
      <Card 
        ref={containerRef}
        className={`min-w-[300px] min-h-[100px] relative ${selected ? 'ring-2 ring-primary' : ''} ${
          isOver ? 'bg-muted/5' : ''
        }`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!border-0 !bg-muted-foreground/20 hover:!bg-muted-foreground/40 transition-colors"
          style={{ width: 8, height: 8 }}
        />
        
        <div ref={setNodeRef} className="relative h-full">
          <DropIndicator isTop isVisible={isOver && dropTarget?.type === 'top'} />
          
          <div className={`min-h-[100px] flex flex-col gap-4 p-4 transition-colors ${
            isOver && dropTarget?.type === 'middle' ? 'bg-muted/20 ring-2 ring-primary/20' : ''
          }`}>
            {data.children && data.children.length > 0 ? (
              data.children.map((child, index) => renderChild(child, index))
            ) : (
              <div className={`text-sm text-muted-foreground text-center border-2 border-dashed transition-colors ${
                isOver ? 'border-primary/50 bg-muted/10' : 'border-muted-foreground/20'
              } rounded-lg p-4`}>
                Drop nodes here
              </div>
            )}
            {data.children && data.children.length > 0 && (
              <DropIndicator 
                isVisible={isOver && dropTarget?.type === 'between' && dropTarget.index === data.children.length}
                isTop
              />
            )}
          </div>

          <DropIndicator isVisible={isOver && dropTarget?.type === 'bottom'} />
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!border-0 !bg-muted-foreground/20 hover:!bg-muted-foreground/40 transition-colors"
          style={{ width: 8, height: 8 }}
        />
      </Card>
    </div>
  );
}

ContainerNode.displayName = 'ContainerNode';

export default memo(ContainerNode); 