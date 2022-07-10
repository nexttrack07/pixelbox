import { useCallback, MouseEvent as ReactMouseEvent, useRef, useState, RefObject } from "react";
import { Box } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  elementState,
  isSelectedState,
  selectedElementIdsState,
  CommonState,
  TextState,
} from "stores/element.store";
import { useEventListener, useSetDefaultDimensions, useShiftKeyPressed } from "hooks";
import { Rotate, X } from "tabler-icons-react";

type ElementProps = {
  id: number;
};

export function Element({ id }: ElementProps) {
  const [element, setElement] = useRecoilState(elementState(id));
  const setSelectedElement = useSetRecoilState(selectedElementIdsState);
  const isSelected = useRecoilValue(isSelectedState(id));
  const shiftKeyPressed = useShiftKeyPressed();
  useSetDefaultDimensions(id);

  function handleDrag(delta: { x: number; y: number }) {
    setElement((el) => ({
      ...el,
      style: {
        ...el.style,
        left: delta.x,
        top: delta.y,
      },
    }));
  }

  function handleSelectElement() {
    setSelectedElement((ids) => {
      if (isSelected) return ids;

      if (shiftKeyPressed) return [...ids, id];

      return [id];
    });
  }

  function handleRotate(rotation: number) {
    setElement((el) => ({
      ...el,
      style: {
        ...el.style,
        rotation,
      },
    }));
  }

  function handleResize(dimension: DimensionDelta) {
    setElement((el) => ({
      ...el,
      style: {
        ...el.style,
        width: dimension.width,
        height: dimension.height,
      },
    }));
  }

  function renderElement() {
    if (element.type === "svg") {
      return <div dangerouslySetInnerHTML={{ __html: element.html }} />;
    } else if (element.type === "text") {
      return (
        <Box
          contentEditable
          onInput={(e) => {
            setElement((element) => ({
              ...element,
              content: e.currentTarget.textContent,
            }));
          }}
          sx={{ fontSize: element.fontSize, color: element.color }}
        >
          {element.content}
        </Box>
      );
    } else {
      return <Box>Type: {element.type}</Box>;
    }
  }

  return (
    <Moveable
      show={isSelected}
      styleProps={element.style}
      onMouseDown={handleSelectElement}
      onRotate={handleRotate}
      onDrag={handleDrag}
      onResize={handleResize}
    >
      {renderElement()}
    </Moveable>
  );
}

type Status =
  | "idle"
  | "rotating"
  | "moving"
  | "resizing-br"
  | "resizing-tl"
  | "resizing-bl"
  | "resizing-tr";
type PositionDelta = { x: number; y: number };
type DimensionDelta = { width: number; height: number };
type MoveableProps = {
  onDrag: (p: PositionDelta) => void;
  children: JSX.Element;
  onMouseDown: () => void;
  onRotate: (r: number) => void;
  onResize: (d: DimensionDelta) => void;
  show: boolean;
  styleProps: {
    height: number;
    width: number;
    top: number;
    left: number;
    rotation: number;
  };
};

