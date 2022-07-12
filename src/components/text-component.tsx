import { Box, Text } from "@chakra-ui/react";
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
  const [dimension, setDimension] = useState({ width: 500, height: 50 });
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setDimension({
        width: textRef.current.offsetWidth,
        height: textRef.current.offsetHeight,
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
    console.log(dimension);
  }

  return (
    <Box
      id="text-container"
      style={{
        fontFamily: element.font.family,
        fontSize: element.font.size,
        letterSpacing: element.font.spacing,
        lineHeight: element.font.height,
        position: "absolute",
        transform: `rotate(${element.rotation}deg)`,
        left: element.left,
        top: element.top,
        width: dimension.width,
        height: dimension.height,
      }}
    >
      <Moveable
        onDrag={handleDrag}
        onResize={handleResize}
        onRotate={handleRotate}
        onMouseDown={onSelect}
        show={isSelected}
        styleProps={{
          width: dimension.width,
          height: dimension.height,
          top: element.top,
          left: element.left,
          rotation: element.rotation,
        }}
      >
        <span ref={textRef}>{element.content}</span>
      </Moveable>
    </Box>
  );
}
