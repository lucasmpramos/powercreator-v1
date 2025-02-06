import type { Field } from './form-builder';

export type FormDragType = 'form-template' | 'form-field';

export interface FormDragData {
  type: FormDragType;
  field: Field;
}

export type DragData = {
  current: FormDragData;
}; 