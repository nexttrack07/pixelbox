import { useEventListener } from "hooks";
import {
  useRef,
  useState,
  MouseEvent as ReactMouseEvent,
  useCallback,
  RefObject,
} from "react";
import { Rotate } from "tabler-icons-react";

type Status =
  | "idle"
  | "rotating"
  | "moving"
  | "resizing-br"
  | "resizing-tl"
  | "resizing-bl"
  | "resizing-tr";
export type Position = { x: number; y: number };
export type Dimension = { width: number; height: number };
type MoveableProps = {
  onDrag: (p: Position) => void;
  onRotate: (r: number) => void;
  onResize: (d: Dimension) => void;
  styleProps: {
    height: number;
    width: number;
    top: number;
    left: number;
    rotation: number;
  };
};

export function Moveable({
  onDrag,
  onResize,
  onRotate,
  styleProps: { rotation, ...styles },
}: MoveableProps) {
  const documentRef = useRef<Document>(document);
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  const handleMouseUp = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setStatus("idle");
  }, []);

  const handleDragMouseDown = useCallback((e: ReactMouseEvent) => {
    e.stopPropagation();
    setStatus("moving");
  }, []);

  const handleRotateMouseDown = useCallback((e: ReactMouseEvent) => {
    e.stopPropagation();
    setStatus("rotating");
  }, []);

  const handleResizeMouseDown = (e: ReactMouseEvent, stat: Status) => {
    e.stopPropagation();
    setStatus(stat);
  };

  function getDegrees(mouseX: number, mouseY: number, ref: RefObject<HTMLDivElement>) {
    if (!ref.current) return 0;

    const rect = ref.current.getBoundingClientRect();
    const rectX = rect.left + rect.width / 2;
    const rectY = rect.top + rect.height / 2;
    const angle = Math.atan2(mouseY - rectY, mouseX - rectX) + Math.PI / 2;
    return Math.round((angle * 180) / Math.PI);
  }
  const handleMouseMove = (e: MouseEvent) => {
    e.stopPropagation();
    if (status === "moving") {
      if (!ref.current) return;

      onDrag({ x: e.movementX, y: e.movementY });
    } else if (status === "rotating") {
      if (!ref.current) return;
      const r = getDegrees(e.clientX, e.clientY, ref);
      onRotate(r);
    } else if (status === "resizing-br") {
      if (!ref.current) return;

      const width = e.movementX
      const height = e.movementY

      onResize({ width, height });
    } else if (status === "resizing-tl") {
      const width = -e.movementX
      const height = -e.movementY
      const x = e.movementX
      const y = e.movementY

      onDrag({ x, y });
      onResize({ width, height });
    } else if (status === "resizing-bl") {
      const width = -e.movementX
      const height = e.movementY
      const y = 0
      const x = e.movementX

      onDrag({ x, y });
      onResize({ width, height });
    } else if (status === "resizing-tr") {
      const width = e.movementX
      const height = -e.movementY
      const x = 0
      const y = e.movementY

      onDrag({ x, y });
      onResize({ width, height });
    }
  };


  useEventListener("mouseup", handleMouseUp, documentRef);
  useEventListener("mousemove", handleMouseMove, documentRef, [status, ref]);

  return (
    <div
      style={{
        position: "absolute",
        left: styles.left,
        top: styles.top,
        height: styles.height,
        width: styles.width,
        userSelect: "none",
      }}
      id="moveable"
      onMouseDown={handleDragMouseDown}
      ref={ref}
    >
      <div
        style={{
          position: "absolute",
          border: "2px dashed #0f65d6",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          transform: "scale(1.05)",
        }}
      >
        <div
          onMouseDown={handleRotateMouseDown}
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            top: "-40px",
            position: "absolute",
            backgroundColor: "#f7f3f2",
            color: "#000",
            borderRadius: "100%",
            boxShadow: "1px 1px 2px rgba(0,0,0,0.4)",
            padding: 1,
          }}
        >
          <Rotate size={14} />
        </div>
        <span
          onMouseDown={(e) => handleResizeMouseDown(e, "resizing-tr")}
          style={{
            top: 0,
            position: "absolute",
            right: 0,
            cursor: "ne-resize",
            transform: "translate(50%,-50%)",
            ...resizeHandleStyles,
          }}
        />
        <span
          onMouseDown={(e) => handleResizeMouseDown(e, "resizing-bl")}
          style={{
            bottom: 0,
            position: "absolute",
            cursor: "sw-resize",
            left: 0,
            transform: "translate(-50%,50%)",
            ...resizeHandleStyles,
          }}
        />
        <span
          onMouseDown={(e) => handleResizeMouseDown(e, "resizing-br")}
          style={{
            bottom: 0,
            position: "absolute",
            cursor: "se-resize",
            right: 0,
            transform: "translate(50%,50%)",
            ...resizeHandleStyles,
          }}
        />
        <div
          onMouseDown={(e) => handleResizeMouseDown(e, "resizing-tl")}
          style={{
            position: "absolute",
            cursor: "nw-resize",
            top: 0,
            left: 0,
            transform: "translate(-50%,-50%)",
            ...resizeHandleStyles,
          }}
        />
      </div>
    </div>
  );
}

const resizeHandleStyles = {
  backgroundColor: "#f7f3f2",
  borderRadius: "100%",
  border: "1px solid gray",
  boxShadow: "1px 1px 2px rgba(0,0,0,0.4)",
  width: 15,
  height: 15,
};
