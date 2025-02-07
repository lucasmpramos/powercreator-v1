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
import { Box, LayoutGrid, Type, Moon, LifeBuoy, Send } from 'lucide-react';
import FlowPropertiesPanel from "./flow-properties-panel";
import { CustomNodeData, FlowElement } from "../types/index";
import { FlowElementsPanel } from "./flow-elements-panel";
import { nodeTypes } from './flow-nodeTypes';
import { FlowDndProvider, isFlowElement } from '../context/dnd-context';
import { DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Button } from '@/components/ui/button';

const flowElements: FlowElement[] = [
  { 
    type: 'divNode',
    label: 'Node',
    icon: Box,
    defaultContent: 'New Node'
  },
  {
    type: 'containerNode',
    label: 'Container',
    icon: LayoutGrid,
    defaultContent: 'Container'
  },
  {
    type: 'paragraphNode',
    label: 'Paragraph',
    icon: Type,
    defaultContent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  }
];

export default function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [activeElement, setActiveElement] = useState<FlowElement | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback<NodeMouseHandler>((event: React.MouseEvent, node: Node<CustomNodeData>) => {
    setSelectedNode(node);
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

  const onDragStart = useCallback((event: DragStartEvent) => {
    const element = event.active.data.current;
    if (isFlowElement(element)) {
      setActiveElement(element);
    }
  }, []);

  const onDragEnd = useCallback((event: DragEndEvent) => {
    setActiveElement(null);
    
    const { active, over } = event;
    
    if (!reactFlowInstance || !active.data.current) return;
    
    const element = active.data.current;
    if (!isFlowElement(element)) return;

    // If dropped on a container node
    if (over && typeof over.id === 'string' && over.id.startsWith('droppable-')) {
      const containerId = over.id.replace('droppable-', '');
      const droppedNode: Node<CustomNodeData> = {
        id: `node-${Date.now()}`,
        type: element.type,
        position: { x: 0, y: 0 },
        data: {
          label: element.label,
          type: element.type,
          properties: {
            title: element.label,
            placeholder: element.defaultContent,
            isInsideContainer: true,
          },
        },
      };

      // Find the container node and add the dropped node as a child
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === containerId) {
            const container = document.querySelector(`[data-id="${containerId}"]`);
            if (!container) return node;

            const { top, height } = container.getBoundingClientRect();
            const dropY = event.activatorEvent instanceof MouseEvent ? event.activatorEvent.clientY : 0;
            const relativeY = dropY - top;
            const threshold = height * 0.15;

            const currentChildren = node.data.children ?? [];
            let newChildren = [...currentChildren];

            // If we're dropping at the top or bottom of the container
            if (relativeY < threshold) {
              newChildren = [droppedNode, ...currentChildren];
            } else if (relativeY > height - threshold) {
              newChildren = [...currentChildren, droppedNode];
            } else {
              // Check for in-between positions
              const childNodes = Array.from(container.querySelectorAll('[data-child-index]'));
              for (let i = 0; i < childNodes.length; i++) {
                const childNode = childNodes[i];
                const { top: childTop, height: childHeight } = childNode.getBoundingClientRect();
                const childCenter = childTop + childHeight / 2;

                if (dropY < childCenter) {
                  newChildren.splice(i, 0, droppedNode);
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      children: newChildren,
                    },
                  };
                }
              }
              // If we haven't found a spot, add it to the end
              newChildren.push(droppedNode);
            }

            return {
              ...node,
              data: {
                ...node.data,
                children: newChildren,
              },
            };
          }
          return node;
        })
      );
      return;
    }

    // If dropped on the canvas
    if (event.activatorEvent instanceof MouseEvent) {
      // Calculate drop position using the original rect and delta
      const rect = event.active.rect.current.initial;
      if (!rect) return;

      // Get the position in the ReactFlow coordinate system
      const position = reactFlowInstance.screenToFlowPosition({
        x: rect.left + event.delta.x,
        y: rect.top + event.delta.y,
      });

      // Create and add the new node at the exact drop position
      const newNode = createNode(element, position);
      setNodes((nds) => nds.concat(newNode));
      setSelectedNode(newNode);
    }
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
    <FlowDndProvider onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="h-full w-full overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border">
          {/* Left Panel - Flow Elements */}
          <ResizablePanel defaultSize={20} className="overflow-hidden">
            <FlowElementsPanel elements={flowElements} />
          </ResizablePanel>

          <ResizableHandle />

          {/* Center Panel - Flow Editor */}
          <ResizablePanel defaultSize={60} className="overflow-hidden">
            <div className="h-full w-full relative">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
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
          <ResizablePanel defaultSize={20} className="overflow-hidden">
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

        <DragOverlay dropAnimation={null}>
          {activeElement && (
            <Button
              variant="outline"
              className="justify-start cursor-grabbing"
            >
              <activeElement.icon className="mr-2 h-4 w-4" />
              {activeElement.label}
            </Button>
          )}
        </DragOverlay>
      </div>
    </FlowDndProvider>
  );
} 