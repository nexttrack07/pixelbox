import {
  DefaultValue,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import {
  elementState,
  selectedElementIdsState,
} from "stores/element.store";
import { getCurveDimensions } from "./element";
import { Dimension, Moveable, MoveableLine, Position } from "./moveable";

export const selectedBoxPosition = selector<{ left: number; top: number }>({
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

export const selectedBoxDimensions = selector<{ width: number; height: number }>({
  key: "selectedBoxDimensions",
  get: ({ get }) => {
    const selectedElementIds = get(selectedElementIdsState);
    const selectedElements = selectedElementIds.map((id) => get(elementState(id)));
    const { left, top } = get(selectedBoxPosition);
    const width = selectedElements.reduce(
      (prev, el) => {
        let h, w;
        if (el.type === "curve") {
          w = getCurveDimensions(el).width;
        } else {
          w = el.width;
        }
        return Math.max(prev, el.left + (w ?? 0) - left)
      },
      0
    );
    const height = selectedElements.reduce(
      (prev, el) => {
        let h;
        if (el.type === "curve") {
          h = getCurveDimensions(el).height;
        } else {
          h = el.height
        }
        return Math.max(prev, el.top + (h ?? 0) - top)
      },
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
        let h, w;
        if (el.type === "curve") {
          const { width, height } = getCurveDimensions(el);
          h = height, w = width;
        } else {
          h = el.height, w = el.width;
        }
        return {
          ...el,
          height: (h ?? 0) + newVal.height,
          width: (w ?? 0) + newVal.width,
        }
      });
    });
  },
});

const curveSelector = selector({
  key: "curve-selector",
  get: ({ get }) => {
    const selectedAtoms = get(selectedElementIdsState);
    if (selectedAtoms.length === 1) {
      const el = get(elementState(selectedAtoms[0]));
      return el.type === "curve" ? el : null;
    }

    return null;
  }
})


export function SelectHandler() {
  const [selectedPosition, setSelectedPosition] = useRecoilState(selectedBoxPosition);
  const [selectedDimension, setSelectedDimension] = useRecoilState(selectedBoxDimensions);
  const curve = useRecoilValue(curveSelector);

  if (selectedPosition.left === Infinity && selectedDimension.width === 0) return null;

  if (curve) {
    const f = () => { }
    return <MoveableLine onDrag={f} onResize={f} onRotate={f} curve={curve} />
  }

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
