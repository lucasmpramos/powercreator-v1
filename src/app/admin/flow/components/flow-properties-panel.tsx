import { Node } from 'reactflow';
import { CustomNodeData, NodeProperties } from '../types/index';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FlowPropertiesPanelProps {
  field: Node<CustomNodeData> | null;
  onUpdate: (node: Node<CustomNodeData>) => void;
}

export default function FlowPropertiesPanel({ field, onUpdate }: FlowPropertiesPanelProps) {
  if (!field) {
    return null;
  }

  const handlePropertyChange = <K extends keyof NodeProperties>(key: K, value: NodeProperties[K]) => {
    onUpdate({
      ...field,
      data: {
        ...field.data,
        properties: {
          ...field.data.properties,
          [key]: value,
        },
      },
    });
  };

  const isParagraphNode = field.type === 'paragraphNode';
  const isContainerNode = field.type === 'containerNode';
  const properties = field.data.properties as NodeProperties;

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-4">Node Properties</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="text-sm">{field.type}</div>
          </div>

          {isContainerNode && (
            <>
              <div className="space-y-2">
                <Label>Width</Label>
                <Input
                  value={properties.width ?? '300px'}
                  onChange={(e) => handlePropertyChange('width', e.target.value)}
                  placeholder="e.g., 300px, 100%, etc."
                />
              </div>

              <div className="space-y-2">
                <Label>Min Height</Label>
                <Input
                  value={properties.minHeight ?? '100px'}
                  onChange={(e) => handlePropertyChange('minHeight', e.target.value)}
                  placeholder="e.g., 100px"
                />
              </div>

              <div className="space-y-2">
                <Label>Padding</Label>
                <Select 
                  value={properties.padding ?? '4'}
                  onValueChange={(value) => handlePropertyChange('padding', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="2">Small</SelectItem>
                    <SelectItem value="4">Medium</SelectItem>
                    <SelectItem value="6">Large</SelectItem>
                    <SelectItem value="8">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Background Color</Label>
                <Input
                  value={properties.backgroundColor ?? 'transparent'}
                  onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                  placeholder="e.g., transparent, #fff, etc."
                />
              </div>
            </>
          )}

          {isParagraphNode && (
            <>
              <div className="space-y-2">
                <Label>Text Content</Label>
                <Input
                  value={properties.placeholder ?? ''}
                  onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select 
                  value={properties.fontSize ?? 'base'}
                  onValueChange={(value) => handlePropertyChange('fontSize', value as NodeProperties['fontSize'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xs">Extra Small</SelectItem>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="base">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="xl">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Text Color</Label>
                <Select 
                  value={properties.textColor ?? 'default'}
                  onValueChange={(value) => handlePropertyChange('textColor', value as NodeProperties['textColor'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="muted">Muted</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Padding</Label>
                <Select 
                  value={properties.padding ?? '0'}
                  onValueChange={(value) => handlePropertyChange('padding', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="2">Small</SelectItem>
                    <SelectItem value="4">Medium</SelectItem>
                    <SelectItem value="6">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label>Show Background</Label>
                <Switch
                  checked={properties.showBackground ?? false}
                  onCheckedChange={(checked) => handlePropertyChange('showBackground', checked)}
                />
              </div>
            </>
          )}

          {!isParagraphNode && !isContainerNode && (
            Object.entries(field.data.properties || {}).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label className="capitalize">{key}</Label>
                <div className="text-sm">{value?.toString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 