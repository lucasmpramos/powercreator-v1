import { useCallback, useState, useRef, useEffect, memo, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  NodeTypes,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FormInput, 
  Type, 
  ListChecks, 
  AlignLeft,
  Calendar,
  Upload,
  Radio,
  CheckSquare,
  FileInput,
  Mail,
  LucideIcon,
  LayoutPanelTop,
  Heading1,
  Heading2,
  Heading3,
  Square,
  MessageSquare,
  PanelTop,
  Text as TextIcon,
  CirclePlay as ButtonIcon,
} from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { PropertiesPanel } from "@/components/properties-panel";
import { Field } from "@/types/form-builder";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Map of field types to their icons
const iconMap: Record<string, LucideIcon> = {
  text: Type,
  textarea: AlignLeft,
  number: ListChecks,
  email: Mail,
  date: Calendar,
  file: Upload,
  select: FileInput,
  radio: Radio,
  checkbox: CheckSquare,
  // UI Components
  dialog: MessageSquare,
  card: Square,
  panel: PanelTop,
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  paragraph: TextIcon,
  button: ButtonIcon,
};

// Field Categories for better organization
const fieldCategories = [
  {
    name: "UI Components",
    fields: [
      { 
        id: 'ui-dialog', 
        type: 'dialog', 
        label: 'Dialog Box', 
        icon: MessageSquare, 
        properties: {
          title: 'Dialog Title',
          width: 'md',
          isContainer: true,
        },
        preview: (
          <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center pointer-events-none opacity-50">
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
            <div className="fixed z-50 grid w-full gap-4 bg-background p-6 shadow-lg sm:max-w-lg sm:rounded-lg border">
              <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                <h2 className="text-lg font-semibold leading-none tracking-tight">
                  Dialog Title
                </h2>
              </div>
            </div>
          </div>
        )
      },
      { 
        id: 'ui-card', 
        type: 'card', 
        label: 'Card', 
        icon: Square, 
        properties: {
          title: 'Card Title',
          width: 'full',
          isContainer: true,
        },
        preview: (
          <Card className="p-4 w-full pointer-events-none opacity-50">
            <h3 className="font-semibold">Card Title</h3>
          </Card>
        )
      },
      { 
        id: 'ui-panel', 
        type: 'panel', 
        label: 'Panel', 
        icon: PanelTop, 
        properties: {
          title: 'Panel Title',
          width: 'full',
          isContainer: true,
        },
        preview: (
          <div className="border rounded-lg p-4 w-full pointer-events-none opacity-50">
            <h3 className="font-semibold">Panel Title</h3>
          </div>
        )
      },
    ]
  },
  {
    name: "Typography",
    fields: [
      { 
        id: 'ui-h1', 
        type: 'h1', 
        label: 'Heading 1', 
        icon: Heading1, 
        properties: {
          text: 'Heading 1',
          alignment: 'left',
        },
        preview: <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Heading 1</h1>
      },
      { 
        id: 'ui-h2', 
        type: 'h2', 
        label: 'Heading 2', 
        icon: Heading2, 
        properties: {
          text: 'Heading 2',
          alignment: 'left',
        },
        preview: <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">Heading 2</h2>
      },
      { 
        id: 'ui-h3', 
        type: 'h3', 
        label: 'Heading 3', 
        icon: Heading3, 
        properties: {
          text: 'Heading 3',
          alignment: 'left',
        },
        preview: <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Heading 3</h3>
      },
      { 
        id: 'ui-paragraph', 
        type: 'paragraph', 
        label: 'Paragraph', 
        icon: TextIcon, 
        properties: {
          text: 'Enter your text here',
          alignment: 'left',
        },
      },
      { 
        id: 'ui-button', 
        type: 'button', 
        label: 'Button', 
        icon: ButtonIcon, 
        properties: {
          text: 'Button',
          variant: 'default',
        },
      },
    ]
  },
  {
    name: "Form Elements",
    fields: [
      { 
        id: 'field-text', 
        type: 'text', 
        label: 'Text Input', 
        icon: Type, 
        properties: {
          label: 'Text Input',
          placeholder: 'Enter text...',
        },
        preview: (
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Text Input</Label>
            <Input type="text" placeholder="Enter text..." disabled />
          </div>
        )
      },
      { 
        id: 'field-textarea', 
        type: 'textarea', 
        label: 'Text Area', 
        icon: AlignLeft, 
        properties: {
          label: 'Text Area',
          placeholder: 'Enter text...',
        },
        preview: (
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Text Area</Label>
            <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" placeholder="Enter text..." disabled />
          </div>
        )
      },
    ]
  },
] as const;

