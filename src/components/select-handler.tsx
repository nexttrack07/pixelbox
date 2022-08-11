import {
  DefaultValue,
  selector,
  useRecoilState,
} from "recoil";
import {
  elementState,
  selectedElementIdsState,
} from "stores/element.store";
import { Dimension, Moveable, Position } from "./moveable";

const selectedBoxPosition = selector<{ left: number; top: number }>({
  key: "selectedBoxPosition",
  get: ({ get }) => {
    const selectedElementIds = get(selectedElementIdsState);
    const selectedElements = selectedElementIds.map((id) => get(elementState(id)));
    const left = selectedElements.reduce((prev, el) => Math.min(prev, el.left), Infinity);
    const top = selectedElements.reduce((prev, el) => Math.min(prev, el.top), Infinity);

    return { left, top };
  },
  set: ({ set, get }, newVal) => {
    if (newVal instanceof DefaultValue) {
      return;
    }
    const selectedElementIds = get(selectedElementIdsState);

    if (selectedElementIds.length === 0) return;

    selectedElementIds.forEach((id) => {
      set(elementState(id), (el) => ({
        ...el,
        top: el.top + newVal.top,
        left: el.left + newVal.left,
      }));
    });
  },
});

const selectedBoxDimensions = selector<{ width: number; height: number }>({
  key: "selectedBoxDimensions",
  get: ({ get }) => {
    const selectedElementIds = get(selectedElementIdsState);
    const selectedElements = selectedElementIds.map((id) => get(elementState(id)));
    const { left, top } = get(selectedBoxPosition);
    const width = selectedElements.reduce(
      (prev, el) => Math.max(prev, el.left + (el.width ?? 0) - left),
      0
    );
    const height = selectedElements.reduce(
      (prev, el) => Math.max(prev, el.top + (el.height ?? 0) - top),
      0
    );

    return { width, height };
  },
  set: ({ set, get }, newVal) => {
    if (newVal instanceof DefaultValue) {
      return;
    }

    const selectedElementIds = get(selectedElementIdsState);

    if (selectedElementIds.length === 0) return;

    selectedElementIds.forEach((id) => {
      set(elementState(id), (el) => {
        return {
          ...el,
          height: (el.height ?? 0) + newVal.height,
          width: (el.width ?? 0) + newVal.width,
        }
      });
    });
  },
});

export function SelectHandler() {
  const [selectedPosition, setSelectedPosition] = useRecoilState(selectedBoxPosition);
  const [selectedDimension, setSelectedDimension] = useRecoilState(selectedBoxDimensions);

  if (selectedPosition.left === Infinity && selectedDimension.width === 0) return null;

  function handleDrag(pos: Position) {
    setSelectedPosition({ left: pos.x, top: pos.y });
  }

  function handleRotate(rotation: number) {
  }

  function handleResize(dimension: Dimension) {
    setSelectedDimension({ width: dimension.width, height: dimension.height });
  }

  const { left, top } = selectedPosition;
  const { width, height } = selectedDimension;
  return (
    <Moveable
      onDrag={handleDrag}
      onResize={handleResize}
      onRotate={handleRotate}
      styleProps={{
        width,
        height,
        left,
        top,
        rotation: 0,
      }}
    />
  );
}
