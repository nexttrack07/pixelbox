import { useRecoilCallback, useRecoilState, useSetRecoilState } from "recoil";
import {
  elementsState,
  elementState,
  SvgElement,
  BaseElement,
} from "stores/element.store";
import { SvgRenderer } from "./common/svg-renderer";

type SvgElementType = SvgElement & BaseElement

const items: SvgElementType[] = [
  {
    type: "svg",
    element: "rect",
    fill: "red",
    stroke: "blue",
    strokeWidth: 2,
    width: 100,
    height: 200,
    top: 100,
    left: 200,
    rotation: 0,
  },
  {
    type: "svg",
    element: "ellipse",
    fill: "red",
    strokeWidth: 2,
    width: 100,
    height: 100,
    top: 100,
    left: 200,
    rotation: 0,
  },
  {
    type: "svg",
    element: "path",
    stroke: "red",
    d: "M100,200 C100,100 400,100 400,200",
    width: 100,
    height: 30,
    top: 100,
    left: 200,
    rotation: 0,
  },
];

export function GraphicsPanel() {
  const [elements, setElements] = useRecoilState(elementsState);
  const setElementState = useSetRecoilState(elementState(elements.length));

  function handleAddElement(item: SvgElementType) {
    const newId = elements.length;
    setElements((elements) => [...elements, newId]);
    setElementState({
      ...item,
    });
  }

  return (
    <>
      <div className="flex space-x-2 space-y-2 flex-wrap p-4 justify-center">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => handleAddElement(item)}
            className="w-24 h-24 text-gray-100"
          >
            <SvgRenderer svg={item} />
          </button>
        ))}
      </div>
    </>
  );
}
