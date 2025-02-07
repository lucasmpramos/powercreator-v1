import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CustomNodeData } from '../../types';
import { Card } from "@/components/ui/card";

function BaseNode({ id: _id, data, selected }: NodeProps<CustomNodeData>) {
  return (
    <div className="react-flow__node-default">
      <Handle
        type="target"
        position={Position.Top}
        className="!border-0 !bg-muted-foreground/20 hover:!bg-muted-foreground/40 transition-colors"
      />
      
      <Card 
        className={`relative bg-background ${selected ? 'ring-2 ring-primary' : 'border shadow-sm'}`}
      >
        <div className="p-4">
          {data.properties.placeholder ?? 'New Node'}
        </div>
      </Card>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!border-0 !bg-muted-foreground/20 hover:!bg-muted-foreground/40 transition-colors"
      />
    </div>
  );
}

BaseNode.displayName = 'BaseNode';

export default memo(BaseNode); 