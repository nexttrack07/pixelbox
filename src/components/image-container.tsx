import { useSetDefaultDimensions } from "hooks";
import { ImageElement } from "stores/element.store";

type Props = {
  id: number;
  element: ImageElement;
  onSelect: (e: React.MouseEvent) => void;
};

export function ImageContainer({ id, element, onSelect }: Props) {
  useSetDefaultDimensions(id);

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
        cursor: "pointer",
      }}
      onMouseDown={onSelect}
    >
      <img
        className={element.mask ? `mask mask-${element.mask}` : ""}
        // className="mask mask-circle"
        src={element.src}
      />
    </div>
  );
}
