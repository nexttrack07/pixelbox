import {
  atom,
  atomFamily,
  DefaultValue,
  selector,
  selectorFamily,
} from "recoil";

export const elementsState = atom<number[]>({
  key: "elements",
  default: [],
});

export type CommonState = {
  style: {
    top: number;
    left: number;
    width: number | "auto";
    height: number | "auto";
  };
};

type RectangleState = {
  type: "rectangle";
  color: string;
};

type SvgState = {
  type: "svg";
  html: string;
};

type ImageState = {
  type: "image";
  src: string;
};

export type ElementState = CommonState &
  (RectangleState | ImageState | SvgState);

export const defaultStyle = {
  top: 20,
  left: 20,
  width: 200,
  height: 170,
};

export const elementState = atomFamily<ElementState, number>({
  key: "element",
  default: () => ({
    type: "rectangle",
    style: defaultStyle,
    color: "#2345f4",
  }),
});

/**
 * An atom that stores which Element is currently selected.
 */
export const selectedElementIdsState = atom<number[]>({
  key: "selectedElementId",
  default: [],
});

/**
 * A selector that returns the selected Element's state.
 */
export const selectedElementState = selector<ElementState | undefined>({
  key: "selectedElement",
  get: ({ get }) => {
    const ids = get(selectedElementIdsState);

    if (ids.length === 1) {
      return get(elementState(ids[0]));
    }
  },
  set: ({ set, get }, newElementValue) => {
    const ids = get(selectedElementIdsState);

    if (ids.length === 1 && newElementValue) {
      set(elementState(ids[0]), newElementValue);
    }
  },
});

/**
 * A selectorFamily that returns true if the provided
 * Element is currently selected.
 *
 * https://recoiljs.org/docs/api-reference/utils/selectorFamily
 */
export const isSelectedState = selectorFamily({
  key: "isSelected",
  get:
    (id: number) =>
    ({ get }) => {
      const selectedElementIds = get(selectedElementIdsState);
      return selectedElementIds.includes(id);
    },
});

export const canvasState = selector<ElementState[]>({
  key: "canvasState",
  get: ({ get }) => {
    const elementIds = get(elementsState);

    let items: ElementState[] = [];
    elementIds.forEach((id) => {
      const itemState = get(elementState(id));
      items.push(itemState);
    });

    return items;
  },
  set: ({ set }, state) => {
    if (state instanceof DefaultValue) return;

    set(
      elementsState,
      state.map((_, index) => index)
    );
    state.forEach((element, id) => {
      set(elementState(id), element);
    });
  },
});
