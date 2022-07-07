import {
  useCallback,
  MouseEvent as ReactMouseEvent,
  useRef,
  useState,
  Attributes,
  StyleHTMLAttributes,
} from "react";
import { Box } from "@chakra-ui/react";
import { selectorFamily, useRecoilState } from "recoil";
import { elementState } from "stores/element.store";
import { useEventListener } from "hooks";

type ElementProps = {
  id: number;
};

/**
 * Returns the width and height for the specified image.
 */
export const getImageDimensions = (src: string) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.width, height: image.height });
    };
    image.onerror = (error) => {
      reject(error);
    };
    image.src = src;
  });
};

const imageSizeState = selectorFamily({
  key: "imageSize",
  get: (src: string) => () => {
    if (!src) return;

    return getImageDimensions(src);
  },
});

export function Element({ id }: ElementProps) {
  const [element, setElement] = useRecoilState(elementState(id));

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
    <Moveable styleProps={element.style} onDrag={handleDrag}>
      {renderElement()}
    </Moveable>
  );
}

type Status = "idle" | "rotating" | "moving" | "reszing";
type PositionDelta = { x: number; y: number };
type MoveableProps = {
  onDrag: (p: PositionDelta) => void;
  children: JSX.Element;
  styleProps: {
    height: number;
    width: number;
    top: number;
    left: number;
  };
};

function Moveable({ onDrag, children, styleProps }: MoveableProps) {
  const documentRef = useRef<Document>(document);
  const [status, setStatus] = useState<Status>("idle");

  const handleMouseUp = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setStatus("idle");
  }, []);

  const handleDragMouseDown = useCallback((e: ReactMouseEvent) => {
    e.stopPropagation();
    setStatus("moving");
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (status === "moving") {
        onDrag({ x: e.movementX, y: e.movementY });
      }
    },
    [status]
  );

  useEventListener("mouseup", handleMouseUp);
  useEventListener("mousemove", handleMouseMove, documentRef, [status]);

  return (
    <div
      onMouseDown={handleDragMouseDown}
      style={{
        position: "absolute",
        ...styleProps,
      }}
    >
      {children}
    </div>
  );
}
