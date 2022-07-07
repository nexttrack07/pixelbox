import { useCallback, MouseEvent as ReactMouseEvent, useRef, useState, RefObject } from "react";
import { Box } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { elementState, isSelectedState, selectedElementIdsState } from "stores/element.store";
import { useEventListener, useSetDefaultDimensions, useShiftKeyPressed } from "hooks";
import { Rotate } from "tabler-icons-react";

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
        left: Math.min(Math.max(0, el.style.left + delta.x), 700 - el.style.width),
        top: Math.min(Math.max(0, el.style.top + delta.y), 550 - el.style.height),
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

  function renderElement() {
    if (element.type === "svg") {
      return <div dangerouslySetInnerHTML={{ __html: element.html }} />;
    } else if (element.type === "text") {
      return <Box sx={{ fontSize: element.fontSize }}>{element.content}</Box>;
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
    >
      {renderElement()}
    </Moveable>
  );
}

type Status = "idle" | "rotating" | "moving" | "reszing";
type PositionDelta = { x: number; y: number };
type MoveableProps = {
  onDrag: (p: PositionDelta) => void;
  children: JSX.Element;
  onMouseDown: () => void;
  onRotate: (r: number) => void;
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
  onRotate,
  children,
  styleProps: { rotation, ...styles },
}: MoveableProps) {
  const documentRef = useRef<Document>(document);
  const rotateRef = useRef<HTMLDivElement>(null);
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

  function getDegrees(mouseX: number, mouseY: number, ref: RefObject<HTMLDivElement>) {
    if (!ref.current) return 0;

    const rect = ref.current.getBoundingClientRect();
    const rectX = rect.left + rect.width / 2;
    const rectY = rect.top + rect.height / 2;
    const angle = Math.atan2(mouseY - rectY, mouseX - rectX) + Math.PI / 2;
    return Math.round((angle * 180) / Math.PI);
  }
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (status === "moving") {
        console.log("moving...");
        onDrag({ x: e.movementX, y: e.movementY });
      } else if (status === "rotating") {
        if (!rotateRef.current) return;
        const r = getDegrees(e.clientX, e.clientY, rotateRef);
        onRotate(r);
      }
    },
    [status, rotateRef]
  );

  useEventListener("mouseup", handleMouseUp);
  useEventListener("mousemove", handleMouseMove, documentRef, [status, rotateRef]);

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
      ref={rotateRef}
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
          sx={{
            top: 0,
            right: 0,
            transform: "translate(50%,-50%)",
            ...resizeHandleStyles,
          }}
        />
        <Box
          sx={{
            bottom: 0,
            left: 0,
            transform: "translate(-50%,50%)",
            ...resizeHandleStyles,
          }}
        />
        <Box
          sx={{
            bottom: 0,
            right: 0,
            transform: "translate(50%,50%)",
            ...resizeHandleStyles,
          }}
        />
        <Box
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
