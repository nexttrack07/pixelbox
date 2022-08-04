import { atom, atomFamily, DefaultValue, selector, selectorFamily } from "recoil";

export const elementsState = atom<number[]>({
  key: "elements",
  default: [],
});

interface BaseElement {
  top: number;
  left: number;
  rotation: number;
  width: number;
  height: number;
}

export interface RectangleElement extends BaseElement {
  type: "rectangle";
  backgroundColor: string;
}

export interface TextElementBase extends Omit<BaseElement, "width" | "height"> {
  type: "textBase";
  content: string;
  height?: number;
  width?: number;
  font: {
    size: number;
    italic: boolean;
    color: string;
    bold: boolean;
    family: string;
    height: number;
    spacing: number;
    underline: boolean;
  };
}

export interface TextElement extends Omit<TextElementBase, "type"> {
  type: "text";
  height: number;
  width: number;
}

export interface SvgElement extends BaseElement {
  type: "svg";
  html: string;
  src: string;
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  mask?: "circle";
}

export type Element =
  | RectangleElement
  | TextElementBase
  | TextElement
  | SvgElement
  | ImageElement;

export const defaultStyle = {
  top: 20,
  left: 20,
  width: 200,
  height: 170,
  rotation: 0,
};

export const elementState = atomFamily<Element, number>({
  key: "element",
  default: () => ({
    type: "rectangle",
    backgroundColor: "#2345f4",
    ...defaultStyle,
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
export const selectedElementState = selector<Element | undefined>({
  key: "selectedElement",
  get: ({ get }) => {
    const ids = get(selectedElementIdsState);

    if (ids.length >= 1) {
      return get(elementState(ids[0]));
    }
  },
  set: ({ set, get }, newElementValue) => {
    const ids = get(selectedElementIdsState);

    if (ids.length >= 1 && newElementValue) {
      set(elementState(ids[0]), newElementValue);
    }
  },
});

export const selectedElementType = selector({
  key: "selectedElementType",
  get: ({ get }) => {
    const selectedElement = get(selectedElementState);

    return selectedElement?.type;
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

export const canvasState = selector<Element[]>({
  key: "canvasState",
  get: ({ get }) => {
    const elementIds = get(elementsState);

    let items: Element[] = [];
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
