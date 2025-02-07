import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CustomNodeData } from '../../types';
import { cn } from '@/lib/utils';

type PaddingSize = '0' | '2' | '4' | '6';

function ParagraphNode({ id: _id, data, selected }: NodeProps<CustomNodeData>) {
  const {
    fontSize = 'base',
    textColor = 'default',
    padding = '4',
    showBackground = false
  } = data.properties;

  const paddingValue = (padding || '4') as PaddingSize;

  const textColorClasses = {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    primary: 'text-primary',
  } as const;

  const fontSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  } as const;

  const paddingClasses = {
    '0': 'p-0',
    '2': 'p-2',
    '4': 'p-4',
    '6': 'p-6',
  } as const;

  return (
    <div className="react-flow__node-default">
      <Handle
        type="target"
        position={Position.Top}
        className="!border-0 !bg-muted-foreground/20 hover:!bg-muted-foreground/40 transition-colors"
      />
      
      <div 
        className={cn(
          'min-w-[200px]',
          fontSizeClasses[fontSize],
          textColorClasses[textColor],
          paddingClasses[paddingValue],
          showBackground && 'bg-background rounded-lg shadow-sm',
          selected && 'ring-2 ring-primary rounded-lg'
        )}
      >
        {data.properties.placeholder ?? 'New Paragraph'}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!border-0 !bg-muted-foreground/20 hover:!bg-muted-foreground/40 transition-colors"
      />
    </div>
  );
}

ParagraphNode.displayName = 'ParagraphNode';

export default memo(ParagraphNode); 