function Moveable({
  show,
  onDrag,
  onMouseDown,
  onResize,
  onRotate,
  children,
  styleProps: { rotation, ...styles },
}: MoveableProps) {
  const documentRef = useRef<Document>(document);
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseUp = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setStatus("idle");
  }, []);

  const handleDragMouseDown = useCallback((e: ReactMouseEvent) => {
    e.stopPropagation();
    setStatus("moving");
    setMouse({ x: e.clientX, y: e.clientY });
  }, []);

  const handleRotateMouseDown = useCallback((e: ReactMouseEvent) => {
    e.stopPropagation();
    setStatus("rotating");
  }, []);

  const handleResizeMouseDown = (e: ReactMouseEvent, stat: Status) => {
    e.stopPropagation();
    setStatus(stat);
    setMouse({ x: e.clientX, y: e.clientY });
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
      const newX = mouse.x - e.clientX;
      const newY = mouse.y - e.clientY;

      let x = styles.left - newX;
      let y = styles.top - newY;

      x = Math.min(Math.max(0, x), 700 - styles.width);
      y = Math.min(Math.max(0, y), 550 - styles.height);

      onDrag({ x, y });
      setMouse({ x: e.clientX, y: e.clientY });
    } else if (status === "rotating") {
      if (!ref.current) return;
      const r = getDegrees(e.clientX, e.clientY, ref);
      onRotate(r);
    } else if (status === "resizing-br") {
      if (!ref.current) return;

      const width = styles.width - (mouse.x - e.clientX);
      const height = styles.height - (mouse.y - e.clientY);

      onResize({ width, height });
    } else if (status === "resizing-tl") {
      const width = styles.width + (mouse.x - e.clientX);
      const height = styles.height + (mouse.y - e.clientY);
      const x = styles.left - (mouse.x - e.clientX);
      const y = styles.top - (mouse.y - e.clientY);

      onDrag({ x, y });
      onResize({ width, height });
    } else if (status === "resizing-bl") {
      const width = styles.width + (mouse.x - e.clientX);
      const height = styles.height - (mouse.y - e.clientY);
      const x = styles.left - (mouse.x - e.clientX);
      const y = styles.top;

      onDrag({ x, y });
      onResize({ width, height });
    } else if (status === "resizing-tr") {
      const width = styles.width - (mouse.x - e.clientX);
      const height = styles.height + (mouse.y - e.clientY);
      const x = styles.left;
      const y = styles.top - (mouse.y - e.clientY);
      onDrag({ x, y });
      onResize({ width, height });
    }
  };

  useEventListener("mouseup", handleMouseUp);
  useEventListener("mousemove", handleMouseMove, documentRef, [status, ref]);

  if (!show)
    return (
      <div
        style={{
          position: "absolute",
          transform: `rotate(${rotation}deg)`,
          ...styles,
        }}
        onMouseDown={onMouseDown}
      >
        {children}
      </div>
    );

  return (
    <Box
      onMouseDown={handleDragMouseDown}
      ref={ref}
      style={{
        position: "absolute",
        transform: `rotate(${rotation}deg)`,
        ...styles,
      }}
    >
      {children}
      <Box
        sx={{
          position: "absolute",
          border: "2px solid",
          borderColor: "blue.400",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          transform: "scale(1.20)",
        }}
      >
        <Box
          onMouseDown={handleRotateMouseDown}
          sx={{
            left: "50%",
            transform: "translateX(-50%)",
            top: "-40px",
            position: "absolute",
            backgroundColor: "gray.100",
            borderRadius: "100%",
            border: "1px solid",
            borderColor: "gray.400",
            boxShadow: "1px 1px 2px rgba(0,0,0,0.4)",
            padding: 0.5,
          }}
        >
          <Rotate size={14} />
        </Box>
        <Box
          onMouseDown={(e) => handleResizeMouseDown(e, "resizing-tr")}
          sx={{
            top: 0,
            right: 0,
            transform: "translate(50%,-50%)",
            ...resizeHandleStyles,
          }}
        />
        <Box
          onMouseDown={(e) => handleResizeMouseDown(e, "resizing-bl")}
          sx={{
            bottom: 0,
            left: 0,
            transform: "translate(-50%,50%)",
            ...resizeHandleStyles,
          }}
        />
        <Box
          onMouseDown={(e) => handleResizeMouseDown(e, "resizing-br")}
          sx={{
            bottom: 0,
            right: 0,
            transform: "translate(50%,50%)",
            ...resizeHandleStyles,
          }}
        />
        <Box
          onMouseDown={(e) => handleResizeMouseDown(e, "resizing-tl")}
          sx={{
            top: 0,
            left: 0,
            transform: "translate(-50%,-50%)",
            ...resizeHandleStyles,
          }}
        />
      </Box>
    </Box>
  );
}

const resizeHandleStyles = {
  position: "absolute",
  backgroundColor: "gray.100",
  borderRadius: "100%",
  border: "1px solid",
  borderColor: "gray.500",
  boxShadow: "1px 1px 2px rgba(0,0,0,0.4)",
  width: 15,
  height: 15,
};
