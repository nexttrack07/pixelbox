import { RefObject, useCallback, useEffect, useRef, useState } from "react";

type Position = { x: number; y: number };
type DragFn = ({ x, y }: Position) => void;

export function useDomEvent<T extends HTMLElement = HTMLDivElement>(
  ref: RefObject<T>,
  handlerFn: (e: any) => void,
  deps: any[] = []
) {
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const elem = ref.current;
    elem.addEventListener("mousedown", handlerFn);
    return () => {
      elem.removeEventListener("mousedown", handlerFn);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);
}

export function useDrag({
  onDrag = (x) => x,
  initialPosition = { x: 0, y: 0 },
}: {
  onDrag: DragFn;
  initialPosition: Position;
}) {
  const [moving, setMoving] = useState(false);
  const position = useRef<Position>(initialPosition);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setMoving(true);
  }, []);

  useDomEvent(elementRef, handleMouseDown);

  useEffect(() => {
    const handleMouseUp = () => {
      setMoving(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (moving) {
        const pos = position.current;

        position.current = {
          x: pos.x + e.movementX,
          y: pos.y + e.movementY,
        };
        onDrag(pos);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [moving, onDrag]);

  return {
    ref: elementRef,
    isMoving: moving,
  };
}
