import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface Field {
  id: string;
  type: string;
  label: string;
  icon: LucideIcon;
  preview?: ReactNode;
  onSelect?: () => void;
  onChildSelect?: (index: number | null) => void;
  onChildUpdate?: (index: number, updates: Partial<Field>) => void;
  onChildNodesChange?: (nodes: Field[]) => void;
  childNodes?: Field[];
  properties: {
    placeholder?: string;
    helpText?: string;
    required?: boolean;
    validation?: string;
    width?: string;
    alignment?: 'left' | 'center' | 'right';
    padding?: 'none' | 'small' | 'medium' | 'large';
    margin?: 'none' | 'small' | 'medium' | 'large';
    options?: { label: string; value: string }[];
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    group?: string;
    isGroupHeader?: boolean;
    inputStyle?: {
      size?: 'small' | 'medium' | 'large';
    };
    title?: string;
    text?: string;
    isContainer?: boolean;
    label?: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  };
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: Field[];
}

export interface FormBuilderData {
  id: string;
  name: string;
  description?: string;
  steps: FormStep[];
} 