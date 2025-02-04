import { ContainerNode } from './flow-nodes/container-node';
import { TextInputNode } from './flow-nodes/text-input-node';
import { TextAreaNode } from './flow-nodes/textarea-node';

// Export node types for the flow builder
export const flowNodeTypes = {
  container: ContainerNode,
  text: TextInputNode,
  textarea: TextAreaNode,
} as const;

// Export node components
export { ContainerNode } from './flow-nodes/container-node';
export { TextInputNode } from './flow-nodes/text-input-node';
export { TextAreaNode } from './flow-nodes/textarea-node'; 