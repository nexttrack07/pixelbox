import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  Curve,
  elementState,
  isSelectedState,
  selectedElementIdsState,
} from "stores/element.store";
import { getImageDimensions, useShiftKeyPressed } from "hooks";
import { TextContainer } from "./text-container";
import { SvgContainer } from "./svg-container";
import { ImageContainer } from "./image-container";
import React, { useRef } from "react";
import { SvgRenderer } from "./common/svg-renderer";

type ElementProps = {
  id: number;
};

export function Element({ id }: ElementProps) {
  const element = useRecoilValue(elementState(id));
  const setSelectedElement = useSetRecoilState(selectedElementIdsState);
  const isSelected = useRecoilValue(isSelectedState(id));
  const shiftKeyPressed = useShiftKeyPressed();
  const ref = useRef<HTMLDivElement>(null);

  function handleSelectElement(e: React.MouseEvent) {
    e.stopPropagation();
    setSelectedElement((ids) => {
      if (isSelected) return ids;

      if (shiftKeyPressed) {
        return [...ids, id];
      }

      return [id];
    });
  }

  function renderElement() {
    if (element.type === "svg") {
      return (
        <SvgContainer
          ref={ref}
          id={id}
          onSelect={handleSelectElement}
          element={element}
        />
      );
    } else if (element.type === "textBase" || element.type === "text") {
      return (
        <TextContainer
          ref={ref}
          id={id}
          onSelect={handleSelectElement}
          element={element}
        />
      );
    } else if (element.type === "image") {
      return (
        <ImageContainer
          ref={ref}
          id={id}
          onSelect={handleSelectElement}
          element={element}
        />
      );
    } else if (element.type === "curve") {
      const { width, height } = getCurveDimensions(element);
      return (
        <div
          ref={ref}
          id="curve-container"
          style={{ position: "absolute", left: element.left, top: element.top, width, height, cursor: "crosshair" }}
          onClick={handleSelectElement}
        >
          <SvgRenderer svg={element} />
        </div>
      );
    } else {
      return <div>Type: {element.type}</div>;
    }
  }

  return renderElement();
}

export function getCurveDimensions(element: Curve) {
  return {
    width: element.points.reduce((acc, p) => Math.max(acc, Math.max(p.position.x, p.control.x)), -Infinity),
    height: element.points.reduce((acc, p) => Math.max(acc, Math.max(p.position.y, p.control.y)), -Infinity)
  }
}
