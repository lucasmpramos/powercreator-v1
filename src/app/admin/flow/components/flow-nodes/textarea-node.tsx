import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from "@/lib/utils";
import { AlignLeft } from 'lucide-react';
import { styles } from '../styles';
import { CustomNodeData } from '../../types';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function TextAreaNode({ id, data, selected }: NodeProps<CustomNodeData>) {
  return (
    <div 
      className={cn(
        "relative group",
        selected && "ring-2 ring-primary ring-offset-2"
      )}
    >
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
          "relative z-50 grid w-full gap-2 bg-background p-4 shadow-sm sm:rounded-lg border",
          "cursor-pointer"
        )}
        data-node-id={id}
        data-node-type="textarea"
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <AlignLeft className="h-4 w-4" />
          <span>{data.properties?.title ?? data.label}</span>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>{data.properties?.label as string ?? 'Text Area'}</Label>
          <Textarea 
            placeholder={data.properties?.placeholder as string ?? 'Enter text...'} 
            disabled 
            className="min-h-[80px]"
          />
        </div>
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