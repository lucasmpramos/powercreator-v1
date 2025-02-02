import { z } from "zod"

// Field types supported by the form builder
export const fieldTypes = [
  "text",
  "number",
  "email",
  "select",
  "multiselect",
  "date",
  "checkbox",
  "textarea",
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