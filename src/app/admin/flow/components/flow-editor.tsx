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
  Node,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { 
  Type, 
  AlignLeft,
  LucideIcon,
  PanelTop,
} from 'lucide-react';
import FlowPropertiesPanel from "./flow-properties-panel";
import { flowNodeTypes } from "./index";
import { CustomNodeData, FormElement } from "../types";
import { useForm, FormProvider } from 'react-hook-form';
import { FlowElementsPanel } from "./flow-elements-panel";

const flowElements: FormElement[] = [
  { 
    type: 'text', 
    label: 'Text Input', 
    icon: Type,
    defaultContent: 'Enter text...'
  },
  { 
    type: 'textarea', 
    label: 'Text Area', 
    icon: AlignLeft,
    defaultContent: 'Enter long text...'
  },
  { 
    type: 'container', 
    label: 'Container', 
    icon: PanelTop,
  },
];

export default function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onDragStart = (event: React.DragEvent<HTMLButtonElement>, element: FormElement) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(element));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const reactFlowBounds = document.querySelector('.react-flow-wrapper')?.getBoundingClientRect();
    if (!reactFlowBounds || !reactFlowInstance) return;

    try {
      const fieldData = JSON.parse(event.dataTransfer.getData('application/reactflow')) as FormElement;
      
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeId = `${fieldData.type}-${Date.now()}`;

      let newNode: Node;

      switch (fieldData.type) {
        case 'container':
          newNode = {
            id: nodeId,
            type: 'container',
            position,
            data: {
              label: fieldData.label,
              type: fieldData.type,
              properties: {
                title: fieldData.label,
                text: fieldData.label,
                width: 'full',
                padding: 'medium',
                margin: 'medium',
                isContainer: true,
              },
            } as CustomNodeData,
          };
          break;

        case 'text':
          newNode = {
            id: nodeId,
            type: 'text',
            position,
            data: {
              label: fieldData.label,
              type: fieldData.type,
              properties: {
                title: fieldData.label,
                placeholder: fieldData.defaultContent,
              },
            } as CustomNodeData,
          };
          break;

        case 'textarea':
          newNode = {
            id: nodeId,
            type: 'textarea',
            position,
            data: {
              label: fieldData.label,
              type: fieldData.type,
              properties: {
                title: fieldData.label,
                placeholder: fieldData.defaultContent,
              },
            } as CustomNodeData,
          };
          break;

        default:
          console.warn('Unknown node type:', fieldData.type);
          return;
      }

      setNodes((nds) => nds.concat(newNode));
      setSelectedNode(newNode);
    } catch (error) {
      console.error('Failed to parse drag data:', error instanceof Error ? error.message : String(error));
    }
  }, [reactFlowInstance, setNodes]);

  const onNodeUpdate = useCallback(
    (nodeData: Node) => {
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

  const methods = useForm();

  return (
    <div className="h-full">
      <ResizablePanelGroup 
        direction="horizontal" 
        className="h-full rounded-lg border bg-background"
      >
        <ResizablePanel defaultSize={20} minSize={15}>
          <FlowElementsPanel 
            elements={flowElements}
            onDragStart={onDragStart}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={60} minSize={50}>
          <div className="h-full react-flow-wrapper">
            <FormProvider {...methods}>
              <ReactFlow 
                style={{ height: '100%' }}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                nodeTypes={flowNodeTypes}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onInit={onInit}
                fitView
                fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
                defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
              >
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </FormProvider>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={20} minSize={15}>
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
    </div>
  );
} 