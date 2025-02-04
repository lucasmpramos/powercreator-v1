import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from "@/lib/utils";
import { Type } from 'lucide-react';
import { styles } from '../styles';
import { CustomNodeData } from '../../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNodeLogic } from '../../hooks/useNodeLogic';
import { useController, useFormContext } from 'react-hook-form';

export function TextInputNode({ id, data, selected }: NodeProps<CustomNodeData>) {
  const { nodeClass } = useNodeLogic({
    selected,
    baseClass: "cursor-pointer",
  });

  const { control, formState: { errors } } = useFormContext();

  const { field } = useController<Record<string, string>>({
    name: id,
    control,
    defaultValue: "",
  });

  return (
    <div className={nodeClass}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className={styles.handle.base} 
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        className={styles.handle.base} 
      />
      <div 
        className={cn(
          "relative z-50 grid w-full gap-2 bg-background p-4 shadow-sm sm:rounded-lg border"
        )}
        data-node-id={id}
        data-node-type="text-input"
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <Type className="h-4 w-4" />
          <span>{data.properties?.title ?? data.label}</span>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>{data.properties?.label as string ?? 'Text Input'}</Label>
          <Input 
            type="text"
            placeholder={data.properties?.placeholder as string ?? 'Enter text...'} 
            disabled 
            {...field}
          />
        </div>
        {errors[id] && (
          <p className="text-xs font-medium text-destructive mt-1">
            {errors[id]?.message?.toString()}
          </p>
        )}
      </div>
      <Handle 
        type="source" 
        position={Position.Right} 
        className={styles.handle.base} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={styles.handle.base} 
      />
    </div>
  );
} 