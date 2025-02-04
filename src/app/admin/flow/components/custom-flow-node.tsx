import { Handle, Position, NodeProps } from 'reactflow';
import { 
  Type, 
  ListChecks, 
  AlignLeft,
  Calendar,
  Upload,
  Radio,
  CheckSquare,
  FileInput,
  Mail,
} from 'lucide-react';

type CustomNodeData = {
  label: string;
  content?: string;
  draggable: boolean;
  connectable: boolean;
  elementType: string;
}

const iconMap = {
  text: Type,
  textarea: AlignLeft,
  number: ListChecks,
  email: Mail,
  date: Calendar,
  file: Upload,
  radio: Radio,
  checkbox: CheckSquare,
  select: FileInput,
};

export function CustomFlowNode({ data, isConnectable }: NodeProps<CustomNodeData>) {
  const Icon = iconMap[data.elementType as keyof typeof iconMap] || Type;

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border border-gray-200">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={data.connectable && isConnectable}
      />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <div className="text-sm font-medium">{data.label}</div>
        </div>
        {data.content && (
          <div className="text-sm text-muted-foreground">
            {data.content}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={data.connectable && isConnectable}
      />
    </div>
  );
} 