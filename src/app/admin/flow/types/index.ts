import { LucideIcon } from 'lucide-react';
import { Node } from 'reactflow';

export interface FlowElement {
  type: string;
  label: string;
  icon: LucideIcon;
  defaultContent?: string;
}

export interface CustomNodeData {
  label: string;
  type: string;
  properties: {
    title?: string;
    placeholder?: string;
    width?: string;
    padding?: string;
    margin?: string;
    isContainer?: boolean;
  };
  children?: Node<CustomNodeData>[];
  onChildAdd?: (containerId: string, child: Node<CustomNodeData>) => void;
} 