import { useSetDefaultDimensions } from "hooks";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { elementState, isSelectedState, SvgElement } from "stores/element.store";
import { Dimension, Moveable, Position } from "./moveable";

type Props = {
  id: number;
  element: SvgElement;
  onSelect: VoidFunction;
};

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
    setElement((el) => ({
      ...el,
      ...dimension,
    }));
  }

  return (
    <div
      id="svg-container"
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
      <div dangerouslySetInnerHTML={{ __html: element.html }} />
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
