import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CustomNodeData } from '../../types/index';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Add styles to override React Flow's default node styling
const nodeStyles = {
  background: 'none',
  border: 'none',
  padding: 0,
  borderRadius: 0,
  width: 'fit-content',
  boxShadow: 'none'
};

function divNode({ data, selected }: NodeProps<CustomNodeData>) {
  return (
    <div style={nodeStyles}>
      <Card className={`${selected ? 'ring-2 ring-primary' : ''}`}>
        <Handle
          type="target"
          position={Position.Top}
          className="!border-0 !bg-muted-foreground/20 hover:!bg-muted-foreground/40 transition-colors"
          style={{ width: 8, height: 8 }}
        />
        <CardHeader className="p-6">
          <CardTitle className="text-base font-medium">{data.label}</CardTitle>
          {data.properties.placeholder && (
            <CardDescription>{data.properties.placeholder}</CardDescription>
          )}
        </CardHeader>
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

// Add display name for React Flow
divNode.displayName = 'divNode';

    export default memo(divNode); 