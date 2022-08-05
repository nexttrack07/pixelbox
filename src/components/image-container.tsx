import { useSetDefaultDimensions } from "hooks";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  Element,
  elementState,
  ImageElement,
  isSelectedState,
} from "stores/element.store";
import { Dimension, Moveable, Position } from "./moveable";

type Props = {
  id: number;
  element: ImageElement;
  onSelect: VoidFunction;
};

function isImageElement(element: Element): element is ImageElement {
  return (element as ImageElement).src !== undefined;
}

export function ImageContainer({ id, element, onSelect }: Props) {
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
      if (isImageElement(el)) {
        return {
          ...el,
          width: dimension.width,
          height: (dimension.width * el.height) / el.width,
        };
      }

      return el;
    });
  }

  console.log("mask: ", element.mask)

  return (
    <div
      id="image-container"
      style={{
        position: "absolute",
        transform: `rotate(${element.rotation}deg)`,
        left: element.left,
        top: element.top,
        width: element.width,
        height: element.height,
        cursor: isSelected ? "move" : "pointer",
      }}
      onMouseDown={onSelect}
    >
      <img
        className={element.mask ? `mask mask-${element.mask}` : ""}
        // className="mask mask-circle"
        src={element.src}
      />
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