interface EditableElementProps {
  content: React.ReactNode;
  defaultText: string;
  text?: string;
  onUpdate: (text: string) => void;
}

// Memoize the EditableElement component
const EditableElement = memo(({ content, defaultText, text: initialText, onUpdate }: EditableElementProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText || defaultText);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    onUpdate(text);
  }, [text, onUpdate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onUpdate(text);
    }
  }, [text, onUpdate]);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary"
      />
    );
  }

  return (
    <div onDoubleClick={() => setIsEditing(true)}>
      {content}
    </div>
  );
});
EditableElement.displayName = 'EditableElement';

interface DroppableContainerProps {
  children: React.ReactNode;
  isEmpty: boolean;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
  onDragLeave: (event: React.DragEvent) => void;
  showDropIndicator: boolean;
  className?: string;
}

// Extracted common styles
const styles = {
  dropZone: {
    base: "min-h-[100px] rounded-lg transition-all relative",
    empty: "border-2 border-dashed border-gray-200",
    active: "border-primary",
    invalid: "!border-2 !border-red-500 !bg-red-100/50 !border-dashed",
    spacing: "space-y-8",
  },
  handle: {
    base: "w-2 h-2 opacity-0 group-hover:opacity-100",
  },
  dropIndicator: {
    base: "h-1 bg-primary/50 rounded-full my-2 absolute left-0 right-0 z-10",
    top: "-top-3",
    bottom: "-bottom-3",
  },
  container: {
    dialog: "relative z-50 grid w-full gap-4 bg-background p-6 shadow-lg sm:max-w-lg sm:rounded-lg border",
    card: "p-4 w-full",
    panel: "border rounded-lg p-4 w-full",
  },
  heading: {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  },
  input: {
    base: "w-full max-w-sm",
    textarea: "flex min-h-[80px] w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
  },
  text: {
    paragraph: "leading-7 [&:not(:first-child)]:mt-6",
    placeholder: "text-sm text-muted-foreground text-center p-4",
  },
  selected: "ring-2 ring-primary ring-offset-2 rounded-sm",
} as const;

// Add isContainer helper
const isContainer = (type: string) => ['dialog', 'card', 'panel'].includes(type);

// Memoize the DroppableContainer component
const DroppableContainer = memo(({
  children,
  isEmpty,
  onDragOver,
  onDrop,
  onDragLeave,
  showDropIndicator,
  isInvalidDrop,
  className,
}: DroppableContainerProps & { isInvalidDrop?: boolean }) => (
  <div 
    className={cn(
      styles.dropZone.base,
      isEmpty && styles.dropZone.empty,
      showDropIndicator && isEmpty && !isInvalidDrop && styles.dropZone.active,
      isInvalidDrop && styles.dropZone.invalid,
      className
    )}
    onDragOver={onDragOver}
    onDrop={onDrop}
    onDragLeave={onDragLeave}
  >
    {isEmpty ? (
      <div className={cn(
        styles.text.placeholder,
        isInvalidDrop && "text-red-500 font-medium"
      )}>
        {isInvalidDrop ? "Cannot drop container elements inside containers" : "Drop elements here"}
      </div>
    ) : (
      <div className={cn(
        styles.dropZone.spacing,
        isInvalidDrop && "opacity-50"
      )}>
        {children}
      </div>
    )}
  </div>
));
DroppableContainer.displayName = 'DroppableContainer';

// Helper component for connection handles
interface HandleGroupProps {
  type: 'dialog' | 'default';
}

// Memoize the HandleGroup component
const HandleGroup = memo(({ type }: HandleGroupProps) => {
  if (type === 'dialog') {
    return (
      <>
        <Handle 
          type="target" 
          position={Position.Left} 
          className={styles.handle.base} 
        />
        <Handle 
          type="source" 
          position={Position.Right} 
          className={styles.handle.base} 
        />
      </>
    );
  }

  return (
    <>
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
    </>
  );
});
HandleGroup.displayName = 'HandleGroup';

