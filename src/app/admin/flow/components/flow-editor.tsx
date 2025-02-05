import { useCallback, useState } from 'react';
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ReactFlowInstance,
  Node,
  NodeMouseHandler,
  XYPosition,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Box, LayoutGrid } from 'lucide-react';
import FlowPropertiesPanel from "./flow-properties-panel";
import { CustomNodeData, FlowElement } from "../types/index";
import { FlowElementsPanel } from "./flow-elements-panel";
import { nodeTypes } from './flow-nodeTypes';

const flowElements: FlowElement[] = [
  { 
    type: 'shadcnNode',
    label: 'Node',
    icon: Box,
    defaultContent: 'New Node'
  },
  {
    type: 'containerNode',
    label: 'Container',
    icon: LayoutGrid,
    defaultContent: 'Container'
  }
];

export default function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback<NodeMouseHandler>((event: React.MouseEvent, node: Node<CustomNodeData>) => {
    setSelectedNode(node);
  }, []);

  const onDragStart = (event: React.DragEvent<HTMLButtonElement>, element: FlowElement) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(element));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const createNode = useCallback((element: FlowElement, position: XYPosition): Node<CustomNodeData> => {
    return {
      id: `node-${Date.now()}`,
      type: element.type,
      position,
      data: {
        label: element.label,
        type: element.type,
        properties: {
          title: element.label,
          placeholder: element.defaultContent,
          isContainer: element.type === 'containerNode',
        },
        children: [],
        onChildAdd: (containerId: string, droppedElement: Node<CustomNodeData>) => {
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === containerId) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    children: [...(node.data.children ?? []), droppedElement],
                  },
                };
              }
              return node;
            })
          );
        },
      },
    };
  }, [setNodes]);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!reactFlowInstance) return;

    const element = JSON.parse(
      event.dataTransfer.getData('application/reactflow')
    ) as FlowElement;

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode = createNode(element, position);
    setNodes((nds) => nds.concat(newNode));
    setSelectedNode(newNode);
  }, [reactFlowInstance, setNodes, createNode]);

  const onNodeUpdate = useCallback(
    (nodeData: Node<CustomNodeData>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeData.id) {
            if (selectedNode?.id === node.id) {
              setSelectedNode(nodeData);
            }
            return nodeData;
          }
          return node;
        }),
      );
    },
    [setNodes, selectedNode],
  );

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[800px] rounded-lg border">
      {/* Left Panel - Flow Elements */}
      <ResizablePanel defaultSize={20}>
        <FlowElementsPanel elements={flowElements} onDragStart={onDragStart} />
      </ResizablePanel>

      <ResizableHandle />

      {/* Center Panel - Flow Editor */}
      <ResizablePanel defaultSize={60}>
        <div className="h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onInit={setReactFlowInstance}
            fitView
            className="!bg-transparent"
            nodesDraggable={true}
            nodesConnectable={false}
            elementsSelectable={true}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            <Controls />
            <MiniMap 
              nodeStrokeWidth={3}
              nodeColor="#aaa"
            />
          </ReactFlow>
        </div>
      </ResizablePanel>

      <ResizableHandle />

      {/* Right Panel - Properties */}
      <ResizablePanel defaultSize={20}>
        <Card className="h-full rounded-none border-0">
          <div className="flex flex-col h-full">
            <div className="flex-none p-4 pb-2">
              <h3 className="font-medium">Properties</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="px-4 pb-4">
                <FlowPropertiesPanel 
                  field={selectedNode}
                  onUpdate={onNodeUpdate}
                />
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(selectedNode, null, 2)}
                </pre>
              </div>
            </ScrollArea>
          </div>
        </Card>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
} 