import { useEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  elementState,
  isSelectedState,
  TextElement,
  TextElementBase,
} from "stores/element.store";
import { Dimension, Moveable, Position } from "./moveable";

const TEXT_PADDING = 10;

export function TextContainer({
  id,
  element,
  onSelect,
}: {
  id: number;
  element: TextElement | TextElementBase;
  onSelect: VoidFunction;
}) {
  const setElement = useSetRecoilState(elementState(id));
  const isSelected = useRecoilValue(isSelectedState(id));
  const textRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const width = textRef.current.offsetWidth + TEXT_PADDING;
      const height = textRef.current.offsetHeight + TEXT_PADDING;

      setElement((el) => {
        if (el.type === "textBase") {
          return {
            ...el,
            type: "text",
            width,
            height,
          };
        }

        return el;
      });
    }
  }, [textRef.current]);

  function handleDrag(pos: Position) {
    setElement((el) => ({
      ...el,
      left: pos.x,
      top: pos.y,
    }));
  }

  function handleRotate(rotation: number) {
    setElement((el) => ({
      ...el,
      rotation,
    }));
  }

  function handleResize(dimension: Dimension) {
    console.log("dimensions: ", dimension);
    setElement((el) => ({
      ...el,
      width: dimension.width,
      height: dimension.height,
    }));
  }

  return (
    <div
      id="text-container"
      style={{
        fontFamily: element.font.family,
        fontSize: element.font.size,
        letterSpacing: element.font.spacing,
        position: "absolute",
        transform: `rotate(${element.rotation}deg)`,
        left: element.left,
        top: element.top,
        width: element.width,
        height: element.height,
        cursor: isSelected ? "move" : "pointer",
      }}
      onMouseDown={onSelect}
      ref={textContainerRef}
    >
      <span
        ref={textRef}
        onKeyUp={(e) => {
          console.log(e.currentTarget.textContent);
          setElement((el) => ({
            ...el,
            content: e.currentTarget.textContent || "",
          }));
        }}
      >
        {element.content}
      </span>
      {isSelected && element.height && element.width && (
        <Moveable
          onDrag={handleDrag}
          onResize={handleResize}
          onRotate={handleRotate}
          styleProps={{
            top: element.top,
            left: element.left,
            height: element.height,
            width: element.width,
            rotation: element.rotation,
          }}
        />
      )}
    </div>
  );
}