// Custom Node Types
const FormFieldNode = memo(({ data }: { data: Field }) => {
  const [childNodes, setChildNodes] = useState<Field[]>([]);
  const [dropTarget, setDropTarget] = useState<{ index: number; position: 'top' | 'bottom' } | null>(null);
  const [selectedChildIndex, setSelectedChildIndex] = useState<number | null>(null);
  const [isInvalidDrop, setIsInvalidDrop] = useState(false);
  
  const onContainerDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const dragData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      // Check if trying to drop a container inside a container
      if (isContainer(data.type) && isContainer(dragData.type)) {
        event.dataTransfer.dropEffect = 'none';
        setIsInvalidDrop(true);
        return;
      }
      
      event.dataTransfer.dropEffect = 'move';
      setIsInvalidDrop(false);

      const container = event.currentTarget as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const relativeY = event.clientY - containerRect.top;

      if (childNodes.length === 0) {
        setDropTarget({ index: 0, position: 'top' });
        return;
      }

      const children = Array.from(container.getElementsByClassName('form-builder-child'));
      
      // If we're above the first element
      const firstChild = children[0];
      const firstChildRect = firstChild.getBoundingClientRect();
      const firstChildTop = firstChildRect.top - containerRect.top;
      if (relativeY < firstChildTop) {
        setDropTarget({ index: 0, position: 'top' });
        return;
      }

      // If we're below the last element
      const lastChild = children[children.length - 1];
      const lastChildRect = lastChild.getBoundingClientRect();
      const lastChildBottom = lastChildRect.bottom - containerRect.top;
      if (relativeY > lastChildBottom) {
        setDropTarget({ index: children.length - 1, position: 'bottom' });
        return;
      }

      // Check each element and the space between elements
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const childRect = child.getBoundingClientRect();
        const childTop = childRect.top - containerRect.top;
        const childBottom = childRect.bottom - containerRect.top;
        
        // If we're directly over an element
        if (relativeY >= childTop && relativeY <= childBottom) {
          const midPoint = childTop + (childRect.height / 2);
          setDropTarget({ 
            index: i, 
            position: relativeY < midPoint ? 'top' : 'bottom' 
          });
          return;
        }
        
        // If we're between this element and the next one
        if (i < children.length - 1) {
          const nextChild = children[i + 1];
          const nextChildRect = nextChild.getBoundingClientRect();
          const nextChildTop = nextChildRect.top - containerRect.top;
          
          if (relativeY > childBottom && relativeY < nextChildTop) {
            setDropTarget({ index: i, position: 'bottom' });
            return;
          }
        }
      }
    } catch (error) {
      console.error('Failed to parse drag data:', error);
    }
  }, [childNodes.length, data.type]);

  const onDropToContainer = useCallback((event: React.DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
    
    try {
      const fieldData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      
      // Prevent dropping containers inside containers
      if (isContainer(data.type) && isContainer(fieldData.type)) {
        setIsInvalidDrop(false);
        return;
      }

      const newNode = { ...fieldData, icon: iconMap[fieldData.type] };
      
      setChildNodes(prev => {
        if (dropTarget) {
          const newNodes = [...prev];
          const insertIndex = dropTarget.position === 'bottom' ? dropTarget.index + 1 : dropTarget.index;
          newNodes.splice(insertIndex, 0, newNode);
          return newNodes;
        }
        return [...prev, newNode];
      });
      
      setDropTarget(null);
      setIsInvalidDrop(false);
    } catch (error) {
      console.error('Failed to parse dropped data:', error);
    }
  }, [dropTarget, data.type]);

  const wrapWithHandles = useCallback((content: React.ReactNode, type: string) => (
    <div className="relative group">
      <HandleGroup type={type === 'dialog' ? 'dialog' : 'default'} />
      {content}
    </div>
  ), []);

  const renderEditableContent = useCallback((content: React.ReactNode, defaultText: string, field: Field) => (
    <EditableElement
      content={content}
      defaultText={defaultText}
      text={field.properties.text}
      onUpdate={(newText) => {
        if (selectedChildIndex !== null) {
          data.onChildUpdate?.(selectedChildIndex, {
            properties: { ...field.properties, text: newText }
          });
        }
      }}
    />
  ), [selectedChildIndex, data.onChildUpdate]);

  // Memoize common handlers
  const commonDropHandlers = useMemo(() => ({
    onDragOver: onContainerDragOver,
    onDrop: onDropToContainer,
    onDragLeave: (e: React.DragEvent) => {
      const container = e.currentTarget as HTMLElement;
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      if (!relatedTarget || !container.contains(relatedTarget)) {
        setDropTarget(null);
        setIsInvalidDrop(false);
      }
    }
  }), [onContainerDragOver, onDropToContainer]);

  // Memoize preview components map
  const previewComponents = useMemo(() => ({
    dialog: (field) => wrapWithHandles(
      <div className={styles.container.dialog}>
        <DroppableContainer
          isEmpty={childNodes.length === 0}
          showDropIndicator={!!dropTarget}
          isInvalidDrop={isInvalidDrop}
          {...commonDropHandlers}
        >
          {renderChildren()}
        </DroppableContainer>
      </div>
    , 'dialog'),

    card: (field) => wrapWithHandles(
      <Card className={styles.container.card}>
        <DroppableContainer
          isEmpty={childNodes.length === 0}
          showDropIndicator={!!dropTarget}
          isInvalidDrop={isInvalidDrop}
          {...commonDropHandlers}
        >
          {renderChildren()}
        </DroppableContainer>
      </Card>
    , 'card'),

    panel: (field) => wrapWithHandles(
      <div className={styles.container.panel}>
        <DroppableContainer
          isEmpty={childNodes.length === 0}
          showDropIndicator={!!dropTarget}
          isInvalidDrop={isInvalidDrop}
          {...commonDropHandlers}
        >
          {renderChildren()}
        </DroppableContainer>
      </div>
    , 'panel'),

    h1: (field) => renderEditableContent(
      <h1 className={styles.heading.h1}>
        {field.properties.text || 'Heading 1'}
      </h1>,
      'Heading 1',
      field
    ),

    h2: (field) => renderEditableContent(
      <h2 className={styles.heading.h2}>
        {field.properties.text || 'Heading 2'}
      </h2>,
      'Heading 2',
      field
    ),

    h3: (field) => renderEditableContent(
      <h3 className={styles.heading.h3}>
        {field.properties.text || 'Heading 3'}
      </h3>,
      'Heading 3',
      field
    ),

    text: (field) => renderEditableContent(
      <Input 
        type="text" 
        placeholder={field.properties.placeholder || "Enter text..."} 
        className={styles.input.base}
      />,
      'Enter text...',
      field
    ),

    textarea: (field) => renderEditableContent(
      <textarea 
        className={styles.input.textarea}
        placeholder={field.properties.placeholder || "Enter text..."} 
      />,
      'Enter text...',
      field
    ),

    paragraph: (field) => renderEditableContent(
      <p className={styles.text.paragraph}>
        {field.properties.text || 'Enter your text here'}
      </p>,
      'Enter your text here',
      field
    ),

    button: (field) => renderEditableContent(
      <Button variant={field.properties.variant || 'default'}>
        {field.properties.text || 'Button'}
      </Button>,
      'Button',
      field
    ),
  }), [childNodes, dropTarget, isInvalidDrop, commonDropHandlers, wrapWithHandles, renderEditableContent]);

  const renderPreview = useCallback((field: Field, isChild: boolean = false) => {
    const previewComponent = previewComponents[field.type];
    if (previewComponent) {
      return previewComponent(field, isChild);
    }

    return (
      <div className="p-4 border rounded-md">
        <span className="text-sm text-muted-foreground">
          Preview not available
        </span>
      </div>
    );
  }, [previewComponents]);

  const renderChildren = useCallback(() => {
    if (childNodes.length === 0) return null;

    return (
      <div className={styles.dropZone.spacing}>
        {childNodes.map((child, index) => (
          <div key={`${child.type}-${index}`} className="relative">
            {dropTarget?.index === index && dropTarget.position === 'top' && (
              <div className={cn(styles.dropIndicator.base, styles.dropIndicator.top)} />
            )}
            <div 
              className={cn(
                "form-builder-child relative transition-all",
                selectedChildIndex === index && styles.selected
              )}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedChildIndex(index);
                data.onChildSelect?.(index);
              }}
            >
              {renderPreview({ ...child, icon: iconMap[child.type] }, true)}
            </div>
            {dropTarget?.index === index && dropTarget.position === 'bottom' && (
              <div className={cn(styles.dropIndicator.base, styles.dropIndicator.bottom)} />
            )}
          </div>
        ))}
      </div>
    );
  }, [childNodes, dropTarget, selectedChildIndex, data.onChildSelect, renderPreview]);

  return (
    <div className="relative group">
      {renderPreview(data, false)}
    </div>
  );
});
FormFieldNode.displayName = 'FormFieldNode';

