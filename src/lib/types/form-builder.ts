import { z } from "zod"
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

// Field types supported by the form builder
export const fieldTypes = [
  'input',
  'textarea',
  'select',
  'checkbox',
  'radio',
  'button',
  'heading',
  'paragraph',
] as const

export type FieldType = typeof fieldTypes[number]

export const formFieldSchema = z.object({
  id: z.string(),
  type: z.enum(fieldTypes),
  label: z.string(),
  name: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  options: z.array(z.object({
    label: z.string(),
    value: z.string()
  })).optional(),
  validation: z.object({
    type: z.enum(["string", "number", "date", "boolean", "array"]),
    rules: z.array(z.object({
      type: z.enum(["required", "min", "max", "email", "regex"]),
      value: z.union([z.string(), z.number()]).optional(),
      message: z.string()
    }))
  }).optional(),
  dependsOn: z.object({
    field: z.string(),
    operator: z.enum(["equals", "notEquals", "contains", "notContains"]),
    value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
  }).optional()
})

export const formStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  fields: z.array(formFieldSchema)
})

export const formBuilderSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  steps: z.array(formStepSchema),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export type FormField = z.infer<typeof formFieldSchema>
export type FormStep = z.infer<typeof formStepSchema>
export type FormBuilderData = z.infer<typeof formBuilderSchema>

export type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"

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
    variant?: ButtonVariant;
  };
} 