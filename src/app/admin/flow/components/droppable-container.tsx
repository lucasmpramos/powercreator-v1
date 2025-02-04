import { cn } from "@/lib/utils";
import { styles } from './styles';
import React from 'react';

interface DroppableContainerProps {
  children: React.ReactNode;
  isEmpty: boolean;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  showDropIndicator: boolean;
  className?: string;
}

export function DroppableContainer({
  children,
  isEmpty,
  onDragOver,
  onDrop,
  onDragLeave,
  showDropIndicator,
  className,
}: DroppableContainerProps): JSX.Element {
  const dropZoneClasses = cn(
    styles.dropZone.base,
    isEmpty && styles.dropZone.empty,
    showDropIndicator && isEmpty && styles.dropZone.active,
    className
  );

  return (
    <div 
      className={dropZoneClasses}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
    >
      {isEmpty ? (
        <div className={styles.text.placeholder}>
          Drop elements here
        </div>
      ) : (
        <div className={styles.dropZone.spacing}>
          {children}
        </div>
      )}
    </div>
  );
} 