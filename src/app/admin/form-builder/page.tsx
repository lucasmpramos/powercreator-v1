import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Eye,
  EyeOff,
  Trash2,
  GripVertical,
  Plus,
  AlignLeft as AlignLeftIcon,
  AlignCenter,
  AlignRight,
  Palette,
  Layout as LayoutIcon,
  Box,
  ChevronRight,
  Pencil,
} from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";

// Field value types
type TextFieldValue = string;
type NumberFieldValue = number;
type BooleanFieldValue = boolean;
type FileFieldValue = File | null;
type SelectFieldValue = string;

type FieldValue = TextFieldValue | NumberFieldValue | BooleanFieldValue | FileFieldValue | SelectFieldValue | null;

type FieldType = 'text' | 'textarea' | 'number' | 'email' | 'date' | 'file' | 'select' | 'radio' | 'checkbox';

interface FieldCategory {
  name: string;
  fields: Array<{
    id: string;
    type: FieldType;
    label: string;
    icon: React.ElementType;
    properties: Field['properties'];
  }>;
}

// Field Categories for better organization
const fieldCategories: FieldCategory[] = [
  {
    name: "Basic",
    fields: [
      { id: 'field-text', type: 'text', label: 'Text Input', icon: Type, properties: {} },
      { id: 'field-textarea', type: 'textarea', label: 'Text Area', icon: AlignLeft, properties: {} },
      { id: 'field-number', type: 'number', label: 'Number', icon: ListChecks, properties: {} },
      { id: 'field-email', type: 'email', label: 'Email', icon: Mail, properties: {} },
    ]
  },
  {
    name: "Advanced",
    fields: [
      { id: 'field-date', type: 'date', label: 'Date Picker', icon: Calendar, properties: {} },
      { id: 'field-file', type: 'file', label: 'File Upload', icon: Upload, properties: {} },
      { id: 'field-select', type: 'select', label: 'Dropdown', icon: FileInput, properties: {} }
    ]
  },
  {
    name: "Choice",
    fields: [
      { id: 'field-radio', type: 'radio', label: 'Radio Group', icon: Radio, properties: {} },
      { id: 'field-checkbox', type: 'checkbox', label: 'Checkbox', icon: CheckSquare, properties: {} },
    ]
  }
];

type Field = {
  id: string;
  type: FieldType;
  label: string;
  icon: React.ElementType;
  properties: {
    placeholder?: string;
    helpText?: string;
    required?: boolean;
    validation?: string;
    options?: { label: string; value: string }[];
    defaultValue?: FieldValue;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    multiple?: boolean;
    hidden?: boolean;
    dependent?: {
      field: string;
      value: FieldValue;
    };
    // Layout properties
    width?: 'full' | '1/2' | '1/3' | '1/4' | '2/3' | '3/4';
    alignment?: 'left' | 'center' | 'right';
    padding?: 'none' | 'small' | 'medium' | 'large';
    margin?: 'none' | 'small' | 'medium' | 'large';
    // Styling properties
    labelStyle?: {
      size?: 'small' | 'medium' | 'large';
      weight?: 'normal' | 'medium' | 'bold';
      color?: string;
    };
    inputStyle?: {
      variant?: 'outline' | 'filled' | 'flushed';
      size?: 'small' | 'medium' | 'large';
      borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full';
    };
    // Group properties
    group?: string;
    isGroupHeader?: boolean;
  };
};

type Step = {
  id: string;
  title: string;
  description?: string;
  fields: Field[];
  // Layout properties for the step
  layout?: {
    type: 'default' | 'grid' | 'columns';
    columns?: number;
    gap?: 'small' | 'medium' | 'large';
  };
};

