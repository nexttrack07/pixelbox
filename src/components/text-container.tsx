import React, { forwardRef, useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import {
  elementState,
  TextElement,
  TextElementBase,
} from "stores/element.store";

const TEXT_PADDING = 10;

type Props = {
  id: number;
  element: TextElement | TextElementBase;
  onSelect: (e: React.MouseEvent) => void;
}

export const TextContainer = forwardRef<HTMLDivElement, Props>(({
  id,
  element,
  onSelect,
}, ref) => {
  const setElement = useSetRecoilState(elementState(id));
  const textRef = useRef<HTMLDivElement>(null);

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

  function handleMouseDown(e: React.MouseEvent) {
    e.stopPropagation();
    onSelect(e);
  }


  return (
    <div
      id="text-container"
      style={{
        fontFamily: element.font.family,
        fontSize: element.font.size,
        letterSpacing: element.font.spacing,
        color: element.font.color,
        fontWeight: element.font.bold ? "bold" : "normal",
        fontStyle: element.font.italic ? "italic" : "normal",
        textDecoration: element.font.underline ? "underline" : "",
        position: "absolute",
        transform: `rotate(${element.rotation}deg)`,
        left: element.left,
        top: element.top,
        width: element.width,
        height: element.height,
        cursor: "pointer",
      }}
      onClick={handleMouseDown}
      ref={ref}
    >
      <span
        ref={textRef}
        onKeyUp={(e) => {
          setElement((el) => ({
            ...el,
            content: e.currentTarget.textContent || "",
          }));
        }}
      >
        {element.content}
      </span>
    </div>
  );
})