const nodeTypes: NodeTypes = {
  formField: FormFieldNode,
};

export function VisualFormBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedChild, setSelectedChild] = useState<{ nodeId: string; childIndex: number } | null>(null);

  // Memoize callbacks
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds));
    },
    [setEdges],
  );

  const onDragStart = useCallback((event: React.DragEvent, field: Field) => {
    const fieldData = {
      ...field,
      icon: undefined,
    };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(fieldData));
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = document.querySelector('.react-flow-wrapper')?.getBoundingClientRect();
      const fieldData = JSON.parse(event.dataTransfer.getData('application/reactflow'));

      if (!reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${fieldData.type}-${Math.random()}`,
        type: 'formField',
        position,
        data: {
          ...fieldData,
          icon: iconMap[fieldData.type],
          childNodes: [], // Initialize empty childNodes array
          onChildSelect: (childIndex: number) => {
            setSelectedChild({ nodeId: newNode.id, childIndex });
            setSelectedNode(null);
          },
          onChildUpdate: (childIndex: number, updates: Partial<Field>) => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === newNode.id
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        childNodes: (node.data.childNodes || []).map((child: Field, idx: number) =>
                          idx === childIndex ? { ...child, ...updates } : child
                        ),
                      },
                    }
                  : node
              )
            );
          },
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setSelectedChild(null);
  }, []);

  const getSelectedField = useCallback(() => {
    if (selectedChild && selectedNode) {
      const node = nodes.find(n => n.id === selectedChild.nodeId);
      if (node && node.data.childNodes) {
        return node.data.childNodes[selectedChild.childIndex];
      }
    }
    return selectedNode?.data;
  }, [selectedNode, selectedChild, nodes]);

  const onFieldUpdate = useCallback((updates: Partial<Field>) => {
    if (selectedChild) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedChild.nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  childNodes: node.data.childNodes.map((child: Field, idx: number) =>
                    idx === selectedChild.childIndex ? { ...child, ...updates } : child
                  ),
                },
              }
            : node
        )
      );
    } else if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, ...updates } }
            : node
        )
      );
    }
  }, [selectedNode, selectedChild, setNodes]);

  // Memoize field categories rendering
  const renderFieldCategories = useMemo(() => (
    fieldCategories.map((category) => (
      <div key={category.name} className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {category.name}
        </h3>
        <div className="space-y-2">
          {category.fields.map((field) => (
            <div
              key={field.id}
              draggable
              onDragStart={(e) => onDragStart(e, field)}
              className="touch-none"
            >
              <Button
                variant="outline"
                className="w-full justify-start"
              >
                <field.icon className="mr-2 h-4 w-4" />
                {field.label}
              </Button>
            </div>
          ))}
        </div>
      </div>
    ))
  ), [onDragStart]);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border">
      <ResizablePanel defaultSize={20}>
        <Card className="h-full rounded-none border-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {renderFieldCategories}
            </div>
          </ScrollArea>
        </Card>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={60}>
        <div className="h-full react-flow-wrapper">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={() => {}}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            className={cn(
              "bg-background rounded-md",
              "border-0"
            )}
            fitView
          >
            <Controls className="bg-card border border-border shadow-sm" />
            <MiniMap className="bg-card border border-border shadow-sm" />
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={12} 
              size={1}
              className="bg-background"
            />
          </ReactFlow>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={20}>
        <Card className="h-full rounded-none border-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <PropertiesPanel 
                field={getSelectedField()} 
                onUpdate={onFieldUpdate}
              />
            </div>
          </ScrollArea>
        </Card>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
} 