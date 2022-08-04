import { useRecoilState, useSetRecoilState } from "recoil";
import { elementsState, elementState, SvgType } from "stores/element.store";
import { SvgRenderer } from "./common/svg-renderer";


const items: SvgType[] = [
  { type: "svg", element: "rect", fill: "red", width: 100, height: 200, top: 100, left: 200, rotation: 0 },
  { type: "svg", element: "ellipse", fill: "red", width: 100, height: 100, top: 100, left: 200, rotation: 0 },
]

export function GraphicsPanel() {
  const [elements, setElements] = useRecoilState(elementsState);
  const setElementState = useSetRecoilState(elementState(elements.length));

  function handleAddElement(item: SvgType) {
    const newId = elements.length;
    setElements((elements) => [...elements, newId]);
    setElementState({
      ...item
    });
  }

  return (
    <>
      <div className="flex space-x-2 space-y-2 flex-wrap p-4 justify-center">
        {items.map((item, i) => (
          <button key={i} onClick={() => handleAddElement(item)} className="w-24 h-24 text-gray-100">
            <SvgRenderer svg={item} />
          </button>
        ))}
      </div>
    </>
  );
}
