import { useMemo } from 'react';
import { cn } from "@/lib/utils";

interface UseNodeLogicProps {
  selected: boolean;
  baseClass?: string;
}

/**
 * A custom hook for shared node logic (e.g., selected styling, event handlers).
 * You can expand this with input validation, drag events, or other logic
 * common to multiple nodes.
 */
export function useNodeLogic({ selected, baseClass }: UseNodeLogicProps) {
  // Derive a className that includes a ring if the node is selected
  const nodeClass = useMemo(() => {
    return cn(
      baseClass,
      "relative group", // common for both container and text input
      selected && "ring-2 ring-primary ring-offset-2"
    );
  }, [selected, baseClass]);

  // If both nodes needed the same event handlers for input focus, drag, etc.,
  // you could add them here, e.g.:
  // const onSomeSharedEvent = useCallback(() => { ... }, []);
  //
  // return { nodeClass, onSomeSharedEvent };
  return { nodeClass };
} 