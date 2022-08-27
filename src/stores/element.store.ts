import { atom, atomFamily, DefaultValue, selector, selectorFamily } from "recoil";

export const elementsState = atom<number[]>({
  key: "elements",
  default: [],
});

export interface BaseElement {
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

export type SvgBase = {
  type: "svg";
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
};

export type Rect = {
  element: "rect";
  rx?: number;
  width: number;
  height: number;
};

export type Circle = {
  element: "circle";
  r?: number;
  width: number;
  height: number;
};

export type Ellipse = {
  element: "ellipse";
  rx?: number;
  ry?: number;
  width: number;
  height: number;
};

export type Path = {
  element: "path";
  d?: string;
};

export type Point = {
  position: Coordinate;
  control: Coordinate;
}

export type Curve = {
  type: "curve";
  element: "curve";
  top: number;
  left: number;
  points: Point[];
}

export type SvgType = Rect | Circle | Ellipse | Path;

export type SvgElement = SvgBase & SvgType;

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  mask: "circle" | "squircle" | "hexagon" | "diamond";
}

type Coordinate = { x: number; y: number; }



export type PositionElement = BaseElement &
  (RectangleElement | TextElementBase | TextElement | SvgElement | ImageElement);

export type Element = PositionElement | Curve;

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
  effects: [
    ({ onSet }) => {
      onSet((val) => console.log("selected items: ", val));
    },
  ],
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

export function isSvgElement(element?: Element): element is SvgElement & BaseElement {
  return element?.type === "svg";
}

export const svgSelector = selectorFamily<any, keyof SvgElement>({
  key: "svgSelector",
  get:
    (prop) =>
    ({ get }) => {
      const selectedElement = get(selectedElementState);

      if (isSvgElement(selectedElement)) {
        const val = selectedElement[prop];
        return val;
      }

      return null;
    },
  set:
    (prop) =>
    ({ set }, val) => {
      if (val instanceof DefaultValue) return;
      set(selectedElementState, (el) => {
        if (isSvgElement(el)) {
          return {
            ...el,
            [prop]: val,
          };
        }

        return el;
      });
    },
});

export function isTextElement(element?: Element): element is TextElement {
  return (element as TextElement).type === "text";
}

export const textSelector = selectorFamily<any, keyof TextElement>({
  key: "textSelector",
  get:
    (prop) =>
    ({ get }) => {
      const selectedElement = get(selectedElementState);

      if (isTextElement(selectedElement)) {
        return selectedElement[prop];
      }

      return null;
    },
  set:
    (prop) =>
    ({ set }, val) => {
      if (val instanceof DefaultValue) return;

      set(selectedElementState, (el) => {
        if (isTextElement(el)) {
          return {
            ...el,
            [prop]: val,
          };
        }

        return el;
      });
    },
});
