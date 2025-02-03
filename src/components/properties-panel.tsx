import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Trash2, Type, LayoutIcon, Box, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { Field } from "@/types/form-builder";

interface PropertiesPanelProps {
  field: Field | null;
  onUpdate: (updates: Partial<Field>) => void;
}

export function PropertiesPanel({ field, onUpdate }: PropertiesPanelProps) {
  const [openSections, setOpenSections] = useState<string[]>(['basic']); // Default open section

  const toggleSection = (section: string) => {
    setOpenSections(current =>
      current.includes(section)
        ? current.filter(s => s !== section)
        : [...current, section]
    );
  };

  if (!field) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted-foreground px-4">
        Select a field to edit its properties
      </div>
    );
  }

  const PropertyGroup = ({ 
    id, 
    title, 
    icon: Icon, 
    children 
  }: { 
    id: string;
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
  }) => (
    <Collapsible
      open={openSections.includes(id)}
      onOpenChange={() => toggleSection(id)}
      className="space-y-2"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full">
        <h3 className="font-medium flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </h3>
        <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes(id) ? 'transform rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="space-y-4">
      <PropertyGroup id="basic" title="Basic" icon={Type}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Label</Label>
            <Input
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Field Type</Label>
            <Select
              value={field.type}
              onValueChange={(value) => onUpdate({ type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" align="start">
                <SelectItem value="text">Text Input</SelectItem>
                <SelectItem value="textarea">Text Area</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="date">Date Picker</SelectItem>
                <SelectItem value="file">File Upload</SelectItem>
                <SelectItem value="radio">Radio Group</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="select">Dropdown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PropertyGroup>

      <Separator />

      <PropertyGroup id="layout" title="Layout" icon={LayoutIcon}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Field Width</Label>
            <Select
              value={field.properties.width || 'full'}
              onValueChange={(value) => 
                onUpdate({ 
                  properties: { ...field.properties, width: value }
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" align="start">
                <SelectItem value="full">Full Width</SelectItem>
                <SelectItem value="1/2">Half Width (1/2)</SelectItem>
                <SelectItem value="1/3">One Third (1/3)</SelectItem>
                <SelectItem value="2/3">Two Thirds (2/3)</SelectItem>
                <SelectItem value="1/4">One Quarter (1/4)</SelectItem>
                <SelectItem value="3/4">Three Quarters (3/4)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Padding</Label>
              <Select
                value={field.properties.padding || 'medium'}
                onValueChange={(value) => 
                  onUpdate({
                    properties: { ...field.properties, padding: value as Field['properties']['padding'] }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" align="start">
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Margin</Label>
              <Select
                value={field.properties.margin || 'medium'}
                onValueChange={(value) => 
                  onUpdate({
                    properties: { ...field.properties, margin: value as Field['properties']['margin'] }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" align="start">
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PropertyGroup>

      <Separator />

      <PropertyGroup id="validation" title="Validation" icon={ListChecks}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Required</Label>
            <Switch
              checked={field.properties.required}
              onCheckedChange={(checked) => 
                onUpdate({ properties: { ...field.properties, required: checked } })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Placeholder</Label>
            <Input
              value={field.properties.placeholder || ''}
              onChange={(e) => 
                onUpdate({ properties: { ...field.properties, placeholder: e.target.value } })
              }
              placeholder="Enter placeholder text"
            />
          </div>

          <div className="space-y-2">
            <Label>Help Text</Label>
            <Input
              value={field.properties.helpText || ''}
              onChange={(e) => 
                onUpdate({ properties: { ...field.properties, helpText: e.target.value } })
              }
              placeholder="Enter help text"
            />
          </div>

          {(field.type === 'select' || field.type === 'radio') && (
            <div className="space-y-2">
              <Label>Options</Label>
              {field.properties.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option.label}
                    onChange={(e) => {
                      const newOptions = [...(field.properties.options || [])];
                      newOptions[index] = { ...option, label: e.target.value };
                      onUpdate({ 
                        properties: { ...field.properties, options: newOptions } 
                      });
                    }}
                    placeholder="Option label"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newOptions = field.properties.options?.filter((_, i) => i !== index);
                      onUpdate({ 
                        properties: { ...field.properties, options: newOptions } 
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newOptions = [...(field.properties.options || [])];
                  newOptions.push({ 
                    label: `Option ${newOptions.length + 1}`, 
                    value: `option${newOptions.length + 1}` 
                  });
                  onUpdate({ 
                    properties: { ...field.properties, options: newOptions } 
                  });
                }}
              >
                Add Option
              </Button>
            </div>
          )}

          {(field.type === 'text' || field.type === 'textarea') && (
            <>
              <div className="space-y-2">
                <Label>Minimum Length</Label>
                <Input
                  type="number"
                  value={field.properties.minLength || ''}
                  onChange={(e) => 
                    onUpdate({ 
                      properties: { 
                        ...field.properties, 
                        minLength: parseInt(e.target.value) || undefined 
                      } 
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum Length</Label>
                <Input
                  type="number"
                  value={field.properties.maxLength || ''}
                  onChange={(e) => 
                    onUpdate({ 
                      properties: { 
                        ...field.properties, 
                        maxLength: parseInt(e.target.value) || undefined 
                      } 
                    })
                  }
                />
              </div>
            </>
          )}

          {field.type === 'number' && (
            <>
              <div className="space-y-2">
                <Label>Minimum Value</Label>
                <Input
                  type="number"
                  value={field.properties.min || ''}
                  onChange={(e) => 
                    onUpdate({ 
                      properties: { 
                        ...field.properties, 
                        min: parseInt(e.target.value) || undefined 
                      } 
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum Value</Label>
                <Input
                  type="number"
                  value={field.properties.max || ''}
                  onChange={(e) => 
                    onUpdate({ 
                      properties: { 
                        ...field.properties, 
                        max: parseInt(e.target.value) || undefined 
                      } 
                    })
                  }
                />
              </div>
            </>
          )}
        </div>
      </PropertyGroup>
    </div>
  );
} 