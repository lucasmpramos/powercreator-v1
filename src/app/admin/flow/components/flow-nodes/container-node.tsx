import { memo, useRef, useState } from 'react';
import { Handle, Position, Node, NodeProps } from 'reactflow';
import type { CustomNodeData } from '../../types';
import { Card } from "@/components/ui/card";
import { DropIndicator } from '../flow-drop-indicator';
import { useDroppable } from '@dnd-kit/core';
import { nodeTypes } from '../flow-nodeTypes';

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
    } else if (relativeY > height - threshold) {
      setDropTarget({ type: 'bottom' });
    } else if (data.children && data.children.length > 0) {
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

  const {
    width = '300px',
    minHeight = '150px',
    backgroundColor = 'white',
    padding = '4',
    gap = '4',
  } = data.properties;

  return (
    <div className="react-flow__node-default nodrag" style={{ pointerEvents: 'none' }}>
      <Handle
        type="target"
        position={Position.Top}
        className="!border-0 !bg-muted-foreground/20 hover:!bg-muted-foreground/40 transition-colors"
        style={{ pointerEvents: 'all' }}
      />
      
      <Card 
        ref={containerRef}
        className={`relative bg-background ${selected ? 'ring-2 ring-primary' : 'border shadow-sm'}`}
        style={{
          width,
          minHeight,
          backgroundColor,
          padding: `${padding}px`,
          pointerEvents: 'all'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          ref={setNodeRef} 
          className="relative h-full"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: `${gap}px`,
          }}
        >
          <DropIndicator isTop isVisible={isOver && dropTarget?.type === 'top'} />
          
          <div className={`flex-1 min-h-[100px] flex flex-col gap-2 transition-colors ${
            isOver && dropTarget?.type === 'middle' ? 'bg-muted/20 ring-2 ring-primary/20' : ''
          }`}
          style={{ pointerEvents: 'all' }}
          >
            {data.children && data.children.length > 0 ? (
              <>
                {data.children.map((child: Node<CustomNodeData>, index) => {
                  if (!child.type || !nodeTypes[child.type]) return null;
                  const NodeType = nodeTypes[child.type];

                  return (
                    <div 
                      key={child.id} 
                      ref={el => childrenRefs.current[index] = el} 
                      className="relative w-full" 
                      data-child-index={index}
                      data-nodeid={child.id}
                      style={{ pointerEvents: 'all' }}
                    >
                      <DropIndicator 
                        isVisible={isOver && dropTarget?.type === 'between' && dropTarget.index === index}
                        isTop
                      />
                      <div className="w-full" style={{ pointerEvents: 'all' }}>
                        <NodeType
                          id={child.id}
                          type={child.type}
                          data={child.data}
                          selected={child.selected ?? false}
                          isConnectable={false}
                          xPos={child.position.x}
                          yPos={child.position.y}
                          zIndex={0}
                          dragging={false}
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className={`text-sm text-muted-foreground text-center border-2 border-dashed transition-colors ${
                isOver ? 'border-primary/50 bg-muted/10' : 'border-muted-foreground/20'
              } rounded-lg p-4`}>
                Drop elements here
              </div>
            )}
          </div>

          <DropIndicator isVisible={isOver && dropTarget?.type === 'bottom'} />
        </div>

        {/* Resize handles */}
        <div className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-primary/20 nodrag" style={{ pointerEvents: 'all' }} />
        <div className="absolute left-0 right-0 bottom-0 h-1 cursor-ns-resize hover:bg-primary/20 nodrag" style={{ pointerEvents: 'all' }} />
        <div className="absolute right-0 bottom-0 w-2 h-2 cursor-se-resize hover:bg-primary/20 nodrag" style={{ pointerEvents: 'all' }} />
      </Card>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!border-0 !bg-muted-foreground/20 hover:!bg-muted-foreground/40 transition-colors"
        style={{ pointerEvents: 'all' }}
      />
    </div>
  );
}

ContainerNode.displayName = 'ContainerNode';

export default memo(ContainerNode); 