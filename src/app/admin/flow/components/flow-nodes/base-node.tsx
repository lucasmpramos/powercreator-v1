import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { CustomNodeData } from '../../types/index';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
  return (
    <div className="!p-0 !border-0 !bg-transparent !shadow-none !min-w-0 !min-h-0">
      <Card 
        className={`shadow-lg transition-colors ${selected ? 'ring-1 ring-primary' : ''}`}
      >
        <CardHeader className="p-5">
          <CardTitle className="text-base font-medium">{data.label}</CardTitle>
          {data.properties.placeholder && (
            <CardDescription className="text-sm text-muted-foreground">{data.properties.placeholder}</CardDescription>
          )}
        </CardHeader>
      </Card>
    </div>
  );
}

// Add display name for React Flow
CustomNode.displayName = 'CustomNode';  

export default memo(CustomNode); 