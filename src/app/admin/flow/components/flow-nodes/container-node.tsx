import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from "@/lib/utils";
import { Box } from 'lucide-react';
import { styles } from '../styles';
import { CustomNodeData, DraggedFieldData } from '../../types';
import { DroppableContainer } from '../droppable-container';
import { useState } from 'react';
import { useNodeLogic } from '../../hooks/useNodeLogic';

export function ContainerNode({ id, data, selected }: NodeProps<CustomNodeData>) {
  const [showDropIndicator, setShowDropIndicator] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const { nodeClass } = useNodeLogic({
    selected,
    baseClass: "cursor-pointer",
  });

  return (
    <div 
      className={nodeClass}
      data-node-id={id}
      data-node-type="container"
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className={styles.handle.base} 
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        className={styles.handle.base} 
      />
      <div 
        className={cn(
          "relative z-50 grid w-full gap-2 bg-background p-4 shadow-sm sm:rounded-lg border"
        )}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <Box className="h-4 w-4" />
          <span>{data.properties?.title ?? data.label}</span>
        </div>
        <DroppableContainer 
          isEmpty={isEmpty}
          showDropIndicator={showDropIndicator}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            setShowDropIndicator(true);
          }}
          onDrop={(e) => {
            e.preventDefault();
            const jsonData = e.dataTransfer.getData("application/json");
            if (jsonData) {
              try {
                const parsedData = JSON.parse(jsonData) as DraggedFieldData;
                console.log("Dropped data:", parsedData);
                setIsEmpty(false);
              } catch (err) {
                console.error("Failed to parse dropped data:", err);
              }
            }
            setShowDropIndicator(false);
            setIsEmpty(false);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setShowDropIndicator(false);
          }}
        >
          <div className="min-h-[100px] w-full rounded-md border-2 border-dashed p-4">
            <div className="text-sm text-muted-foreground">
              Drop elements here
            </div>
          </div>
        </DroppableContainer>
      </div>
      <Handle 
        type="source" 
        position={Position.Right} 
        className={styles.handle.base} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={styles.handle.base} 
      />
    </div>
  );
} 