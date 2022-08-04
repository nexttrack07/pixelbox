import { useSetDefaultDimensions } from "hooks";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { Element, elementState, isSelectedState, SvgElement } from "stores/element.store";
import { SvgRenderer } from "./common/svg-renderer";
import { Dimension, Moveable, Position } from "./moveable";

type Props = {
  id: number;
  element: SvgElement;
  onSelect: VoidFunction;
};

function isSvgElement(element: Element): element is SvgElement {
  return element.type === "svg"
}

export function SvgContainer({ id, element, onSelect }: Props) {
  const setElement = useSetRecoilState(elementState(id));
  const isSelected = useRecoilValue(isSelectedState(id));
  useSetDefaultDimensions(id);

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
    setElement((el) => {
      if (isSvgElement(el)) {
        return {
          ...el,
          width: dimension.width,
          height: (dimension.width * el.height) / el.width,
        };
      }

      return el;
    });
  }

  const { type, top, left, height, width, rotation, ...svgProps } = element;

  return (
    <div
      id="svg-container"
      style={{
        position: "absolute",
        transform: `rotate(${rotation}deg)`,
        left: left,
        top: top,
        width: width,
        height: height,
        cursor: isSelected ? "move" : "pointer",
      }}
      onMouseDown={onSelect}
    >
      <SvgRenderer svg={svgProps} />
      {isSelected && (
        <Moveable
          onDrag={handleDrag}
          onResize={handleResize}
          onRotate={handleRotate}
          styleProps={{
            width: element.width,
            height: element.height,
            top: element.top,
            left: element.left,
            rotation: element.rotation,
          }}
        />
      )}
    </div>
  );
}