const generateId = () => `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const FormBuilderContent = () => {
  const [steps, setSteps] = useState<Step[]>([
    { id: generateId(), title: 'Step 1', description: 'First step of your form', fields: [] }
  ]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeField, setActiveField] = useState<Field | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  interface DragStartEventType {
    active: { id: string };
  }

  interface DragEndEventType {
    active: { id: string };
    over: { id: string } | null;
  }

  const handleDragStart = (event: DragStartEventType) => {
    const { active } = event;
    const allFields: Field[] = fieldCategories.reduce<Field[]>((acc, category) => {
      return [...acc, ...category.fields.map((field): Field => ({
        ...field,
        properties: field.properties ?? {}
      }))];
    }, []);
    
    const activeFieldTemplate = allFields.find((field) => field.id === active.id);
    
    if (activeFieldTemplate) {
      const newField: Field = {
        ...activeFieldTemplate,
        id: `temp-${generateId()}`,
        properties: {
          ...activeFieldTemplate.properties
        }
      };
      setActiveField(newField);
    } else {
      const activeField = steps[currentStepIndex].fields.find(
        (field) => field.id === active.id
      );
      if (activeField) {
        setActiveField(activeField);
      }
    }
  };

  const handleDragEnd = (event: DragEndEventType) => {
    const { active, over } = event;

    if (!over) return;

    // Handle dropping new fields from the sidebar
    if (active.id.startsWith('field-')) {
      const fieldTemplate = fieldCategories
        .flatMap((category: FieldCategory) => category.fields as Field[])
        .find((field: Field) => field.id === active.id);

      if (fieldTemplate) {
        const newField: Field = {
          ...fieldTemplate,
          id: generateId(),
          properties: {
            placeholder: '',
            helpText: '',
            required: false,
            validation: 'none',
            options: fieldTemplate.type === 'select' || fieldTemplate.type === 'radio' ? [
              { label: 'Option 1', value: 'option1' },
              { label: 'Option 2', value: 'option2' }
            ] : undefined
          }
        };

        setSteps((prevSteps: Step[]): Step[] => {
          const newSteps = [...prevSteps];
          const currentFields = [...newSteps[currentStepIndex].fields];
          
          if (over.id === 'canvas-top') {
            currentFields.unshift(newField);
          } else if (over.id === 'canvas-bottom' || over.id === 'canvas-droppable') {
            currentFields.push(newField);
          } else if (over.id.endsWith('-drop')) {
            const targetId = over.id.replace('-drop', '');
            const targetIndex = currentFields.findIndex((f: Field) => f.id === targetId);
            if (targetIndex !== -1) {
              currentFields.splice(targetIndex + 1, 0, newField);
            } else {
              currentFields.push(newField);
            }
          }
          
          newSteps[currentStepIndex].fields = currentFields;
          return newSteps;
        });
      }
    }
    // Handle reordering existing fields
    else if (!active.id.startsWith('field-')) {
      setSteps((prevSteps: Step[]): Step[] => {
        const newSteps = [...prevSteps];
        const currentFields = [...newSteps[currentStepIndex].fields];
        const activeField = currentFields.find((f: Field) => f.id === active.id);
        
        if (!activeField) return prevSteps;

        // Remove the field from its current position
        const oldIndex = currentFields.findIndex((f: Field) => f.id === active.id);
        currentFields.splice(oldIndex, 1);

        // Insert the field at its new position
        if (over.id === 'canvas-top') {
          currentFields.unshift(activeField);
        } else if (over.id === 'canvas-bottom' || over.id === 'canvas-droppable') {
          currentFields.push(activeField);
        } else if (over.id.endsWith('-drop')) {
          const targetId = over.id.replace('-drop', '');
          const targetIndex = currentFields.findIndex((f: Field) => f.id === targetId);
          if (targetIndex !== -1) {
            currentFields.splice(targetIndex + 1, 0, activeField);
          } else {
            currentFields.push(activeField);
          }
        } else {
          // If dropping directly on a field
          const targetIndex = currentFields.findIndex((f: Field) => f.id === over.id);
          if (targetIndex !== -1) {
            currentFields.splice(targetIndex, 0, activeField);
          } else {
            currentFields.splice(oldIndex, 0, activeField); // Put it back if no valid target
          }
        }

        newSteps[currentStepIndex].fields = currentFields;
        return newSteps;
      });
    }
    setActiveField(null);
  };

  const handleUpdateField = (fieldId: string, updates: Partial<Field>) => {
    setSteps((prevSteps) => {
      const newSteps = [...prevSteps];
      const stepIndex = currentStepIndex;
      const fieldIndex = newSteps[stepIndex].fields.findIndex(f => f.id === fieldId);
      if (fieldIndex !== -1) {
        newSteps[stepIndex].fields[fieldIndex] = {
          ...newSteps[stepIndex].fields[fieldIndex],
          ...updates
        };
      }
      return newSteps;
    });
  };

  const handleDeleteField = (fieldId: string) => {
    setSteps((prevSteps) => {
      const newSteps = [...prevSteps];
      newSteps[currentStepIndex].fields = newSteps[currentStepIndex].fields.filter(
        f => f.id !== fieldId
      );
      return newSteps;
    });
    setSelectedField(null);
  };

  const handleStepChange = (index: number) => {
    setCurrentStepIndex(index);
    setSelectedField(null);
  };

  const handleAddStep = () => {
    setSteps((prevSteps) => [
      ...prevSteps,
      { 
        id: generateId(), 
        title: `Step ${prevSteps.length + 1}`,
        description: `Step ${prevSteps.length + 1} of your form`,
        fields: [] 
      }
    ]);
  };

  const handleUpdateStep = (stepId: string, updates: Partial<Step>) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      )
    );
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-none p-4 pb-0">
        <div className="flex justify-end">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-[280px] justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-muted text-sm">
                        {currentStepIndex + 1}
                      </span>
                      <span className="truncate">
                        {steps[currentStepIndex].title}
                      </span>
                    </div>
                    <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Search steps..." />
                    <CommandList>
                      <CommandEmpty>No steps found.</CommandEmpty>
                      <CommandGroup heading="Steps">
                        {steps.map((step, index) => (
                          <CommandItem
                            key={step.id}
                            onSelect={() => handleStepChange(index)}
                            className="flex items-center gap-2"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-muted text-sm">
                                {index + 1}
                              </span>
                              <span className="truncate">{step.title}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newTitle = window.prompt('Enter step title', step.title);
                                  if (newTitle) {
                                    handleUpdateStep(step.id, { title: newTitle });
                                  }
                                }}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              {steps.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Are you sure you want to delete this step?')) {
                                      setSteps(steps.filter(s => s.id !== step.id));
                                      if (currentStepIndex >= index) {
                                        setCurrentStepIndex(Math.max(0, currentStepIndex - 1));
                                      }
                                    }
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <CommandSeparator />
                      <CommandGroup>
                        <CommandItem
                          onSelect={handleAddStep}
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <Plus className="h-4 w-4" />
                          Add new step
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <Button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              variant="outline"
            >
              {isPreviewMode ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Exit Preview
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Form
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {isPreviewMode ? (
        <div className="flex-1 p-4 overflow-auto">
          <FormPreview steps={steps} />
        </div>
      ) : (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex-1 p-4 min-h-0">
            <div className="flex gap-4 h-full">
              <Card className="w-64 flex flex-col">
                <CardHeader className="flex-none py-3 px-4">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider">
                    Form Elements
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden pt-0 px-4">
                  <ScrollArea className="h-full">
                    <div className="space-y-4">
                      {fieldCategories.map((category) => (
                        <div key={category.name} className="space-y-2">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            {category.name}
                          </h3>
                          <div className="space-y-2 pr-0">
                            {category.fields.map((field) => (
                              <DraggableField 
                                key={field.id} 
                                field={field as Field} 
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="flex-1 flex flex-col">
                <CardHeader className="flex-none py-3 px-4">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider">
                    Form Canvas
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <Canvas 
                    step={steps[currentStepIndex]} 
                    onFieldSelect={setSelectedField}
                    onDeleteField={handleDeleteField}
                    selectedFieldId={selectedField?.id}
                  />
                </CardContent>
              </Card>

              <Card className="w-80 flex flex-col">
                <CardHeader className="flex-none py-3 px-4">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider">
                    Properties
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <PropertiesPanel 
                    field={selectedField} 
                    onUpdate={(updates) => {
                      if (selectedField) {
                        handleUpdateField(selectedField.id, updates);
                        setSelectedField({ ...selectedField, ...updates });
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          <DragOverlay>
            {activeField && (
              <div className="w-56 opacity-80">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <activeField.icon className="mr-2 h-4 w-4" />
                  {activeField.label}
                </Button>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default FormBuilderContent;

// Form Preview Component
const FormPreview = ({ steps }: { steps: Step[] }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, FieldValue>>({});

  const handleFieldChange = (fieldId: string, value: FieldValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const getFieldValue = (field: Field): FieldValue => {
    const value = formData[field.id];
    if (value === undefined) return null;
    
    switch (field.type) {
      case 'checkbox':
        return Boolean(value);
      case 'number':
        return typeof value === 'number' ? value : null;
      case 'file':
        return value instanceof File ? value : null;
      default:
        return typeof value === 'string' ? value : null;
    }
  };

  // Get label classes based on label style properties
  const getLabelClasses = (field: Field) => {
    const classes = ['block'];
    
    // Size classes
    switch (field.properties.labelStyle?.size ?? 'medium') {
      case 'small': classes.push('text-sm'); break;
      case 'large': classes.push('text-lg'); break;
      default: classes.push('text-base');
    }
    
    // Weight classes
    switch (field.properties.labelStyle?.weight ?? 'normal') {
      case 'medium': classes.push('font-medium'); break;
      case 'bold': classes.push('font-bold'); break;
      default: classes.push('font-normal');
    }

    // Color
    if (field.properties.labelStyle?.color) {
      classes.push(`text-[${field.properties.labelStyle.color}]`);
    }

    return classes.join(' ');
  };

  // Get input classes based on input style properties
  const getInputClasses = (field: Field) => {
    const classes = [];
    
    // Base styles based on variant
    switch (field.properties.inputStyle?.variant) {
      case 'filled':
        classes.push('bg-muted');
        break;
      case 'flushed':
        classes.push('border-0 border-b rounded-none focus:ring-0');
        break;
      default: // outline
        classes.push('bg-background');
    }
    
    // Size classes
    switch (field.properties.inputStyle?.size) {
      case 'small':
        classes.push('h-8 text-sm');
        break;
      case 'large':
        classes.push('h-12 text-lg');
        break;
      default:
        classes.push('h-10 text-base');
    }
    
    // Border radius
    switch (field.properties.inputStyle?.borderRadius) {
      case 'none': classes.push('rounded-none'); break;
      case 'small': classes.push('rounded-sm'); break;
      case 'large': classes.push('rounded-lg'); break;
      case 'full': classes.push('rounded-full'); break;
      default: classes.push('rounded-md');
    }

    return classes.join(' ');
  };

  // Get container classes for the field
  const getFieldContainerClasses = (field: Field) => {
    const classes = [
      getWidthClass(field.properties.width),
      getPaddingClass(field.properties.padding),
      getMarginClass(field.properties.margin),
    ];

    if (field.properties.alignment) {
      classes.push(`text-${field.properties.alignment}`);
    }

    return classes.join(' ');
  };

  // Render a single field with all its styling
  const renderField = (field: Field) => {
    // Check field dependencies
    if (field.properties.dependent) {
      const { field: dependentField, value } = field.properties.dependent;
      if (formData[dependentField] !== value) {
        return null;
      }
    }

    const containerClasses = getFieldContainerClasses(field);
    const labelClasses = getLabelClasses(field);
    const inputClasses = getInputClasses(field);

    const renderInput = () => {
      const value = getFieldValue(field);
      
      switch (field.type) {
        case 'text':
        case 'email':
        case 'date':
          return (
            <Input
              type={field.type}
              placeholder={field.properties.placeholder ?? ''}
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.properties.required}
              className={inputClasses}
            />
          );
        case 'number':
          return (
            <Input
              type="number"
              placeholder={field.properties.placeholder ?? ''}
              value={typeof value === 'number' ? value : ''}
              onChange={(e) => handleFieldChange(field.id, Number(e.target.value))}
              required={field.properties.required}
              min={field.properties.min}
              max={field.properties.max}
              className={inputClasses}
            />
          );
        case 'textarea':
          return (
            <Textarea
              placeholder={field.properties.placeholder ?? ''}
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.properties.required}
              className={inputClasses}
            />
          );
        case 'select':
        case 'radio':
          return (
            <RadioGroup
              value={typeof value === 'string' ? value : ''}
              onValueChange={(val) => handleFieldChange(field.id, val)}
              className="space-y-2"
            >
              {field.properties.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                  <Label htmlFor={`${field.id}-${option.value}`} className={labelClasses}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          );
        case 'checkbox':
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                checked={typeof value === 'boolean' ? value : false}
                onCheckedChange={(checked) => handleFieldChange(field.id, !!checked)}
              />
              <Label htmlFor={field.id} className={labelClasses}>
                {field.properties.placeholder ?? field.label}
              </Label>
            </div>
          );
        case 'file':
          return (
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                handleFieldChange(field.id, file);
              }}
              required={field.properties.required}
              className={inputClasses}
            />
          );
        default:
          return null;
      }
    };

    return (
      <div key={field.id} className={containerClasses}>
        <div className="space-y-2">
          {field.type !== 'checkbox' && (
            <Label className={labelClasses}>
              {field.label}
              {field.properties.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
          )}
          {renderInput()}
          {field.properties.helpText && (
            <p className="text-sm text-muted-foreground">
              {field.properties.helpText}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Group fields by their group property
  const groupFields = (fields: Field[]) => {
    const groups: Record<string, Field[]> = {
      ungrouped: []
    };

    fields.forEach(field => {
      if (field.properties.group) {
        if (!groups[field.properties.group]) {
          groups[field.properties.group] = [];
        }
        groups[field.properties.group].push(field);
      } else {
        groups.ungrouped.push(field);
      }
    });

    return groups;
  };

  // Get classes for the form layout
  const getLayoutClasses = (step: Step) => {
    const classes = ['grid', 'gap-4'];
    
    if (step.layout?.type === 'grid') {
      classes.push(`grid-cols-${step.layout.columns ?? 1}`);
    } else if (step.layout?.type === 'columns') {
      classes.push('grid-cols-2');
    }

    if (step.layout?.gap) {
      switch (step.layout.gap) {
        case 'small': classes.push('gap-2'); break;
        case 'large': classes.push('gap-6'); break;
        default: classes.push('gap-4');
      }
    }

    return classes.join(' ');
  };

  // Render a group of fields
  const renderGroup = (groupName: string, fields: Field[]) => {
    const headerField = fields.find(f => f.properties.isGroupHeader);
    const contentFields = fields.filter(f => !f.properties.isGroupHeader);
    
    if (contentFields.length === 0) return null;
    
    return (
      <div key={groupName} className="space-y-4 border rounded-lg p-4">
        {headerField && (
          <h3 className="text-lg font-medium">{headerField.label}</h3>
        )}
        <div className={getLayoutClasses(steps[currentStep])}>
          {contentFields.map(renderField)}
        </div>
      </div>
    );
  };

  // Render the form content
  const renderFormContent = () => {
    const groups = groupFields(steps[currentStep].fields);
    
    return (
      <div className="space-y-8">
        {/* Render grouped fields */}
        {Object.entries(groups).map(([groupName, fields]) => {
          if (groupName === 'ungrouped') {
            if (fields.length === 0) return null;
            return (
              <div key="ungrouped" className={getLayoutClasses(steps[currentStep])}>
                {fields.map(renderField)}
              </div>
            );
          }
          return renderGroup(groupName, fields);
        })}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{steps[currentStep].title}</CardTitle>
        <CardDescription>{steps[currentStep].description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {renderFormContent()}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={currentStep === steps.length - 1}
            >
              Next
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// DraggableField component using dnd-kit hooks
const DraggableField = ({
  field
}: {
  field: Field;
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: field.id,
    data: {
      type: 'new-field',
      field
    }
  });

  return (
    <div className="w-full">
      <Button
        ref={setNodeRef}
        variant="outline"
        className={`w-full justify-start ${isDragging ? 'opacity-50' : ''}`}
        {...listeners}
        {...attributes}
      >
        <field.icon className="mr-2 h-4 w-4 shrink-0" />
        <span className="truncate">{field.label}</span>
      </Button>
    </div>
  );
};

// Canvas component serves as the drop area for fields in the current step
const Canvas = ({ 
  step, 
  onFieldSelect,
  onDeleteField,
  selectedFieldId 
}: { 
  step: Step; 
  onFieldSelect: (field: Field) => void;
  onDeleteField: (fieldId: string) => void;
  selectedFieldId?: string;
}) => {
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ 
    id: 'canvas-droppable',
  });
  
  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="px-4">
          <div 
            ref={setDroppableRef}
            className={cn(
              "min-h-full h-full border-2 border-dashed rounded-lg p-2 transition-colors",
              isOver && "bg-muted/50 border-primary/50"
            )}
          >
            {step.fields.length === 0 ? (
              <div className="flex items-center justify-center min-h-[20rem]">
                <p className="text-sm text-muted-foreground">
                  Drag and drop form elements here
                </p>
              </div>
            ) : (
              <SortableContext items={step.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-0">
                  <DropIndicator id="canvas-top" isMainCanvas />
                  {step.fields.map((field) => (
                    <React.Fragment key={field.id}>
                      <SortableFieldItem
                        field={field}
                        onSelect={onFieldSelect}
                        onDelete={onDeleteField}
                        isSelected={selectedFieldId === field.id}
                      />
                      <DropIndicator id={`${field.id}-drop`} />
                    </React.Fragment>
                  ))}
                  <DropIndicator id="canvas-bottom" isMainCanvas />
                </div>
              </SortableContext>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

// Update the DropIndicator component
const DropIndicator = ({ id, isMainCanvas = false }: { id: string; isMainCanvas?: boolean }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id
  });

  const baseClasses = ["transition-all"];

  if (isMainCanvas) {
    if (isOver) {
      baseClasses.push("h-4 bg-primary/20");
    } else {
      baseClasses.push("h-1");
    }
  } else {
    if (isOver) {
      baseClasses.push("h-2 opacity-100 bg-primary/10");
    } else {
      baseClasses.push("h-0.5 mx-2 opacity-0");
    }
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(baseClasses)}
    />
  );
};

// Update the SortableFieldItem component
const SortableFieldItem = ({
  field,
  onSelect,
  onDelete,
  isSelected,
}: {
  field: Field;
  onSelect: (field: Field) => void;
  onDelete: (fieldId: string) => void;
  isSelected: boolean;
}) => {
  const sortableProps = useSortable({
    id: field.id,
    data: {
      type: 'form-field',
      field
    },
    resizeObserverConfig: {
      disabled: true
    }
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = sortableProps;

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  } : undefined;

  const baseClasses = ["group relative rounded-md transition-all"];
  if (isDragging) baseClasses.push("opacity-50");
  baseClasses.push(isSelected ? "bg-primary/10 hover:bg-primary/15" : "hover:bg-muted/50");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(baseClasses)}
      {...attributes}
    >
      <div className="flex items-center gap-2 py-1 px-2">
        <div
          className="cursor-grab active:cursor-grabbing"
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <Button
          variant="ghost"
          className="flex-1 justify-start hover:bg-transparent"
          onClick={() => onSelect(field)}
        >
          <field.icon className="mr-2 h-4 w-4" />
          {field.label}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDelete(field.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Helper function to convert width to Tailwind classes
const getWidthClass = (width?: string) => {
  switch (width) {
    case '1/2': return 'w-1/2';
    case '1/3': return 'w-1/3';
    case '2/3': return 'w-2/3';
    case '1/4': return 'w-1/4';
    case '3/4': return 'w-3/4';
    default: return 'w-full';
  }
};

// Helper function to get padding classes
const getPaddingClass = (padding?: string) => {
  switch (padding) {
    case 'small': return 'p-2';
    case 'medium': return 'p-4';
    case 'large': return 'p-6';
    default: return 'p-0';
  }
};

// Helper function to get margin classes
const getMarginClass = (margin?: string) => {
  switch (margin) {
    case 'small': return 'm-2';
    case 'medium': return 'm-4';
    case 'large': return 'm-6';
    default: return 'm-0';
  }
};

// PropertiesPanel component for editing properties of a selected field
const PropertiesPanel = ({ 
  field, 
  onUpdate 
}: { 
  field: Field | null;
  onUpdate: (updates: Partial<Field>) => void;
}) => {
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
    <ScrollArea className="h-full">
      <div className="px-4">
        <div className="space-y-4 py-4">
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
                  onValueChange={(value: FieldType) => onUpdate({ type: value })}
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
                  value={field.properties.width ?? 'full'}
                  onValueChange={(value) => 
                    onUpdate({ 
                      properties: { ...field.properties, width: value as Field['properties']['width'] }
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

              <div className="space-y-2">
                <Label>Alignment</Label>
                <div className="flex gap-2">
                  {(['left', 'center', 'right'] as const).map((align) => (
                    <Button
                      key={align}
                      variant={field.properties.alignment === align ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => 
                        onUpdate({
                          properties: { ...field.properties, alignment: align }
                        })
                      }
                    >
                      {align === 'left' && <AlignLeftIcon className="h-4 w-4" />}
                      {align === 'center' && <AlignCenter className="h-4 w-4" />}
                      {align === 'right' && <AlignRight className="h-4 w-4" />}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Padding</Label>
                  <Select
                    value={field.properties.padding ?? 'medium'}
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
                    value={field.properties.margin ?? 'medium'}
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

          <PropertyGroup id="styling" title="Styling" icon={Palette}>
            <div className="space-y-4">
              <Label>Label Style</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Size</Label>
                  <Select
                    value={field.properties.labelStyle?.size ?? 'medium'}
                    onValueChange={(value) => 
                      onUpdate({
                        properties: {
                          ...field.properties,
                          labelStyle: {
                            ...field.properties.labelStyle,
                            size: value as NonNullable<Field['properties']['labelStyle']>['size']
                          }
                        }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" align="start">
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Weight</Label>
                  <Select
                    value={field.properties.labelStyle?.weight ?? 'normal'}
                    onValueChange={(value) => 
                      onUpdate({
                        properties: {
                          ...field.properties,
                          labelStyle: {
                            ...field.properties.labelStyle,
                            weight: value as NonNullable<Field['properties']['labelStyle']>['weight']
                          }
                        }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" align="start">
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Input Style</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Variant</Label>
                  <Select
                    value={field.properties.inputStyle?.variant ?? 'outline'}
                    onValueChange={(value) => 
                      onUpdate({
                        properties: {
                          ...field.properties,
                          inputStyle: {
                            ...field.properties.inputStyle,
                            variant: value as NonNullable<Field['properties']['inputStyle']>['variant']
                          }
                        }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" align="start">
                      <SelectItem value="outline">Outline</SelectItem>
                      <SelectItem value="filled">Filled</SelectItem>
                      <SelectItem value="flushed">Flushed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Size</Label>
                    <Select
                      value={field.properties.inputStyle?.size ?? 'medium'}
                      onValueChange={(value) => 
                        onUpdate({
                          properties: {
                            ...field.properties,
                            inputStyle: {
                              ...(field.properties.inputStyle ?? {}),
                              size: value
                            } as NonNullable<Field['properties']['inputStyle']>
                          }
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" side="bottom" align="start">
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Border Radius</Label>
                    <Select
                      value={field.properties.inputStyle?.borderRadius ?? 'medium'}
                      onValueChange={(value) => 
                        onUpdate({
                          properties: {
                            ...field.properties,
                            inputStyle: {
                              ...(field.properties.inputStyle ?? {}),
                              borderRadius: value
                            } as NonNullable<Field['properties']['inputStyle']>
                          }
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
                        <SelectItem value="full">Full</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </PropertyGroup>

          <Separator />

          <PropertyGroup id="grouping" title="Grouping" icon={Box}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Group Name</Label>
                <Input
                  value={field.properties.group ?? ''}
                  onChange={(e) => 
                    onUpdate({
                      properties: { ...field.properties, group: e.target.value }
                    })
                  }
                  placeholder="Enter group name"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isGroupHeader"
                  checked={field.properties.isGroupHeader}
                  onCheckedChange={(checked) => 
                    onUpdate({
                      properties: { ...field.properties, isGroupHeader: checked as boolean }
                    })
                  }
                />
                <Label htmlFor="isGroupHeader">Is Group Header</Label>
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
                  value={field.properties.placeholder ?? ''}
                  onChange={(e) => 
                    onUpdate({ properties: { ...field.properties, placeholder: e.target.value } })
                  }
                  placeholder="Enter placeholder text"
                />
              </div>

              <div className="space-y-2">
                <Label>Help Text</Label>
                <Input
                  value={field.properties.helpText ?? ''}
                  onChange={(e) => 
                    onUpdate({ properties: { ...field.properties, helpText: e.target.value } })
                  }
                  placeholder="Enter help text"
                />
              </div>

              {(field.type === 'select' || field.type === 'radio') && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  {(field.properties.options ?? []).map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option.label}
                        onChange={(e) => {
                          const newOptions = [...(field.properties.options ?? [])];
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
                </div>
              )}
            </div>
          </PropertyGroup>
        </div>
      </div>
    </ScrollArea>
  );
};
