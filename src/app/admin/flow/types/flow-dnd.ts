import { FlowElement } from './index';

export interface FlowDragData {
  type: 'flowElement';
  element: FlowElement;
}

interface DragData {
  current: FlowDragData;
}

export interface FlowDragStartEvent {
  active: {
    id: string;
    data: DragData;
  };
  type: 'dragStart';
}

export interface FlowDragEndEvent {
  active: {
    id: string;
    data: DragData;
  };
  over: {
    id: string;
  } | null;
  type: 'dragEnd';
  delta: {
    x: number;
    y: number;
  };
} 