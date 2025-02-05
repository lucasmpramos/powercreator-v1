import { NodeTypes } from 'reactflow';
import divNode from './flow-nodes/base-node';
import containerNode from './flow-nodes/container-node';

export const nodeTypes: NodeTypes = {
  divNode: divNode,
  containerNode: containerNode,
}; 