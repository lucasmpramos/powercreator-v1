import { Node } from 'reactflow';
import { CustomNodeData } from '../types/index';

interface FlowPropertiesPanelProps {
  field: Node<CustomNodeData> | null;
  onUpdate: (node: Node<CustomNodeData>) => void;
}

export default function FlowPropertiesPanel({ field, onUpdate: _onUpdate }: FlowPropertiesPanelProps) {
  if (!field) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Node Properties</h4>
        <div className="space-y-2">
          <div>
            <label className="text-sm text-muted-foreground">Type</label>
            <div className="text-sm">{field.type}</div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Label</label>
            <div className="text-sm">{field.data.label}</div>
          </div>
          {Object.entries(field.data.properties || {}).map(([key, value]) => (
            <div key={key}>
              <label className="text-sm text-muted-foreground capitalize">{key}</label>
              <div className="text-sm">{value?.toString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 