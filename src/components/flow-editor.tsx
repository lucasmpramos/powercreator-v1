import { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
    className: 'bg-background border-border shadow-sm'
  },
];

const initialEdges: Edge[] = [];

export function FlowEditor() {
  const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <Card className="w-full h-[600px] p-4">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        className={cn(
          "bg-background rounded-md",
          "border border-border"
        )}
        fitView
      >
        <Controls className="bg-card border border-border shadow-sm" />
        <MiniMap className="bg-card border border-border shadow-sm" />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={12} 
          size={1}
          className="bg-background"
        />
      </ReactFlow>
    </Card>
  );
} 