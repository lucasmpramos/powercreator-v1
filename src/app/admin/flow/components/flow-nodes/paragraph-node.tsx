import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CustomNodeData, NodeProperties } from '../../types/index';
import { cn } from '@/lib/utils';

type PaddingSize = '0' | '2' | '4' | '6';

function ParagraphNode({ data, selected }: NodeProps<CustomNodeData>) {
  const properties = data.properties as NodeProperties;
  const fontSize = properties.fontSize ?? 'base';
  const textColor = properties.textColor ?? 'default';
  const padding = (properties.padding ?? '0') as PaddingSize;
  const showBackground = properties.showBackground ?? false;

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
    <div className="!p-0 !border-0 !bg-transparent !shadow-none !min-w-0 !min-h-0">
      <div 
        className={cn(
          'min-w-[300px]',
          fontSizeClasses[fontSize],
          textColorClasses[textColor],
          paddingClasses[padding],
          showBackground && 'bg-background rounded-lg shadow-sm',
          selected && 'ring-1 ring-primary rounded-lg'
        )}
      >
        {properties.placeholder}
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!border-0 !bg-muted-foreground/20 hover:!bg-muted-foreground/40 transition-colors"
        style={{ width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!border-0 !bg-muted-foreground/20 hover:!bg-muted-foreground/40 transition-colors"
        style={{ width: 8, height: 8 }}
      />
    </div>
  );
}

ParagraphNode.displayName = 'ParagraphNode';

export default memo(ParagraphNode); 