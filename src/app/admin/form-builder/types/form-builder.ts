import { LucideIcon } from 'lucide-react';

export type FieldType = 'text' | 'textarea' | 'number' | 'email' | 'date' | 'file' | 'select' | 'radio' | 'checkbox';

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  icon: LucideIcon;
  properties: {
    placeholder?: string;
    helpText?: string;
    required?: boolean;
    validation?: string;
    width?: 'full' | '1/2' | '1/3' | '1/4' | '2/3' | '3/4';
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
      variant?: 'outline' | 'filled' | 'flushed';
      size?: 'small' | 'medium' | 'large';
      borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full';
    };
    labelStyle?: {
      size?: 'small' | 'medium' | 'large';
      weight?: 'normal' | 'medium' | 'bold';
    };
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