import { memo } from 'react';
import { Handle, Position, NodeProps, Node } from 'reactflow';
import { CustomNodeData, FlowElement } from '../../types/index';
import { Card } from "@/components/ui/card";
import divNode from './base-node';

const nodeStyles = {
  background: 'none',
  border: 'none',
  padding: 0,
  borderRadius: 0,
  width: 'fit-content',
  boxShadow: 'none'
};

const DivNode = memo(divNode);

function ContainerNode({ id, data, selected }: NodeProps<CustomNodeData>) {
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    try {
      const element = JSON.parse(
        event.dataTransfer.getData('application/reactflow')
      ) as FlowElement;

      // Create a proper node from the dropped element
      const droppedNode: Node<CustomNodeData> = {
        id: `node-${Date.now()}`,
        type: 'divNode',
        position: { x: 0, y: 0 },
        data: {
          label: element.label,
          type: element.type,
          properties: {
            title: element.label,
            placeholder: element.defaultContent,
          },
        },
      };

      if (data.onChildAdd && id) {
        data.onChildAdd(id, droppedNode);
      }
    } catch (error) {
      console.error('Error handling node drop:', error);
    }
  };

  return (
    <div style={nodeStyles}>
      <Card 
        className={`min-w-[300px] min-h-[100px] ${selected ? 'ring-2 ring-primary' : ''}`}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!border-0 !bg-muted-foreground/20 hover:!bg-muted-foreground/40 transition-colors"
          style={{ width: 8, height: 8 }}
        />
        
        <div 
          className="p-4 min-h-[100px] flex flex-col gap-4"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {data.children && data.children.length > 0 ? (
            data.children.map((child) => (
              <DivNode
                key={child.id}
                id={child.id}
                type="divNode"
                data={child.data}
                selected={false}
                dragging={false}
                zIndex={0}
                isConnectable={false}
                xPos={0}
                yPos={0}
              />
            ))
          ) : (
            <div className="text-sm text-muted-foreground text-center border-2 border-dashed border-muted-foreground/20 rounded-lg p-4">
              Drop nodes here
            </div>
          )}
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