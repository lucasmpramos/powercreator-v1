import { Node } from 'reactflow';
import { LucideIcon } from 'lucide-react';
import { ContainerNode } from '../components/flow-nodes/container-node';
import { TextInputNode } from '../components/flow-nodes/text-input-node';
import { TextAreaNode } from '../components/flow-nodes/textarea-node';

export interface FlowField {
  id: string;
  type: string;
  label: string;
  icon: LucideIcon;
  properties: {
    title?: string;
    text?: string;
    width?: 'full' | 'half' | 'third';
    padding?: 'small' | 'medium' | 'large';
    margin?: 'small' | 'medium' | 'large';
    variant?: 'default' | 'destructive' | 'outline';
    isContainer?: boolean;
  };
  draggable?: boolean;
  connectable?: boolean;
  elementType?: string;
  nodeChildNodes?: FlowField[];
  onChildSelect?: (childIndex: number | null) => void;
  onChildUpdate?: (childIndex: number, updates: Partial<FlowField>) => void;
  onChildNodesChange?: (updatedChildNodes: FlowField[]) => void;
}

export interface FlowNodeData {
  label: string;
  content?: string;
  draggable: boolean;
  connectable: boolean;
  elementType: string;
}

export type FlowNode = Node<FlowNodeData>;

export interface DraggedFieldData {
  type: string;
  label: string;
  icon?: LucideIcon;
  properties?: {
    title?: string;
    text?: string;
    width?: 'full' | 'half' | 'third';
    padding?: 'small' | 'medium' | 'large';
    margin?: 'small' | 'medium' | 'large';
    variant?: 'default' | 'destructive' | 'outline';
    isContainer?: boolean;
    placeholder?: string;
    helpText?: string;
    required?: boolean;
    validation?: string;
    alignment?: 'left' | 'center' | 'right';
    options?: { label: string; value: string }[];
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    [key: string]: string | number | boolean | undefined | { label: string; value: string }[];
  };
}

export type ContainerType = 'dialog' | 'card' | 'panel';

export interface CustomNodeData {
  label: string;
  type: string;
  properties: Record<string, string | number | boolean | undefined>;
}

export const flowNodeTypes = {
  container: ContainerNode,
  text: TextInputNode,
  textarea: TextAreaNode,
};

export interface FormElement {
  type: string;
  label: string;
  icon: LucideIcon;
  defaultContent?: string;
} 