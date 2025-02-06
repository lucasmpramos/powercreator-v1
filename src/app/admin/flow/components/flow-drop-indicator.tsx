interface DropIndicatorProps {
  isTop?: boolean;
  isVisible: boolean;
}

export function DropIndicator({ isTop, isVisible }: DropIndicatorProps) {
  return (
    <div
      className={`
        absolute left-0 right-0 h-1 
        ${isTop ? 'top-0' : 'bottom-0'} 
        ${isVisible ? 'opacity-100' : 'opacity-0'} 
        transition-opacity duration-200
        bg-primary/50 rounded-full
        pointer-events-none
      `}
    >
      <div className="absolute left-2 right-2 h-full bg-primary rounded-full" />
    </div>
  );
} 