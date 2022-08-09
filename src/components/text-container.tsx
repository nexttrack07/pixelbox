import { useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import {
  elementState,
  TextElement,
  TextElementBase,
} from "stores/element.store";

const TEXT_PADDING = 10;

export function TextContainer({
  id,
  element,
  onSelect,
}: {
  id: number;
  element: TextElement | TextElementBase;
  onSelect: (e: React.MouseEvent) => void;
}) {
  const setElement = useSetRecoilState(elementState(id));
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
    </div>
  );
}
