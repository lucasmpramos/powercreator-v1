import { NodeTypes } from 'reactflow';
import BaseNode from './flow-nodes/base-node';
import ContainerNode from './flow-nodes/container-node';
import ParagraphNode from './flow-nodes/paragraph-node';

export const nodeTypes: NodeTypes = {
  divNode: BaseNode,
  containerNode: ContainerNode,
  paragraphNode: ParagraphNode,
} as const; 