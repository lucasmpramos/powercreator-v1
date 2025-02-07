import { LucideIcon } from 'lucide-react';
import { Node, NodeProps as ReactFlowNodeProps } from 'reactflow';

export interface FlowElement {
  type: string;
  label: string;
  icon: LucideIcon;
  defaultContent?: string;
}

export interface NodeProperties {
  // Common HTML/CSS properties
  title?: string;
  placeholder?: string;
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  border?: string;
  borderRadius?: string;
  display?: 'block' | 'flex' | 'grid' | 'none';
  flexDirection?: 'row' | 'column';
  gap?: string;
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
  
  // Node type specific flags
  isContainer?: boolean;
  isInsideContainer?: boolean;
  
  // Text specific properties
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  textColor?: 'default' | 'muted' | 'primary';
  fontWeight?: 'normal' | 'medium' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  
  // Visual feedback
  showBackground?: boolean;
}

export interface CustomNodeData {
  label: string;
  type: string;
  properties: NodeProperties;
  children?: Node<CustomNodeData>[];
  onChildAdd?: (containerId: string, child: Node<CustomNodeData>) => void;
  onChildUpdate?: (containerId: string, childId: string, updates: Partial<Node<CustomNodeData>>) => void;
}

export interface NodeProps extends ReactFlowNodeProps<CustomNodeData> {
  onClick?: (event: React.MouseEvent, node: Node<CustomNodeData>) => void;
  onChildUpdate?: (childId: string, updates: Partial<Node<CustomNodeData>>) => void;
  onChildClick?: (event: React.MouseEvent, node: Node<CustomNodeData>) => void;
} 