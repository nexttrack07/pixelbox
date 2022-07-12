import { useOutsideClick } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { elementState, isSelectedState, TextElement } from "stores/element.store";
import { Dimension, Moveable, Position } from "./moveable";

export function TextComponent({
  id,
  element,
  onSelect,
}: {
  id: number;
  element: TextElement;
  onSelect: VoidFunction;
}) {
  const setElement = useSetRecoilState(elementState(id));
  const isSelected = useRecoilValue(isSelectedState(id));
  const [contentEditable, setContentEditable] = useState(false);
  const [dimension, setDimension] = useState({ width: 500, height: 50 });
  const textRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: textContainerRef,
    handler: () => setContentEditable(false),
  });

  useEffect(() => {
    if (textRef.current) {
      setDimension({
        width: textRef.current.offsetWidth + 10,
        height: textRef.current.offsetHeight + 10,
      });
    }
  }, [textRef]);

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
    setDimension(dimension);
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
        width: dimension.width,
        height: dimension.height,
        cursor: contentEditable ? "text" : "grab",
      }}
      onMouseDown={onSelect}
      onDoubleClick={() => setContentEditable(true)}
      ref={textContainerRef}
    >
      <span contentEditable={contentEditable} style={{ padding: 2 }} ref={textRef}>
        {element.content}
      </span>
      {isSelected && !contentEditable && (
        <Moveable
          onDrag={handleDrag}
          onResize={handleResize}
          onRotate={handleRotate}
          styleProps={{
            width: dimension.width,
            height: dimension.height,
            top: element.top,
            left: element.left,
            rotation: element.rotation,
          }}
        />
      )}
    </div>
  );
}
