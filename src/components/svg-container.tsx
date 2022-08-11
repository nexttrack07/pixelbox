import { useEventListener } from 'hooks';
import React, { forwardRef } from 'react';
import { BaseElement, SvgElement } from "stores/element.store";
import { SvgRenderer } from "./common/svg-renderer";

type Props = {
  id: number;
  element: SvgElement & BaseElement;
  onSelect: (e: React.MouseEvent) => void;
};

export const SvgContainer = forwardRef<HTMLDivElement, Props>(({ element, onSelect }, ref) => {
  const { top, left, height, width, rotation } = element;

  function handleMouseDown(e: React.MouseEvent) {
    e.stopPropagation();
    onSelect(e);
  }

  return (
    <div
      ref={ref}
      id="svg-container"
      style={{
        position: "absolute",
        transform: `rotate(${rotation}deg)`,
        left: left,
        top: top,
        width: width,
        height: height,
      }}
      onClick={handleMouseDown}
    >
      <SvgRenderer svg={element} />
    </div>
  );
})
